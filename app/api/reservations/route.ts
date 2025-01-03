import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/api/firebase';
import { doc, runTransaction, collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const { restaurantId, tableId, userId, date, time } = await req.json();

  if (!restaurantId || !tableId || !userId || !date || !time) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const restaurantRef = doc(db, 'restaurants', restaurantId);

    await runTransaction(db, async (transaction) => {
      const restaurantSnap = await transaction.get(restaurantRef);

      if (!restaurantSnap.exists()) {
        throw new Error('Restaurant not found');
      }

      const restaurantData = restaurantSnap.data();
      const tables = restaurantData.tables || [];

      // Find the index of the table
      const tableIndex = tables.findIndex((t: any) => t.id === tableId);

      if (tableIndex === -1) {
        throw new Error('Table not found');
      }

      const table = tables[tableIndex];

      // Find the index of the time slot
      const timeSlotIndex = table.timeSlots.findIndex(
        (slot: any) => slot.time === time
      );

      if (timeSlotIndex === -1) {
        throw new Error('Time slot not found');
      }

      const timeSlot = table.timeSlots[timeSlotIndex];

      if (timeSlot.status !== 'available') {
        throw new Error('Time slot is not available');
      }

      // Update the specific time slot's status
      table.timeSlots[timeSlotIndex] = {
        ...timeSlot,
        status: 'reserved',
      };

      // Update the table's reservations
      table.reservations = [
        ...(table.reservations || []),
        { date, time },
      ];

      // Update the entire tables array with the modified table
      tables[tableIndex] = table;

      transaction.update(restaurantRef, { tables });
    });

    // Record the user's reservation in the 'reservations' collection
    const reservationRef = collection(db, 'reservations');
    await addDoc(reservationRef, {
      restaurantId,
      tableId,
      userId,
      date,
      time,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Reservation made successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error making reservation:', error.message);
    const status = error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ message: error.message }, { status });
  }
}