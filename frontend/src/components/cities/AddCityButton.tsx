import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { citiesApi } from "@/api/cities";

type CityOption = {
  value: string;
  label: string;
  latitude: number;
  longitude: number;
};

export default function AddCityButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);

  // ✅ Use citiesApi to fetch cities properly
  const fetchCities = debounce(async (inputValue: string, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    try {
      const data = await citiesApi.searchCities(inputValue);

      // ✅ Ensure correct mapping
      const cityOptions = data.map((city) => ({
        value: city.id.toString(),
        label: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      }));

      console.log("Mapped City Options:", cityOptions); // Debugging log

      if (Array.isArray(cityOptions) && cityOptions.length > 0) {
        callback(cityOptions); // ✅ Ensure callback receives correct data
      } else {
        console.error(
          "Error: cityOptions is empty or not an array",
          cityOptions
        );
        callback([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      callback([]);
    }
  }, 300);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm hover:bg-blue-700 transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        Add new
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New City</h2>
            <AsyncSelect
              value={selectedCity}
              onChange={setSelectedCity}
              loadOptions={fetchCities} // ✅ Ensure correct fetch function is used
              placeholder="Search for a city..."
              className="w-full"
              cacheOptions
              defaultOptions
            />
          </div>
        </div>
      )}
    </>
  );
}
