from flask import Blueprint, jsonify, request
from __init__ import db

parking_routes = Blueprint("parking_routes", __name__)

# Dummy fallback data
dummy_locations = ["MUMBAI", "DELHI", "BANGALORE"]

dummy_parking_data = {
    "MUMBAI": [
        {
            "Sr_No": 1,
            "Name_of_parking_place": "Andheri Metro Parking",
            "latitude": 19.1197,
            "longitude": 72.8468,
            "Type_of_vehicle": "Car",
            "capacity": 50,
            "Type_of_parking": "Paid"
        }
    ],
    "DELHI": [
        {
            "Sr_No": 1,
            "Name_of_parking_place": "Connaught Place Parking",
            "latitude": 28.6315,
            "longitude": 77.2167,
            "Type_of_vehicle": "Car",
            "capacity": 100,
            "Type_of_parking": "Paid"
        }
    ],
    "BANGALORE": [
        {
            "Sr_No": 1,
            "Name_of_parking_place": "Majestic Bus Stand Parking",
            "latitude": 12.977,
            "longitude": 77.571,
            "Type_of_vehicle": "Bike",
            "capacity": 200,
            "Type_of_parking": "Free"
        }
    ]
}

# 1️⃣ Get all available locations
@parking_routes.route("/api/locations", methods=["GET"])
def get_locations():
    try:
        locations = db.list_collection_names()
        if not locations:  # fallback to dummy
            locations = dummy_locations
        return jsonify(locations), 200
    except Exception:
        return jsonify(dummy_locations), 200

# 2️⃣ Get all parking spots for a specific location
@parking_routes.route("/api/parking/<location>", methods=["GET"])
def get_parking(location):
    try:
        collection = db[location.upper()]
        data = list(collection.find({}, {"_id": 0}))
        if not data:  # fallback to dummy
            data = dummy_parking_data.get(location.upper(), [])
        return jsonify(data), 200
    except Exception:
        return jsonify(dummy_parking_data.get(location.upper(), [])), 200

# 3️⃣ Add a new parking spot to a location
@parking_routes.route("/api/parking/<location>", methods=["POST"])
def add_parking(location):
    try:
        collection = db[location.upper()]
        new_spot = request.json

        required_fields = ["Sr_No", "Name_of_parking_place", "latitude", "longitude",
                           "Type_of_vehicle", "capacity", "Type_of_parking"]
        if not all(field in new_spot for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        try:
            collection.insert_one(new_spot)
        except Exception:
            dummy_parking_data.setdefault(location.upper(), []).append(new_spot)

        return jsonify({"message": "Parking spot added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 4️⃣ Search/filter parking spots
@parking_routes.route("/api/parking/search/<location>", methods=["GET"])
def search_parking(location):
    try:
        query = {}
        vehicle_type = request.args.get("vehicle")
        parking_type = request.args.get("type")
        min_capacity = request.args.get("min_capacity", type=int)

        if vehicle_type:
            query["Type_of_vehicle"] = vehicle_type
        if parking_type:
            query["Type_of_parking"] = parking_type
        if min_capacity:
            query["capacity"] = {"$gte": min_capacity}

        collection = db[location.upper()]
        data = list(collection.find(query, {"_id": 0}))

        if not data:  # fallback to dummy
            data = [
                spot for spot in dummy_parking_data.get(location.upper(), [])
                if (not vehicle_type or spot["Type_of_vehicle"] == vehicle_type) and
                   (not parking_type or spot["Type_of_parking"] == parking_type) and
                   (not min_capacity or spot["capacity"] >= min_capacity)
            ]

        return jsonify(data), 200
    except Exception:
        data = [
            spot for spot in dummy_parking_data.get(location.upper(), [])
            if (not request.args.get("vehicle") or spot["Type_of_vehicle"] == request.args.get("vehicle")) and
               (not request.args.get("type") or spot["Type_of_parking"] == request.args.get("type")) and
               (not request.args.get("min_capacity", type=int) or spot["capacity"] >= request.args.get("min_capacity", type=int))
        ]
        return jsonify(data), 200
