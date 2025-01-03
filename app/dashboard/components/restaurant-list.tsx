import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, DollarSign } from 'lucide-react'
import { Restaurant } from "../types/types"
import Image from "next/image"

interface RestaurantListProps {
    restaurants: Restaurant[]
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
                <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="h-48 overflow-hidden">
                            <Image src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle>{restaurant.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center mb-2">
                                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                <span className="font-bold mr-2">{restaurant.rating}</span>
                                <Badge
                                    variant="outline"
                                    className={restaurant.status === "busy" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                                >
                                    {restaurant.status === "busy" ? "Busy" : "Available"}
                                </Badge>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{restaurant.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2">
                                <DollarSign className="w-4 h-4 mr-1" />
                                <span className="text-sm">{restaurant.price}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {restaurant.features.map((feature) => (
                                    <Badge key={feature} variant="secondary" className="text-xs">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}