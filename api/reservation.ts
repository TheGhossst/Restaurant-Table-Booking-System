import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { restaurantId, tableId, date, time } = req.body

    if (!restaurantId || !tableId || !date || !time) {
        return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
        const restaurantRef = doc(db, 'restaurants', restaurantId)
        const restaurantDoc = await getDoc(restaurantRef)

        if (!restaurantDoc.exists()) {
            return res.status(404).json({ message: 'Restaurant not found' })
        }

        const restaurant = restaurantDoc.data()
        const table = restaurant.tables.find((t: any) => t.id === tableId)

        if (!table) {
            return res.status(404).json({ message: 'Table not found' })
        }

        if (table.status === 'occupied') {
            return res.status(400).json({ message: 'Table is already occupied' })
        }

        // Update table status
        table.status = 'occupied'

        // Add reservation to the table
        if (!table.reservations) {
            table.reservations = []
        }
        table.reservations.push({ date, time })

        // Update the restaurant document
        await updateDoc(restaurantRef, { tables: restaurant.tables })

        res.status(200).json({ message: 'Reservation made successfully' })
    } catch (error) {
        console.error('Error making reservation:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

