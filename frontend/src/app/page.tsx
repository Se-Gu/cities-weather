"use client";

import Layout from "@/components/layout/Layout";
import Map from "@/components/map/Map";
import { useState } from "react";
import { City } from "@/types";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  return (
    <Layout>
      <Map selectedCity={selectedCity} />
    </Layout>
  );
}
