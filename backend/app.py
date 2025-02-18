import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import requests
from models import Session, City

load_dotenv()

app = Flask(__name__)
CORS(app)

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'

@app.route('/api/cities')
def get_cities():
    session = Session()
    cities = session.query(City).all()
    session.close()
    return jsonify([
        {
            'id': city.id,
            'name': city.name,
            'latitude': city.latitude,
            'longitude': city.longitude
        } for city in cities
    ])

@app.route('/api/weather/<int:city_id>')
def get_weather(city_id):
    session = Session()
    city = session.query(City).get(city_id)
    session.close()

    if not city:
        return jsonify({'error': 'City not found'}), 404

    params = {
        'lat': city.latitude,
        'lon': city.longitude,
        'appid': OPENWEATHER_API_KEY,
        'units': 'metric'
    }
    response = requests.get(OPENWEATHER_API_URL, params=params)
    weather_data = response.json()

    return jsonify({
        'city': city.name,
        'temperature': weather_data['main']['temp'],
        'description': weather_data['weather'][0]['description'],
        'icon': weather_data['weather'][0]['icon']
    })

@app.route('/api/cities', methods=['POST'])
def add_city():
    data = request.json
    new_city = City(
        name=data['name'],
        latitude=data['latitude'],
        longitude=data['longitude']
    )
    session = Session()
    session.add(new_city)
    session.commit()
    city_id = new_city.id
    session.close()
    return jsonify({'id': city_id, 'message': 'City added successfully'}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)