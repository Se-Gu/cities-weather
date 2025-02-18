from models import Session, City

initial_cities = [
    {"name": "New York", "latitude": 40.7128, "longitude": -74.0060},
    {"name": "London", "latitude": 51.5074, "longitude": -0.1278},
    {"name": "Tokyo", "latitude": 35.6762, "longitude": 139.6503},
    {"name": "Istanbul", "latitude": 41.0082, "longitude": 28.9784},
    {"name": "Rome", "latitude": 41.9028, "longitude": 12.4964}
]

def init_db():
    session = Session()
    for city_data in initial_cities:
        city = City(**city_data)
        session.add(city)
    session.commit()
    session.close()
    print("Database initialized with initial cities.")

if __name__ == "__main__":
    init_db()