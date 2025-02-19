"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  cities: City[];
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
}

export function Map({ cities, selectedCity, onCitySelect }: MapProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<{ [key: number]: maplibregl.Marker }>({});

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
      center: [0, 0],
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

    // Add markers for all cities
    cities.forEach((city) => {
      const marker = new maplibregl.Marker({
        color: "#4134F1",
      })
        .setLngLat([city.longitude, city.latitude])
        .addTo(map.current!);

      // Add click event to the marker
      marker.getElement().addEventListener("click", () => onCitySelect(city));

      markersRef.current[city.id] = marker;
    });
  }, [cities, onCitySelect]);

  // Update map when a city is selected
  React.useEffect(() => {
    if (map.current && selectedCity) {
      map.current.flyTo({
        center: [selectedCity.longitude, selectedCity.latitude],
        zoom: 10,
        duration: 2000,
      });

      // Highlight the selected marker
      Object.values(markersRef.current).forEach((marker) => {
        marker.getElement().style.zIndex = "0";
      });
      if (markersRef.current[selectedCity.id]) {
        markersRef.current[selectedCity.id].getElement().style.zIndex = "1";
      }
    }
  }, [selectedCity]);

  return (
    <div className="relative flex-1">
      <div ref={mapContainer} className="h-full w-full" />
      {selectedCity && (
        <div className="absolute left-4 top-4 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0px_4px_10px_rgba(0,0,0,0.08),0px_10px_20px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col gap-1">
            <div className="text-[30px] font-medium leading-7 tracking-[-0.2px] text-[#2A92C6]">
              2°C
            </div>
            <div className="flex gap-1">
              <span className="text-[13px] font-medium leading-[22px] tracking-[-0.2px] text-[#5D626F]">
                H:8°
              </span>
              <span className="text-[13px] font-medium leading-[22px] tracking-[-0.2px] text-[#5D626F]">
                L:2°
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-end">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 12H4M20 12H22M12 2V4M12 20V22M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93M19.07 4.93L17.66 6.34"
                stroke="#0E2E3F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-right text-base leading-[22px] tracking-[-0.2px] text-[#0E2E3F]">
              {selectedCity.name}, {selectedCity.country}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
