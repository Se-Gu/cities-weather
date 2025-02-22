"use client";
import { useState } from "react";
import { Plus, X, Menu } from "lucide-react";
import { AddFavoriteCity } from "./AddFavoriteCity";
import { toggleCityFavorite } from "../lib/api";

interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface SidebarProps {
  selectedCity?: string;
  onCitySelect: (city: City | null) => void;
  favoriteCities: City[];
  onFavoriteCitiesChange: () => void;
}

export function Sidebar({
  selectedCity,
  onCitySelect,
  favoriteCities,
  onFavoriteCitiesChange,
}: SidebarProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleFavorite = async (city: City) => {
    try {
      await toggleCityFavorite(city.id);
      onFavoriteCitiesChange();
      setIsMobileMenuOpen(false); // Close sidebar when removing a city
    } catch (error) {
      console.error("Failed to toggle favorite status:", error);
    }
  };

  const handleCitySelect = (city: City | null) => {
    onCitySelect(city);
    setIsMobileMenuOpen(false); // Close sidebar when selecting a city
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setIsMobileMenuOpen(false); // Close sidebar when opening the add modal
  };

  return (
    <>
      {/* Hide menu button when sidebar is open */}
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-[320px] md:flex md:flex-col md:border-r md:border-gray-200`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex h-32 items-center justify-between px-4">
            <h2 className="text-xl font-semibold text-[#2E3138]">
              Favorite Cities
            </h2>
            <button
              className="flex h-9 items-center gap-2 rounded-lg bg-[#0D44C2] px-3 py-1.5"
              onClick={openAddModal}
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="text-lg leading-6 text-[#F1F5FE]">Add new</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {favoriteCities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <p className="text-lg text-gray-600 mb-4">
                  You haven&apos;t added any favorite cities yet.
                </p>
                <button
                  className="flex items-center gap-2 rounded-lg bg-[#0D44C2] px-4 py-2 text-white"
                  onClick={openAddModal}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add your first city</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                {favoriteCities.map((city) => (
                  <div
                    key={city.id}
                    className={`flex h-[46px] items-center justify-between border-b border-[#E3E4E8] px-4 py-3 ${
                      selectedCity === city.name ? "bg-[#F1F5FE]" : ""
                    }`}
                  >
                    <button
                      onClick={() =>
                        handleCitySelect(
                          selectedCity === city.name ? null : city
                        )
                      }
                      className={`flex-grow text-left ${
                        selectedCity === city.name
                          ? "font-semibold text-[#1051E8]"
                          : "text-[#2E3138]"
                      }`}
                    >
                      <span className="text-lg leading-[22px] tracking-[-0.2px]">
                        {city.name}
                      </span>
                    </button>
                    {selectedCity === city.name && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-[6.86px] bg-[#1051E8]">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                    <button
                      onClick={() => handleToggleFavorite(city)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                      title="Remove from favorites"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddFavoriteCity
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCityAdded={onFavoriteCitiesChange}
      />
    </>
  );
}
