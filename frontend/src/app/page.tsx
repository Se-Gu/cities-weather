"use client";

import { useState, useEffect } from "react";
import { Map } from "../components/Map";
import { Sidebar } from "../components/Sidebar";
import { fetchSelectedCities } from "../lib/api";

interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function Page() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  useEffect(() => {
    async function loadSelectedCities() {
      try {
        const selectedCities = await fetchSelectedCities();
        setCities(selectedCities);
      } catch (error) {
        console.error("Failed to load selected cities:", error);
      }
    }

    loadSelectedCities();
  }, []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedCity={selectedCity?.name}
        onCitySelect={handleCitySelect}
        cities={cities}
      />
      <Map
        cities={cities}
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
      />
    </div>
  );
}
