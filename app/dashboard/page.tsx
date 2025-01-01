'use client'

import RestaurantSearch from "./components/restaurant-search";
import { Navbar } from '../components/NavBar'

export default function DashboardPage() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find a Restaurant</h1>
        <RestaurantSearch />
      </div>
    </div>
  );
}
