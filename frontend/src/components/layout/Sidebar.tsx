import CityList from "../cities/CityList";
import AddCityButton from "../cities/AddCityButton";

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 h-screen bg-white border-r p-4 gap-4 z-10">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Cities</h1>
        <AddCityButton />
      </div>
      <CityList />
    </div>
  );
}
