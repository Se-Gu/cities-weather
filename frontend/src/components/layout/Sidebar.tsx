import CityList from "../cities/CityList";
import AddCityButton from "../cities/AddCityButton";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-screen">
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Cities</h1>
        <AddCityButton />
      </div>
      <CityList />
    </div>
  );
}
