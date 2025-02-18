import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import DictCursor

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/weather_app")


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
        WHERE search_vector @@ plainto_tsquery(%s)
        ORDER BY COALESCE(population, 0) DESC
        LIMIT %s;
    """, (query, limit))


    cities = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {"id": city["id"], "name": city["name"], "country": city["country"], "admin_name": city["admin_name"],
         "population": city["population"], "latitude": city["latitude"], "longitude": city["longitude"]}
        for city in cities
    ])

@app.route('/api/cities/<int:city_id>/toggle', methods=['PATCH'])
def toggle_city_selection(city_id):
    conn = get_db_connection()
    cur = conn.cursor()

    # Get current state
    cur.execute("SELECT selected FROM cities WHERE id = %s;", (city_id,))
    city = cur.fetchone()

    if not city:
        cur.close()
        conn.close()
        return jsonify({"error": "City not found"}), 404

    # Toggle selection state
    new_selected_state = not city["selected"]
    cur.execute("UPDATE cities SET selected = %s WHERE id = %s;", (new_selected_state, city_id))
    conn.commit()

    cur.close()
    conn.close()
    return jsonify({"id": city_id, "selected": new_selected_state})


@app.route('/api/cities/selected', methods=['GET'])
def get_selected_cities():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, name, country, admin_name, population, latitude, longitude
        FROM cities
        WHERE selected = TRUE;
    """)

    selected_cities = cur.fetchall()
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
        for city in selected_cities
    ])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
