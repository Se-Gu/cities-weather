"use client";

import { useState } from "react";
import { Map } from "../components/Map";
import { Sidebar } from "../components/Sidebar";

export default function Page() {
  const [selectedCity, setSelectedCity] = useState("London");

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedCity={selectedCity}
        onCitySelect={(city) => setSelectedCity(city.name)}
      />
      <Map lat={0} lng={0} />
    </div>
  );
}
