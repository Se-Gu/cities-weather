import { useCities } from "@/hooks/useCities";
import CityItem from "./CityItem";

export default function CityList() {
  const { cities, selectedCity, selectCity, loading, error } = useCities();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="py-2">
      {cities.map((city) => (
        <CityItem
          key={city.id}
          city={city}
          isSelected={selectedCity?.id === city.id}
          onClick={() => selectCity(city)}
        />
      ))}
    </div>
  );
}
