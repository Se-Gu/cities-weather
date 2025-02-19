# Weather App

This Weather App is a full-stack application that allows users to view weather information for their favorite cities. It features a React frontend with Next.js and a Python backend using Flask and PostgreSQL.

## Features

- Interactive map interface using MapLibre GL
- Favorite city management (add, remove, view)
- Real-time weather data from OpenWeatherMap API
- City search with autocomplete
- Responsive design for various screen sizes
- Frontend caching for improved performance


## Prerequisites

- Node.js (v14 or later)
- Python (v3.11 or later)
- PostgreSQL
- Docker and Docker Compose (for containerized setup)


## Project Structure

```
weather-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── app/
│   ├── public/
│   ├── package.json
│   └── next.config.js
├── backend/
│   ├── app.py
│   ├── init_db.py
│   └── requirements.txt
├── docker/
│   ├── frontend.Dockerfile
│   └── backend.Dockerfile
├── docker-compose.yml
└── README.md
```

## Building and Running the Project

### Without Docker

#### Frontend Setup

1. Navigate to the frontend directory:
```
cd frontend
```


2. Install dependencies:

```
npm install
```


3. Create a .env.local file in the frontend directory with the following content:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```


4. Build the frontend:

```
npm run build
```


5. Start the production server:

```
npm start
```




The frontend will be available at http://localhost:3000.

#### Backend Setup

1. Navigate to the backend directory:

```
cd backend
```


2. Create a virtual environment and activate it:

```
python -m venv venv
source venv/bin/activate  # On Windows, use venv\Scripts\activate
```


3. Install dependencies:

```
pip install -r requirements.txt
```


4. Set up environment variables:

```
export FLASK_ENV=development
export FLASK_APP=app.py
export DATABASE_URL=postgresql://postgres:password@localhost/weather_app
export OPENWEATHER_API_KEY=your_openweather_api_key
```

Replace your_openweather_api_key with your actual OpenWeatherMap API key.


5. Initialize the database:

```
python init_db.py
```


6. Start the Flask server:

```
flask run
```




The backend will be available at http://localhost:5000.

### With Docker

1. Ensure Docker and Docker Compose are installed on your system.
2. From the root directory of the project, run:

```
docker-compose up --build
```




This command will build and start all the necessary containers (frontend, backend, and PostgreSQL).

- The frontend will be available at http://localhost:3000
- The backend will be available at http://localhost:5000


To stop the containers, use:

```
docker-compose down
```

## Usage

1. Open your browser and go to http://localhost:3000.
2. Use the "Add new" button in the sidebar to search for and add favorite cities.
3. Click on a city in the sidebar or on the map to view its current weather information.
4. To remove a city from favorites, click the 'X' button next to the city name in the sidebar.


## Development

- The frontend code is located in the frontend directory.
- The backend code is located in the backend directory.


### Frontend Development

To run the frontend in development mode:

1. Navigate to the frontend directory:

```
cd frontend
```


2. Start the development server:

```
npm run dev
```




This will start the Next.js development server with hot-reloading enabled.

### Backend Development

To run the backend in development mode:

1. Navigate to the backend directory:

```
cd backend
```


2. Ensure your virtual environment is activated.
3. Set the Flask environment to development:

```
export FLASK_ENV=development
```


4. Start the Flask development server:

```
flask run
```

This will start the Flask server in development mode with debug output and auto-reloading.

## API Endpoints

- GET /api/cities/favorites: Fetch all favorite cities
- PATCH /api/cities/{city_id}/toggle-favorite: Toggle favorite status of a city
- GET /api/cities/search: Search for cities
- GET /api/weather: Get weather data for a specific location


## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [MapLibre GL](https://maplibre.org/)
- [OpenWeatherMap API](https://openweathermap.org/api)
