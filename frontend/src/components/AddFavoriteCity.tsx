"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search } from "lucide-react";
import { searchCities, toggleCityFavorite } from "../lib/api";
import { debounce } from "lodash";

interface City {
  id: number;
  name: string;
  country: string;
  admin_name: string;
  population: number;
  latitude: number;
  longitude: number;
}

interface AddFavoriteCityProps {
  isOpen: boolean;
  onClose: () => void;
  onCityAdded: () => void;
}

export function AddFavoriteCity({
  isOpen,
  onClose,
  onCityAdded,
}: AddFavoriteCityProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const results = await searchCities(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Failed to search cities:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleAddCity = async (city: City) => {
    try {
      await toggleCityFavorite(city.id);
      onCityAdded();
      handleClose();
    } catch (error) {
      console.error("Failed to add city to favorites:", error);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsLoading(false);
    onClose();
  };

  // Reset states when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex h-[500px] flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-[#2E3138]">
              Add Favorite City
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-grow overflow-hidden p-6">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-[#0D44C2] focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Loading...
                </div>
              ) : (
                <ul>
                  {searchResults.map((city) => (
                    <li
                      key={city.id}
                      className="cursor-pointer border-b border-gray-200 px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleAddCity(city)}
                    >
                      <div className="font-semibold">{city.name}</div>
                      <div className="text-sm text-gray-600">
                        {city.admin_name}, {city.country}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end">
              <button
                onClick={() => handleClose()}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
