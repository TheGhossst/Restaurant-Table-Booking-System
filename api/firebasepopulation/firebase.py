import random
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import os
from typing import List, Dict, Any

# Load environment variables
load_dotenv(dotenv_path=".env.local")

# Initialize Firebase
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if cred_path:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
else:
    print("The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")

db = firestore.client()

def delete_collection(collection_ref, batch_size=50):
    """Delete all documents in a Firestore collection."""
    docs = collection_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        doc.reference.delete()
        deleted += 1

    if deleted >= batch_size:
        return delete_collection(collection_ref, batch_size)

def generate_unique_restaurant_names(n: int) -> List[str]:
    base_names = [
        "Pasta Palace", "Sushi Sensation", "Burger Bonanza", "Curry Express", "Steakhouse Supreme",
        "Taco Tower", "Dim Sum Delights", "Pizza Planet", "Noodle Nirvana", "BBQ Haven", "Ramen Retreat",
        "Grill Garden", "Burrito Bazaar", "Waffle Wonderland", "Fried Feast", "Crispy Corner",
        "Pasta Place", "Sushi Shack", "Burger Barn", "Curry Kingdom", "Steak Street", "Taco Town",
        "Dim Sum Den", "Pizza Plaza", "Noodle Nook", "BBQ Bistro", "Ramen Realm", "Grill Groove",
        "Burrito Bay", "Waffle World", "Fried Fantasy", "Crispy Castle", "Pasta Parade", "Sushi Symphony",
        "Burger Block", "Curry Cabin", "Steak Spot", "Taco Trail", "Dim Sum Delight", "Pizza Pavilion",
        "Noodle Nest", "BBQ Bar", "Ramen Roost", "Grill Glory", "Burrito Blast", "Waffle Works",
        "Fried Fortress", "Crispy Cuisine", "Pasta Palace", "Sushi Super", "Burger Break", "Curry Charm",
        "Steak Suite", "Taco Temple", "Dim Sum Dynasty", "Pizza Peak", "Noodle Nirvana", "BBQ Boulevard",
        "Ramen Ranch", "Grill Grove", "Burrito Branch", "Waffle Wharf", "Fried Field", "Crispy Creations",
        "Pasta Pavilion", "Sushi Set", "Burger Basin", "Curry Cove", "Steak Stand", "Taco Tides",
        "Dim Sum Domain", "Pizza Peak", "Noodle Nexus", "BBQ Bend", "Ramen River", "Grill Gateway",
        "Burrito Bayou", "Waffle Wilderness", "Fried Feast", "Crispy Corner", "Pasta Point", "Sushi Shores",
        "Burger Bluff", "Curry Canyon", "Steak Station", "Taco Tower", "Dim Sum District", "Pizza Paradise",
        "Noodle Nirvana", "BBQ Belt", "Ramen Rise", "Grill Garden", "Burrito Bay", "Waffle Works",
        "Fried Farm", "Crispy Cupboard", "Pasta Palace", "Sushi Space", "Burger Box", "Curry City",
        "Steak Shack", "Taco Track", "Dim Sum Domain", "Pizza Point", "Noodle Nirvana", "BBQ Blast",
        "Ramen Retreat", "Grill Grotto", "Burrito Barracks", "Waffle Wharf", "Fried Factory", "Crispy Coast"
    ]
    return random.sample(base_names, n)

def generate_opening_hours() -> Dict[str, Dict[str, str]]:
    days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    hours = {}
    for day in days:
        open_hour = random.randint(8, 11)
        close_hour = random.randint(20, 23)
        hours[day] = {
            "open": f"{open_hour:02d}:00",
            "close": f"{close_hour:02d}:00"
        }
    return hours

def generate_time_slots(open_hour: int, close_hour: int) -> List[Dict[str, Any]]:
    """Generate hourly time slots for a table."""
    slots = []
    for hour in range(open_hour, close_hour):
        slots.append({
            "time": f"{hour:02d}:00",
            "status": "available"
        })
    return slots

def populate_database() -> None:
    # Step 1: Delete existing documents
    print("Deleting existing documents in the 'restaurants' collection...")
    delete_collection(db.collection("restaurants"))
    print("All documents deleted successfully.")

    # Step 2: Populate new data
    unique_restaurant_names = generate_unique_restaurant_names(100)
    restaurant_features = [
        ["Italian", "Pasta"], ["Japanese", "Sushi"], ["American", "Burgers"], ["Indian", "Curry"], ["Steak", "Grill"],
        ["Mexican", "Tacos"], ["Chinese", "Dim Sum"], ["Italian", "Pizza"], ["Asian", "Noodles"], ["American", "BBQ"]
    ]
    locations = ["Kumarapuram", "Medical College", "Pattom", "Panampilly Nagar", "Alappuzha", "Cochin", "Vyttila", "Edapally", "Fort Kochi", "Kochi"]
    statuses = ["busy", "free"]
    prices = ["$", "$$", "$$$"]
    ratings = [round(random.uniform(3.5, 5), 1) for _ in range(100)]

    for i in range(100):
        restaurant_name = unique_restaurant_names[i]
        image_url = f"https://source.unsplash.com/400x300/?restaurant,{restaurant_name.replace(' ', '%20')}"

        opening_hours = generate_opening_hours()
        open_hour = int(opening_hours['monday']['open'][:2])
        close_hour = int(opening_hours['monday']['close'][:2])

        tables = [
            {
                "id": f"{i + 1}_{j + 1}",
                "seats": random.choice([2, 4, 6]),
                "timeSlots": generate_time_slots(open_hour, close_hour)
            } for j in range(10)
        ]

        restaurant: Dict[str, Any] = {
            "id": str(i + 1),
            "name": restaurant_name,
            "rating": random.choice(ratings),
            "features": random.choice(restaurant_features),
            "price": random.choice(prices),
            "status": random.choice(statuses),
            "description": f"A cozy restaurant serving {random.choice(['authentic', 'fusion', 'gourmet', 'local'])} cuisine.",
            "location": random.choice(locations),
            "image": image_url,
            "tables": tables,
            "openingHours": opening_hours
        }

        db.collection("restaurants").document(restaurant["id"]).set(restaurant)
        print(f"Added restaurant: {restaurant['name']} at {restaurant['location']}")

    print("Database populated successfully!")

if __name__ == "__main__":
    populate_database()
