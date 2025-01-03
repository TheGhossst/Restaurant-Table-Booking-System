'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/api/firebase'
import { Restaurant, Table, TimeSlot } from '../types/type'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Star, MapPin, DollarSign, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

export default function RestaurantPage() {
    const { id } = useParams()
    const { toast } = useToast()
    const router = useRouter()
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid)
            } else {
                router.push('/login')
            }
        })

        return () => unsubscribe()
    }, [router])

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!userId) return

            try {
                const docRef = doc(db, "restaurants", id as string)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setRestaurant({ id: docSnap.id, ...docSnap.data() } as Restaurant)
                } else {
                    setError("Restaurant not found")
                }
            } catch (err) {
                console.error("Error fetching restaurant:", err)
                setError("Failed to load restaurant data")
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurant()
    }, [id, userId])

    const handleReservation = async (tableId: string, timeSlot: string) => {
        if (isSubmitting || !userId) return
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId: id,
                    tableId,
                    userId,
                    date: format(selectedDate, 'yyyy-MM-dd'),
                    time: timeSlot,
                }),
            })

            if (!response.ok) {
                throw new Error((await response.json()).message)
            }
            console.log(`Reserved`);
            toast({
                title: "Reservation Confirmed",
                description: `Your table has been reserved for ${format(selectedDate, 'PPP')} at ${timeSlot}`,
            })

            const docRef = doc(db, "restaurants", id as string)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setRestaurant({ id: docSnap.id, ...docSnap.data() } as Restaurant)
            }
        } catch (error) {
            toast({
                title: "Reservation Failed",
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>
    if (!restaurant) return <div className="flex justify-center items-center min-h-screen">Restaurant not found</div>

    const today = format(new Date(), 'EEEE').toLowerCase()
    const currentHours = restaurant.openingHours[today]

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mt-16 mb-8">
                <div className="h-64 overflow-hidden">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                    <CardTitle className="text-3xl">{restaurant.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center mb-4">
                        <Star className="w-6 h-6 text-yellow-400 mr-2" />
                        <span className="font-bold text-xl mr-4">{restaurant.rating}</span>
                        <Badge variant="outline" className={cn(
                            restaurant.status === "busy" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        )}>
                            {restaurant.status === "busy" ? "Busy" : "Available"}
                        </Badge>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                        <DollarSign className="w-5 h-5 mr-2" />
                        <span>{restaurant.price}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>Today: {currentHours.open} - {currentHours.close}</span>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Features:</h3>
                        <div className="flex flex-wrap gap-2">
                            {restaurant.features.map((feature) => (
                                <Badge key={feature} variant="secondary">
                                    {feature}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-700">{restaurant.description}</p>
                </CardContent>
            </Card>

            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Select Date</h2>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[280px]">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            initialFocus
                            disabled={(date) => date < new Date()}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Available Tables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {restaurant.tables && restaurant.tables.length > 0 ? (
                        restaurant.tables.map((table: Table) => (
                            <Card key={table.id}>
                                <CardHeader>
                                    <CardTitle>Table {table.id}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Seats: {table.seats}</p>
                                    <h4 className="font-semibold mt-2">Time Slots:</h4>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {table.timeSlots.map((slot: TimeSlot) => (
                                            <Button
                                                key={slot.time}
                                                variant={slot.status === 'available' ? 'outline' : 'destructive'}
                                                disabled={slot.status !== 'available' || isSubmitting}
                                                onClick={() => handleReservation(table.id, slot.time)}
                                            >
                                                {slot.time}
                                            </Button>

                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p>No tables available for this restaurant.</p>
                    )}
                </div>
            </div>
        </div>
    )
}