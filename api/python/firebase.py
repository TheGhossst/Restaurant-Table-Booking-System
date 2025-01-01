import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from dotenv import load_dotenv
import os
import random
import urllib

load_dotenv(dotenv_path=".env.local")

cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if cred_path:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
else:
    print("The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")
    
firebase_admin.initialize_app(cred)

db = firestore.client()

def generate_unique_restaurant_names(n):
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
    
    unique_names = random.sample(base_names, n)
    return unique_names

unique_restaurant_names = generate_unique_restaurant_names(100)

restaurant_features = [
    ["Italian", "Pasta"], ["Japanese", "Sushi"], ["American", "Burgers"], ["Indian", "Curry"], ["Steak", "Grill"],
    ["Mexican", "Tacos"], ["Chinese", "Dim Sum"], ["Italian", "Pizza"], ["Asian", "Noodles"], ["American", "BBQ"]
]
locations = ["Kumarapuram", "Medical College", "Pattom", "Panampilly Nagar", "Alappuzha", "Cochin", "Vyttila", "Edapally", "Fort Kochi", "Kochi"]
statuses = ["busy", "free"]
prices = ["$", "$$", "$$$"]
ratings = [round(random.uniform(3.5, 5), 1) for _ in range(100)]

restaurants = []
for i in range(100):
    restaurant_name = unique_restaurant_names[i]
    image_url = f"https://via.placeholder.com/400x300.png?text={urllib.parse.quote(restaurant_name)}" 
    
    restaurant = {
        "id": str(i + 1),
        "name": restaurant_name,
        "rating": random.choice(ratings),
        "features": random.choice(restaurant_features),
        "price": random.choice(prices),
        "status": random.choice(statuses),
        "description": f"A cozy restaurant serving {random.choice(['authentic', 'fusion', 'gourmet', 'local'])} cuisine.",
        "location": random.choice(locations),
        "image": image_url
    }
    restaurants.append(restaurant)

for restaurant in restaurants:
    db.collection("restaurants").document(restaurant["id"]).set(restaurant)
    print(f"Added restaurant: {restaurant['name']} at {restaurant['location']}")

tables = []
for i in range(1, 101):
    for j in range(1, 6):
        table = {
            "id": f"{i}_{j}",
            "restaurant_id": str(i),
            "seats": random.choice([2, 4, 6]),
            "status": random.choice(["available", "occupied"]),
        }
        tables.append(table)

for table in tables:
    db.collection("tables").document(table["id"]).set(table)
    print(f"Added table: {table['id']} for restaurant {table['restaurant_id']}")

print("Dummy data added successfully!")