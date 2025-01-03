export interface Restaurant {
    id: string;
    name: string;
    rating: number;
    features: string[];
    price: string;
    status: 'busy' | 'free';
    description: string;
    location: string;
    image: string;
    tables: Table[];
    openingHours: {
        [day: string]: { open: string; close: string };
    };
}

export interface Table {
    id: string;
    seats: number;
    status: 'available' | 'occupied';
}

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type OpeningHours = {
    [K in Day]: { open: string; close: string };
};


export interface Booking {
    id: string;
    restaurantId: string;
    tableId: string;
    date: string;
    time: string;
    guests: number;
    name: string;
    email: string;
    phone: string;
    status: 'confirmed' | 'cancelled' | 'completed';
}

export type RestaurantFeature = 'Italian' | 'Pasta' | 'Japanese' | 'Sushi' | 'American' | 'Burgers' | 'Indian' | 'Curry' | 'Steak' | 'Grill' | 'Mexican' | 'Tacos' | 'Chinese' | 'Dim Sum' | 'Pizza' | 'Asian' | 'Noodles' | 'BBQ';

export type Price = '$' | '$$' | '$$$';

export type RestaurantStatus = 'busy' | 'free';

export type TableStatus = 'available' | 'occupied';

export type Location = 'Kumarapuram' | 'Medical College' | 'Pattom' | 'Panampilly Nagar' | 'Alappuzha' | 'Cochin' | 'Vyttila' | 'Edapally' | 'Fort Kochi' | 'Kochi';

