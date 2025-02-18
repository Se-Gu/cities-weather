import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { City, Weather } from "@/types";

interface MapMarkerProps {
  map: maplibregl.Map;
  city: City;
  weather?: Weather;
  isSelected: boolean;
}

export default function MapMarker({
  map,
  city,
  weather,
  isSelected,
}: MapMarkerProps) {
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  useEffect(() => {
    if (!markerRef.current) {
      const el = document.createElement("div");
      el.className = "marker";
      el.innerHTML = `
        <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      `;

      markerRef.current = new maplibregl.Marker(el)
        .setLngLat([city.longitude, city.latitude])
        .addTo(map);
    }

    if (weather) {
      if (!popupRef.current) {
        popupRef.current = new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <div class="text-lg font-bold">${weather.temperature}°C</div>
              <div class="text-sm">${weather.description}</div>
            </div>
          `);
      }

      if (isSelected) {
        markerRef.current.setPopup(popupRef.current);
        popupRef.current.addTo(map);
      }
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [map, city, weather, isSelected]);

  return null;
}
