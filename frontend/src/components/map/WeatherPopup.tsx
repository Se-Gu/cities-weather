import { Weather } from "@/types";

interface WeatherPopupProps {
  weather: Weather;
}

export default function WeatherPopup({ weather }: WeatherPopupProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="text-2xl font-bold">{weather.temperature}°C</div>
      <div className="text-gray-600">{weather.description}</div>
    </div>
  );
}
