import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import DictCursor
import requests

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/weather_app")

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


def get_db_connection():
    return psycopg2.connect(DB_URL, cursor_factory=DictCursor)


@app.route('/api/cities/search')
def search_cities():
    query = request.args.get('q', '').strip()
    limit = int(request.args.get('limit', 20))

    if not query:
        return jsonify([])

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, name, country, admin_name,
            COALESCE(population, 0) AS population,
            latitude, longitude
        FROM cities
        WHERE SIMILARITY(name, %s) > 0.2 and favorite = false
        ORDER BY SIMILARITY(name, %s) DESC, COALESCE(population, 0) DESC
        LIMIT %s;
    """, (query, query, limit))


    cities = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {"id": city["id"], "name": city["name"], "country": city["country"], "admin_name": city["admin_name"],
         "population": city["population"], "latitude": city["latitude"], "longitude": city["longitude"]}
        for city in cities
    ])

# Change the endpoint names and variables
@app.route('/api/cities/<int:city_id>/toggle-favorite', methods=['PATCH'])
def toggle_city_favorite(city_id):
    conn = get_db_connection()
    cur = conn.cursor()

    # Get current state
    cur.execute("SELECT favorite FROM cities WHERE id = %s;", (city_id,))
    city = cur.fetchone()

    if not city:
        cur.close()
        conn.close()
        return jsonify({"error": "City not found"}), 404

    # Toggle favorite state
    new_favorite_state = not city["favorite"]
    cur.execute("UPDATE cities SET favorite = %s WHERE id = %s;", (new_favorite_state, city_id))
    conn.commit()

    cur.close()
    conn.close()
    return jsonify({"id": city_id, "favorite": new_favorite_state})

@app.route('/api/cities/favorites', methods=['GET'])
def get_favorite_cities():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, name, country, admin_name, population, latitude, longitude
        FROM cities
        WHERE favorite = TRUE;
    """)

    favorite_cities = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {
            "id": city["id"],
            "name": city["name"],
            "country": city["country"],
            "admin_name": city["admin_name"],
            "population": city["population"],
            "latitude": city["latitude"],
            "longitude": city["longitude"]
        }
        for city in favorite_cities
    ])

@app.route('/api/weather', methods=['GET'])
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Latitude and Longitude are required"}), 400

    try:
        response = requests.get(
            "https://api.openweathermap.org/data/3.0/onecall",
            params={
                "lat": lat,
                "lon": lon,
                "appid": OPENWEATHER_API_KEY,
                "units": "metric",  # Temperature in Celsius
                "exclude": "minutely,hourly,alerts"
            }
        )
        data = response.json()

        if "current" not in data or "daily" not in data:
            return jsonify({"error": "Invalid response from weather API"}), 500

        weather_info = {
            "temperature": data["current"]["temp"],  # Current temperature
            "H": data["daily"][0]["temp"]["max"],    # Daily high
            "L": data["daily"][0]["temp"]["min"],    # Daily low
            "description": data["current"]["weather"][0]["description"],  # Weather description
            "icon": data["current"]["weather"][0]["icon"]  # Weather description
        }

        return jsonify(weather_info)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
