import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env.local")

cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if cred_path:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
else:
    print("The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")

db = firestore.client()

locations = [
    "Kumarapuram", "Medical College", "Pattom", "Panampilly Nagar", "Alappuzha",
    "Cochin", "Vyttila", "Edapally", "Fort Kochi", "Kochi"
]
for i, location in enumerate(locations, start=1):
    location_doc = {
        "id": str(i),
        "name": location
    }
    db.collection("locations").document(str(i)).set(location_doc)
    print(f"Added location: {location}")

print("All locations added successfully!")