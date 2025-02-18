import { City } from "@/types";
import { MapPinIcon } from "@heroicons/react/24/solid";

interface CityItemProps {
  city: City;
  isSelected: boolean;
  onClick: () => void;
}

export default function CityItem({ city, isSelected, onClick }: CityItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 transition-colors ${
        isSelected ? "text-blue-600 bg-blue-50 hover:bg-blue-50" : ""
      }`}
    >
      <MapPinIcon
        className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-400"}`}
      />
      {city.name}
    </button>
  );
}
