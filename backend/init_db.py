import csv
import os
import time
import psycopg2

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/weather_app")
CSV_FILE = "worldcities.csv"

def wait_for_db():
    retries = 10
    for i in range(retries):
        try:
            conn = psycopg2.connect(DB_URL)
            conn.close()
            print("✅ Database is ready!")
            return
        except psycopg2.OperationalError:
            print(f"⏳ Waiting for database... Attempt {i+1}/{retries}")
            time.sleep(5)
    print("❌ Database did not become ready in time. Exiting.")
    exit(1)

def init_db():
    wait_for_db()

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    cur.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")
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
            favorite BOOLEAN DEFAULT false,
            search_vector tsvector GENERATED ALWAYS AS (
                to_tsvector('english', name || ' ' || country || ' ' || admin_name)
            ) STORED
        );
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS city_name_trgm_idx ON cities USING GIN (name gin_trgm_ops);")

    # Check if data already exists
    cur.execute("SELECT COUNT(*) FROM cities;")
    count = cur.fetchone()[0]

    if count == 0:
        print("🔄 Populating database with city data...")
        with open(CSV_FILE, newline='', encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                try:
                    population = int(row["population"]) if row["population"].strip() else None
                except ValueError:
                    population = None

                cur.execute("""
                    INSERT INTO cities (name, city_ascii, latitude, longitude, country, iso2, iso3, admin_name, capital, population)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT DO NOTHING;
                """, (
                    row["city"], row["city_ascii"], float(row["lat"]), float(row["lng"]),
                    row["country"], row["iso2"], row["iso3"], row["admin_name"],
                    row["capital"] if row["capital"] else None, population
                ))
        print("✅ Database initialized with city data.")

    else:
        print("✅ Database already initialized. Skipping data population.")

    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    init_db()
