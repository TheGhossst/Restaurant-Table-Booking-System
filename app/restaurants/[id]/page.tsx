"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Restaurant, Table } from "../../dashboard/types/types"
import { db } from "../../../api/firebase"
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore"
import { Star, MapPin, DollarSign, Users } from 'lucide-react'
import { Loading } from "../../components/Loading"
import { Error, NotFound } from "../../components/Error"

export default function RestaurantPage() {
    const { id } = useParams()
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
    const [tables, setTables] = useState<Table[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRestaurantAndTables = async () => {
            try {
                const restaurantDoc = await getDoc(doc(db, "restaurants", id as string))
                if (restaurantDoc.exists()) {
                    setRestaurant({ id: restaurantDoc.id, ...restaurantDoc.data() } as Restaurant)
                } else {
                    setError("Restaurant not found")
                    return
                }

                const tablesQuery = query(collection(db, "tables"), where("restaurant_id", "==", id))
                const tablesSnapshot = await getDocs(tablesQuery)
                const fetchedTables = tablesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table))
                setTables(fetchedTables)
            } catch (err) {
                console.error("Error fetching restaurant data:", err)
                setError("Failed to load restaurant data. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurantAndTables()
    }, [id])

    const handleReserve = async (tableId: string) => {
        try {
            await updateDoc(doc(db, "tables", tableId), {
                status: "occupied"
            })
            setTables(tables.map(table =>
                table.id === tableId ? { ...table, status: "occupied" } : table
            ))
        } catch (err) {
            console.error("Error reserving table:", err)
            setError("Failed to reserve table. Please try again.")
        }
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error message={error} />
    }

    if (!restaurant) {
        return <NotFound item="Restaurant" />
    }

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <Card className="mb-8 overflow-hidden">
                    <div className="h-64 md:h-96 overflow-hidden relative">
                        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <h2 className="text-4xl md:text-5xl font-bold text-white text-center">{restaurant.name}</h2>
                        </div>
                    </div>
                    <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                            <Star className="w-6 h-6 text-yellow-400 mr-2" />
                            <span className="text-2xl font-bold mr-2">{restaurant.rating}</span>
                            <Badge
                                variant="outline"
                                className={restaurant.status === "busy" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                            >
                                {restaurant.status === "busy" ? "Busy" : "Available"}
                            </Badge>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span>{restaurant.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                            <DollarSign className="w-5 h-5 mr-2" />
                            <span>{restaurant.price}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {restaurant.features.map((feature) => (
                                <Badge key={feature} variant="secondary" className="bg-blue-100 text-blue-800">
                                    {feature}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-gray-700 mb-6">{restaurant.description}</p>
                    </CardContent>
                </Card>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Tables</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tables.map((table) => (
                        <Card key={table.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center mb-2">
                                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                                    <span className="font-bold text-gray-800">{table.seats} Seats</span>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={table.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                    {table.status}
                                </Badge>
                                {table.status === "available" && (
                                    <Button
                                        className="mt-4 w-full bg-purple-500 hover:bg-purple-400 transition-colors"
                                        onClick={() => handleReserve(table.id)}
                                    >
                                        Reserve
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}