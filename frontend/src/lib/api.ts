const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function fetchFavoriteCities() {
  const response = await fetch(`${API_BASE_URL}/api/cities/favorites`);
  if (!response.ok) {
    throw new Error("Failed to fetch favorite cities");
  }
  return response.json();
}

export async function toggleCityFavorite(cityId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/cities/${cityId}/toggle-favorite`,
    {
      method: "PATCH",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to toggle city favorite status");
  }
  return response.json();
}

export async function searchCities(query: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/cities/search?q=${encodeURIComponent(query)}&limit=5`
  );
  if (!response.ok) {
    throw new Error("Failed to search cities");
  }
  return response.json();
}
