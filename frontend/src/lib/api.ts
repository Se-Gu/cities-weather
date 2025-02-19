const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function fetchSelectedCities() {
  const response = await fetch(`${API_BASE_URL}/cities/selected`);
  if (!response.ok) {
    throw new Error("Failed to fetch selected cities");
  }
  return response.json();
}

export async function toggleCitySelection(cityId: number) {
  const response = await fetch(`${API_BASE_URL}/cities/${cityId}/toggle`, {
    method: "PATCH",
  });
  if (!response.ok) {
    throw new Error("Failed to toggle city selection");
  }
  return response.json();
}
