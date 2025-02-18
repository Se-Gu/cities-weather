import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { City, Weather } from "@/types";
import MapMarker from "./MapMarker";
import ZoomControls from "./ZoomControls";
import WeatherPopup from "./WeatherPopup";

interface MapProps {
  selectedCity: City | null;
}

export default function Map({ selectedCity }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [0, 0],
        zoom: 1,
      });

      map.current.addControl(
        new maplibregl.NavigationControl(),
        "bottom-right"
      );
    }
  }, []);

  useEffect(() => {
    if (selectedCity && map.current) {
      map.current.flyTo({
        center: [selectedCity.longitude, selectedCity.latitude],
        zoom: 10,
      });

      // Fetch weather data
      fetch(`http://localhost:5000/api/weather/${selectedCity.id}`)
        .then((res) => res.json())
        .then((data) => setWeather(data));
    }
  }, [selectedCity]);

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="h-full" />
      {selectedCity && weather && (
        <MapMarker
          map={map.current!}
          city={selectedCity}
          weather={weather}
          isSelected={true}
        />
      )}
    </div>
  );
}
