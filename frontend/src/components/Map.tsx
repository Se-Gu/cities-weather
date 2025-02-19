"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { getWeather } from "../lib/api";
import Image from "next/image";

interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  favoriteCities: City[];
  selectedCity: City | null;
  onCitySelect: (city: City | null) => void;
  isLoading: boolean;
}

interface WeatherData {
  temperature: number;
  H: number;
  L: number;
  description: string;
  icon: string;
}

export function Map({
  favoriteCities,
  selectedCity,
  onCitySelect,
  isLoading,
}: MapProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<{ [key: number]: maplibregl.Marker }>({});
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(
    null
  );
  React.useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [0, 20],
      zoom: 2,
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      "bottom-right"
    );

    // Set mapLoaded to true when the map is loaded
    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const addMarkers = React.useCallback(() => {
    if (!map.current) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers
    favoriteCities.forEach((city) => {
      // Create a custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.innerHTML = `
        <div class="marker-pin"></div>
        <div class="marker-name">${city.name}</div>
      `;

      const marker = new maplibregl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([city.longitude, city.latitude])
        .addTo(map.current!);

      // Add click event to the marker
      marker.getElement().addEventListener("click", () => {
        if (selectedCity && selectedCity.id === city.id) {
          onCitySelect(null); // Deselect if clicking the same marker
        } else {
          onCitySelect(city);
        }
      });

      markersRef.current[city.id] = marker;
    });
  }, [favoriteCities, onCitySelect, selectedCity]);

  // Update markers when favoriteCities changes, map is loaded, and data is not loading
  React.useEffect(() => {
    if (mapLoaded && !isLoading && favoriteCities.length > 0) {
      addMarkers();
    }
  }, [addMarkers, mapLoaded, isLoading, favoriteCities]);

  // Fetch weather data when a city is selected
  React.useEffect(() => {
    if (selectedCity) {
      getWeather(selectedCity.latitude, selectedCity.longitude)
        .then((data) => {
          setWeatherData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch weather data:", error);
        });
    } else {
      setWeatherData(null);
    }
  }, [selectedCity]);

  // Update map when a city is selected or deselected
  React.useEffect(() => {
    if (!map.current) return;

    if (selectedCity) {
      map.current.flyTo({
        center: [selectedCity.longitude, selectedCity.latitude],
        zoom: 11,
        duration: 2000,
      });

      // Highlight the selected marker
      Object.values(markersRef.current).forEach((marker) => {
        const el = marker.getElement();
        el.classList.remove("marker-selected");
      });
      if (markersRef.current[selectedCity.id]) {
        const selectedMarkerEl =
          markersRef.current[selectedCity.id].getElement();
        selectedMarkerEl.classList.add("marker-selected");
      }
    } else {
      // If no city is selected, reset the view
      map.current.flyTo({
        center: [0, 20],
        zoom: 2,
        duration: 2000,
      });

      // Reset all marker styles
      Object.values(markersRef.current).forEach((marker) => {
        const el = marker.getElement();
        el.classList.remove("marker-selected");
      });
    }
  }, [selectedCity]);

  return (
    <div className="relative flex-1">
      <div ref={mapContainer} className="h-full w-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-2xl font-semibold">Loading...</div>
        </div>
      )}
      {/* Weather Card */}
      {selectedCity && weatherData && (
        <div className="absolute right-4 top-4 flex flex-col items-center rounded-2xl bg-white p-4 shadow-[0px_4px_10px_rgba(0,0,0,0.08),0px_10px_20px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-[30px] font-medium leading-7 tracking-[-0.2px] text-[#2A92C6]">
                {weatherData.temperature.toFixed(1)}°C
              </div>
              <div className="flex gap-1">
                <span className="text-[13px] font-medium leading-[22px] tracking-[-0.2px] text-[#5D626F]">
                  H:{weatherData.H.toFixed(1)}°
                </span>
                <span className="text-[13px] font-medium leading-[22px] tracking-[-0.2px] text-[#5D626F]">
                  L:{weatherData.L.toFixed(1)}°
                </span>
              </div>
              {/* Added Weather Description */}
              <div className="text-[14px] font-medium leading-[22px] tracking-[-0.2px] text-[#5D626F] capitalize">
                {weatherData.description}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-end">
              <Image
                src={`https://openweathermap.org/img/wn/${weatherData.icon}.png`}
                alt={weatherData.description}
                width={50}
                height={50}
              />
            </div>
          </div>
          <span className="mt-2 text-base leading-[22px] tracking-[-0.2px] text-[#0E2E3F]">
            {selectedCity.name}, {selectedCity.country}
          </span>
        </div>
      )}
    </div>
  );
}
