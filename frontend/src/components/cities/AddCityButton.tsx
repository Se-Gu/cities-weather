import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { citiesApi } from "@/api/cities";

export default function AddCityButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCity, setNewCity] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await citiesApi.addCity({
        name: newCity.name,
        latitude: parseFloat(newCity.latitude),
        longitude: parseFloat(newCity.longitude),
      });
      setIsModalOpen(false);
      // Trigger refresh of city list
      window.location.reload();
    } catch (error) {
      console.error("Failed to add city:", error);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City Name
                </label>
                <input
                  type="text"
                  value={newCity.name}
                  onChange={(e) =>
                    setNewCity({ ...newCity, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={newCity.latitude}
                  onChange={(e) =>
                    setNewCity({ ...newCity, latitude: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={newCity.longitude}
                  onChange={(e) =>
                    setNewCity({ ...newCity, longitude: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
