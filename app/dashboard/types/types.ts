export interface Restaurant {
    id: string
    name: string
    rating: number
    features: string[]
    price: string
    status: "busy" | "free"
    description?: string
    image: string
    location: string
}


export interface Table {
    id: string
    seats: number
    status: "available" | "occupied"
}