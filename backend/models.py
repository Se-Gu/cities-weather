from pymongo import MongoClient
import os

# Check if running inside Docker
if os.getenv("DOCKER_ENV") == "true":
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/")  # Docker MongoDB
else:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")  # Local MongoDB

client = MongoClient(MONGO_URI)

# Access the database and collection
db = client["weather_app"]
cities_collection = db["cities"]

# Ensure indexing for faster queries
cities_collection.create_index("name", unique=True)
