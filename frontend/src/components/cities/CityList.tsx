import { useCities } from "@/hooks/useCities";
import CityItem from "./CityItem";

export default function CityList() {
  const { cities, selectedCities, loading, error } = useCities();

  if (loading) return <p>Loading cities...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Selected Cities</h2>
      {selectedCities.length === 0 ? (
        <p className="text-gray-500">No selected cities.</p>
      ) : (
        selectedCities.map((city) => <CityItem key={city.id} city={city} />)
      )}

      <h2 className="text-lg font-semibold mt-4">All Cities</h2>
      {cities.map((city) => (
        <CityItem key={city.id} city={city} />
      ))}
    </div>
  );
}
