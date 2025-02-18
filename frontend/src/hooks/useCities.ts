import { useState, useEffect } from "react";
import { City } from "@/types";
import { citiesApi } from "@/api/cities";

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await citiesApi.getAll();
        setCities(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch cities");
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const selectCity = (city: City) => {
    setSelectedCity(city);
  };

  return {
    cities,
    selectedCity,
    loading,
    error,
    selectCity,
  };
}
