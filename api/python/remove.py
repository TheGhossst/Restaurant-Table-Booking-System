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

def delete_collection(collection_name):
    collection_ref = db.collection(collection_name)
    docs = collection_ref.stream()
    for doc in docs:
        print(f"Deleting document {doc.id} from collection {collection_name}")
        doc.reference.delete()

    print(f"Collection {collection_name} cleared successfully!")

delete_collection("restaurants")
delete_collection("tables")

print("All specified collections have been cleared.")