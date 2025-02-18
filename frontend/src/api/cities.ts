import { City } from "@/types";
import api from "./config";

export const citiesApi = {
  getAll: () => api.get<City[]>("/api/cities").then((res) => res.data),
  getWeather: (cityId: number) =>
    api.get(`/api/weather/${cityId}`).then((res) => res.data),
  addCity: (city: Omit<City, "id">) =>
    api.post<City>("/api/cities", city).then((res) => res.data),
};
