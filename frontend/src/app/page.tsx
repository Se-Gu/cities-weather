"use client";

import { useState } from "react";
import { Map } from "../components/Map";
import { Sidebar } from "../components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  const [selectedCity, setSelectedCity] = useState("London");

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar
          selectedCity={selectedCity}
          onCitySelect={(city) => setSelectedCity(city.name)}
        />
        <Map />
      </div>
    </SidebarProvider>
  );
}
