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
└── 📁cities-weather-main
    └── 📁backend
        └── app.py
        └── init_db.py
        └── requirements.txt
        └── worldcities.csv
    └── 📁docker
        └── backend.Dockerfile
        └── frontend.Dockerfile
    └── 📁frontend
        └── .gitignore
        └── components.json
        └── eslint.config.mjs
        └── next.config.ts
        └── package-lock.json
        └── package.json
        └── postcss.config.mjs
        └── 📁public
            └── file.svg
            └── globe.svg
            └── next.svg
            └── vercel.svg
            └── window.svg
        └── 📁src
            └── 📁app
                └── favicon.ico
                └── globals.css
                └── layout.tsx
                └── page.tsx
            └── 📁components
                └── AddFavoriteCity.tsx
                └── Map.tsx
                └── Sidebar.tsx
                └── 📁ui
                    └── button.tsx
                    └── card.tsx
                    └── input.tsx
                    └── separator.tsx
                    └── sheet.tsx
                    └── sidebar.tsx
                    └── skeleton.tsx
                    └── tooltip.tsx
            └── 📁hooks
                └── use-mobile.tsx
            └── 📁lib
                └── api.ts
                └── utils.ts
        └── tailwind.config.ts
        └── tsconfig.json
    └── .gitignore
    └── docker-compose.yml
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
NEXT_PUBLIC_API_URL=http://localhost:5000
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

4. Create a .env.local file in the backend directory with the following content:

```
FLASK_ENV=development
FLASK_APP=app.py
DATABASE_URL=postgresql://username:password@localhost/weather_app (your local postgresql database connection string)
OPENWEATHER_API_KEY=67d3fe8f1f652996ef0deda3269d9e6b (my own key which has a daily limit of 1000 calls)
```

5. Initialize the database:

```
python init_db.py
```

6. Start the Flask server:

```
flask run
```

The backend will be available at http://localhost:5000.

### With Docker (RECOMMENDED)

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
