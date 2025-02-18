import csv
import os
import psycopg2

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/weather_app")

CSV_FILE = "worldcities.csv"

def init_db():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    # Create table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS cities (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            city_ascii TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            country TEXT NOT NULL,
            iso2 CHAR(2) NOT NULL,
            iso3 CHAR(3) NOT NULL,
            admin_name TEXT NOT NULL,
            capital TEXT,
            population BIGINT,
            selected boolean DEFAULT false,
            search_vector tsvector GENERATED ALWAYS AS (
                to_tsvector('english', name || ' ' || country || ' ' || admin_name)
            ) STORED
        );
    """)

    # Insert data
    with open(CSV_FILE, newline='', encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                population = int(row["population"]) if row["population"].strip() else None
            except ValueError:
                population = None  # Handle cases where population is not a valid integer

            cur.execute("""
                INSERT INTO cities (name, city_ascii, latitude, longitude, country, iso2, iso3, admin_name, capital, population)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING;
            """, (
                row["city"], row["city_ascii"], float(row["lat"]), float(row["lng"]),
                row["country"], row["iso2"], row["iso3"], row["admin_name"], row["capital"] if row["capital"] else None, population
            ))

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Database initialized with cities from CSV.")

if __name__ == "__main__":
    init_db()
