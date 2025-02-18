import { City } from "@/types";
import api from "./config";

export const citiesApi = {
  getAll: () => api.get<City[]>("/api/cities").then((res) => res.data),
  getSelectedCities: () =>
    api.get<City[]>("/api/cities/selected").then((res) => res.data),
  searchCities: (query: string) =>
    api
      .get<City[]>(`/api/cities/search?q=${query}&limit=20`)
      .then((res) => res.data),
  getWeather: (cityId: number) =>
    api.get(`/api/weather/${cityId}`).then((res) => res.data),
  addCity: (city: Omit<City, "id">) =>
    api.post<City>("/api/cities", city).then((res) => res.data),
  toggleCitySelection: (cityId: number) =>
    api.patch(`/api/cities/${cityId}/toggle`).then((res) => res.data),
};
