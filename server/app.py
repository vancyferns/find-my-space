# app.py
from flask import Flask
from flask_cors import CORS
# Import the Blueprint from your routes.py file
from routes import parking_routes

# Initialize the Flask application
app = Flask(__name__)

# Enable CORS for the application, allowing your React frontend to communicate with it
CORS(app)

# Register the parking_routes Blueprint
# All routes defined in routes.py are now available under this app
app.register_blueprint(parking_routes)

# A simple root endpoint to confirm the server is running
@app.route("/")
def home():
    return "<h1>Flask server is running!</h1>"

if __name__ == "__main__":
    # Run the application in debug mode for development
    app.run(debug=True)
