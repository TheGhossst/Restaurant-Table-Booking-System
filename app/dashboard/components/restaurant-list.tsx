import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Restaurant } from "../types/types"

interface RestaurantListProps {
    restaurants: Restaurant[]
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
                <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <CardTitle>{restaurant.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold mb-2">{restaurant.rating} ⭐</p>
                            <p className="mb-2">{restaurant.price}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {restaurant.features.map((feature) => (
                                    <Badge key={feature} variant="secondary">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                            <Badge
                                variant="outline"
                                className={restaurant.status === "busy" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                            >
                                {restaurant.status === "busy" ? "Busy" : "Available"}
                            </Badge>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}