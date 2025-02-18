import { City } from "@/types";
import { useCities } from "@/hooks/useCities";

type CityItemProps = {
  city: City;
};

export default function CityItem({ city }: CityItemProps) {
  const { toggleCitySelection } = useCities();

  return (
    <div
      className={`flex justify-between items-center px-4 py-2 border ${
        city.selected ? "bg-blue-100" : "bg-white"
      } rounded-lg cursor-pointer hover:bg-gray-100`}
      onClick={() => toggleCitySelection(city.id)}
    >
      <span className="text-gray-700">{city.name}</span>
      {city.selected && <span className="text-green-500 font-bold">✓</span>}
    </div>
  );
}
