from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

# Select the database
db = client["Parkingspace"]
