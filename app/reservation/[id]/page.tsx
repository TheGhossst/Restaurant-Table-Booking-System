'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/api/firebase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import { Loading } from '@/app/components/Loading';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Reservation {
    id: string;
    restaurantId: string;
    date: string;
    time: string;
    tableId: string;
    userId: string;
}

interface Restaurant {
    id: string;
    name: string;
    tables: {
        id: string;
        reservations: { date: string; time: string }[];
        timeSlots: { time: string; status: string }[];
    }[];
}

export default function ReservationPage() {
    const { id } = useParams();
    const router = useRouter();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchReservationAndRestaurant = async () => {
            try {
                const reservationRef = doc(db, 'reservations', id as string);
                const reservationSnap = await getDoc(reservationRef);

                if (reservationSnap.exists()) {
                    const reservationData = { id: reservationSnap.id, ...reservationSnap.data() } as Reservation;
                    setReservation(reservationData);

                    // Fetch restaurant data
                    const restaurantRef = doc(db, 'restaurants', reservationData.restaurantId);
                    const restaurantSnap = await getDoc(restaurantRef);

                    if (restaurantSnap.exists()) {
                        setRestaurant({ id: restaurantSnap.id, ...restaurantSnap.data() } as Restaurant);
                    } else {
                        setError('Restaurant not found');
                    }
                } else {
                    setError('Reservation not found');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching the reservation details');
            } finally {
                setLoading(false);
            }
        };

        fetchReservationAndRestaurant();
    }, [id]);

    const handleCancelReservation = async () => {
        if (!reservation || !restaurant) return;

        setIsCancelling(true);
        try {
            await runTransaction(db, async (transaction) => {
                // 1. Read the reservation document
                const reservationRef = doc(db, 'reservations', reservation.id);
                const reservationDoc = await transaction.get(reservationRef);

                if (!reservationDoc.exists()) {
                    throw new Error("Reservation does not exist!");
                }

                // 2. Read the restaurant document
                const restaurantRef = doc(db, 'restaurants', reservation.restaurantId);
                const restaurantDoc = await transaction.get(restaurantRef);

                if (!restaurantDoc.exists()) {
                    throw new Error("Restaurant does not exist!");
                }

                const restaurantData = restaurantDoc.data() as Restaurant;

                // 3. Prepare the updates (but don't write yet)
                const updatedTables = restaurantData.tables.map(table => {
                    if (table.id === reservation.tableId) {
                        // Update the time slot status
                        const updatedTimeSlots = table.timeSlots.map(slot => {
                            if (slot.time === reservation.time) {
                                return { ...slot, status: 'available' };
                            }
                            return slot;
                        });

                        // Remove the reservation from the reservations array
                        const updatedReservations = table.reservations.filter(
                            r => !(r.date === reservation.date && r.time === reservation.time)
                        );

                        return {
                            ...table,
                            timeSlots: updatedTimeSlots,
                            reservations: updatedReservations,
                        };
                    }
                    return table;
                });

                // 4. Perform all writes after all reads
                transaction.delete(reservationRef);
                transaction.update(restaurantRef, { tables: updatedTables });
            });

            // Show success message
            setFeedback({ message: "Reservation cancelled successfully", type: 'success' });

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            setFeedback({ message: "Failed to cancel reservation. Please try again.", type: 'error' });
        } finally {
            setIsCancelling(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!reservation || !restaurant) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Reservation Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The requested reservation could not be found.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className='mt-16'>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Reservation Details</CardTitle>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={isCancelling}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {isCancelling ? 'Cancelling...' : 'Cancel Reservation'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to cancel your reservation at {restaurant.name} for {reservation.date} at {reservation.time}?
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleCancelReservation}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Yes, Cancel Reservation
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <MapPin className="mr-2" />
                            <span>Restaurant: {restaurant.name}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2" />
                            <span>Date: {reservation.date}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-2" />
                            <span>Time: {reservation.time}</span>
                        </div>
                        <div>
                            <span>Table: {reservation.tableId}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    {feedback && (
                        <div className={`w-full p-4 ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-md`} role="alert">
                            {feedback.message}
                        </div>
                    )}
                </CardFooter>
            </Card>
            <div className="mt-6">
                <Button asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}

