"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RestaurantList } from "./restaurant-list";
import { Restaurant } from "../types/types";
import { db } from "../../../api/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function RestaurantSearch() {
    const [location, setLocation] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const locationsRef = collection(db, "locations");
                const querySnapshot = await getDocs(locationsRef);

                const fetchedLocations = querySnapshot.docs.map((doc) => doc.data().name);
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
            const q = query(collection(db, "restaurants"), where("location", "==", location));
            const querySnapshot = await getDocs(q);

            const fetchedRestaurants: Restaurant[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Restaurant[];

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
        <div>
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-4">
                    <Input
                        type="text"
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </div>
            </form>

            <div className="mb-8">
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
                        <p>Loading locations...</p>
                    )}
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            <RestaurantList restaurants={restaurants} />
        </div>
    );
}