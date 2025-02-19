const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// Helper function to check if the browser supports the Cache API
const isCacheSupported = () => {
  return "caches" in window;
};

// Helper function to get cached data
async function getCachedData(cacheKey: string) {
  if (!isCacheSupported()) return null;

  const cache = await caches.open("api-cache");
  const cachedResponse = await cache.match(cacheKey);

  if (!cachedResponse) return null;

  const data = await cachedResponse.json();
  if (data.expiry && data.expiry < Date.now()) {
    await cache.delete(cacheKey);
    return null;
  }

  return data.value;
}

// Helper function to set cached data
async function setCachedData<T>(
  cacheKey: string,
  data: T,
  ttl: number | null = null
) {
  if (!isCacheSupported()) return;

  const cache = await caches.open("api-cache");
  const cacheData = {
    value: data,
    expiry: ttl ? Date.now() + ttl : null,
  };

  const response = new Response(JSON.stringify(cacheData));
  await cache.put(cacheKey, response);
}

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
  const cacheKey = `${API_BASE_URL}/api/cities/search?q=${encodeURIComponent(
    query
  )}&limit=5`;

  // Try to get cached data
  const cachedData = await getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, fetch from API
  const response = await fetch(cacheKey);
  if (!response.ok) {
    throw new Error("Failed to search cities");
  }
  const data = await response.json();

  // Cache the result indefinitely
  await setCachedData(cacheKey, data);

  return data;
}

export async function getWeather(lat: number, lon: number) {
  const cacheKey = `${API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`;

  // Try to get cached data
  const cachedData = await getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, fetch from API
  const response = await fetch(cacheKey);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  const data = await response.json();

  // Cache the result for 30 minutes
  await setCachedData(cacheKey, data, 30 * 60 * 1000); // 30 minutes in milliseconds

  return data;
}
