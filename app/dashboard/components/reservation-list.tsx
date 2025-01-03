'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/api/firebase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'
import { Loading } from '@/app/components/Loading'

interface Restaurant {
    id: string
    name: string
    location: string
}

interface Reservation {
    id: string
    restaurantId: string
    date: string
    time: string
    tableId: string
}

interface ReservationWithRestaurant extends Reservation {
    restaurant?: Restaurant
}

interface ReservationListProps {
    reservations: Reservation[]
}

export function ReservationList({ reservations }: ReservationListProps) {
    const [enrichedReservations, setEnrichedReservations] = useState<ReservationWithRestaurant[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const enrichReservations = async () => {
            const enrichedData = await Promise.all(
                reservations.map(async (reservation) => {
                    const restaurantRef = doc(db, 'restaurants', reservation.restaurantId)
                    const restaurantSnap = await getDoc(restaurantRef)
                    return {
                        ...reservation,
                        restaurant: restaurantSnap.exists()
                            ? { id: restaurantSnap.id, ...restaurantSnap.data() } as Restaurant
                            : undefined,
                    }
                })
            )
            setEnrichedReservations(enrichedData)
            setLoading(false)
        }

        enrichReservations()
    }, [reservations])

    if (loading) return <Loading />

    return (
        <div className="space-y-4">
            {enrichedReservations.map((reservation) => (
                <Link key={reservation.id} href={`/reservation/${reservation.id}`}>
                    <Card className="transition-all hover:shadow-md my-2">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {reservation.restaurant?.name || 'Loading...'}
                                        </span>
                                        <Badge variant="outline" className="ml-2">
                                            Table {reservation.tableId}
                                        </Badge>
                                    </div>
                                    <div className="flex space-x-4 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            {reservation.date}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="mr-1 h-4 w-4" />
                                            {reservation.time}
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            {enrichedReservations.length === 0 && (
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        No reservations found
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

