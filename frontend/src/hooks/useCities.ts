import { useState, useEffect } from "react";
import { City } from "@/types";
import { citiesApi } from "@/api/cities";

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSelectedCities = async () => {
      try {
        const data = await citiesApi.getSelectedCities();
        setSelectedCities(data);
      } catch (err) {
        console.error("Failed to fetch selected cities:", err);
      }
    };
    fetchSelectedCities();
  }, []);

  const toggleCitySelection = async (cityId: number) => {
    try {
      const updatedCity = await citiesApi.toggleCitySelection(cityId);

      setCities((prev) =>
        prev.map((city) =>
          city.id === cityId
            ? { ...city, selected: updatedCity.selected }
            : city
        )
      );

      if (updatedCity.selected) {
        setSelectedCities((prev) => [...prev, updatedCity]);
      } else {
        setSelectedCities((prev) => prev.filter((city) => city.id !== cityId));
      }
    } catch (error) {
      console.error("Error toggling city selection:", error);
    }
  };

  return {
    cities,
    selectedCities,
    loading,
    error,
    toggleCitySelection,
  };
}
