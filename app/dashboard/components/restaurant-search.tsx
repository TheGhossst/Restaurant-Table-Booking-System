"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RestaurantList } from "./restaurant-list";
import { Restaurant } from "../types/types";
import { db } from "@/api/firebase";
import { collection, query, where, getDocs, limit, Query, DocumentData } from "firebase/firestore";
import { Search, MapPin } from 'lucide-react';

export default function RestaurantSearch() {
    const [location, setLocation] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const restaurantsRef = collection(db, "restaurants");
                const querySnapshot = await getDocs(query(restaurantsRef, limit(1000)));

                const fetchedLocations = Array.from(new Set(querySnapshot.docs.map((doc) => doc.data().location)));
                setLocations(fetchedLocations);
            } catch (err) {
                console.error("Error fetching locations:", err);
                setError("Failed to fetch locations. Please try again.");
            }
        };

        fetchLocations();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const restaurantsRef = collection(db, "restaurants");
            let restaurantQuery: Query<DocumentData> = query(restaurantsRef);

            if (location.trim()) {
                restaurantQuery = query(restaurantQuery, where("location", "==", location));
            }

            if (restaurantName.trim()) {
                restaurantQuery = query(restaurantQuery, where("name", ">=", restaurantName), where("name", "<=", restaurantName + '\uf8ff'));
            }

            const querySnapshot = await getDocs(restaurantQuery);

            const fetchedRestaurants: Restaurant[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Restaurant)).filter(restaurant => 
                restaurant.name.toLowerCase().includes(restaurantName.toLowerCase())
            );

            setRestaurants(fetchedRestaurants);
        } catch (err) {
            console.error("Error fetching restaurants:", err);
            setError("Failed to fetch restaurants. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLocationClick = (loc: string) => {
        setLocation(loc);
        handleSearch({ preventDefault: () => { } } as React.FormEvent);
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Enter location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Enter restaurant name"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </div>
            </form>

            <div>
                <h2 className="text-lg font-semibold mb-2">Available Locations:</h2>
                <div className="flex flex-wrap gap-2">
                    {locations.length > 0 ? (
                        locations.map((loc) => (
                            <Badge
                                key={loc}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                onClick={() => handleLocationClick(loc)}
                            >
                                {loc}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">Loading locations...</p>
                    )}
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {restaurants.length > 0 ? (
                <RestaurantList restaurants={restaurants} />
            ) : (
                <p className="text-center text-gray-500 italic">No restaurants found. Try adjusting your search criteria.</p>
            )}
        </div>
    );
}