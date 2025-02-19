"use client";

import { useState, useEffect, useCallback } from "react";
import { Map } from "../components/Map";
import { Sidebar } from "../components/Sidebar";
import { fetchFavoriteCities } from "../lib/api";

interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function Page() {
  const [favoriteCities, setFavoriteCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavoriteCities = useCallback(async () => {
    try {
      setIsLoading(true);
      const cities = await fetchFavoriteCities();
      setFavoriteCities(cities);
    } catch (error) {
      console.error("Failed to load favorite cities:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavoriteCities();
  }, [loadFavoriteCities]);

  const handleCitySelect = (city: City | null) => {
    setSelectedCity(city);
  };

  // New effect to handle removal of selected city
  useEffect(() => {
    if (
      selectedCity &&
      !favoriteCities.some((city) => city.id === selectedCity.id)
    ) {
      setSelectedCity(null);
    }
  }, [favoriteCities, selectedCity]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar
        favoriteCities={favoriteCities}
        selectedCity={selectedCity?.name}
        onCitySelect={handleCitySelect}
        onFavoriteCitiesChange={loadFavoriteCities}
      />
      <Map
        favoriteCities={favoriteCities}
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
        isLoading={isLoading}
      />
    </div>
  );
}
