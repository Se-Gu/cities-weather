"use client";
import { Plus } from "lucide-react";

const cities = [
  { id: 1, name: "New York", coordinates: [-74.006, 40.7128] },
  { id: 2, name: "London", coordinates: [-0.1276, 51.5074] },
  { id: 3, name: "Tokyo", coordinates: [139.6917, 35.6895] },
  { id: 4, name: "Istanbul", coordinates: [28.9784, 41.0082] },
  { id: 5, name: "Rome", coordinates: [12.4964, 41.9028] },
];

interface SidebarProps {
  selectedCity?: string;
  onCitySelect?: (city: { name: string; coordinates: number[] }) => void;
}

export function Sidebar({ selectedCity, onCitySelect }: SidebarProps) {
  return (
    <div className="flex w-[320px] flex-col border-r border-gray-200">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex h-32 items-center justify-between px-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold text-[#2E3138]">Cities</h2>
            <button className="flex h-9 items-center gap-2 rounded-lg bg-[#0D44C2] px-3 py-1.5">
              <Plus className="h-4 w-4 text-white" />
              <span className="text-lg leading-6 text-[#F1F5FE]">Add new</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => onCitySelect?.(city)}
                className={`flex h-[46px] items-center justify-between border-b border-[#E3E4E8] px-4 py-3 text-left ${
                  selectedCity === city.name
                    ? "bg-[#F1F5FE] font-semibold text-[#1051E8]"
                    : "text-[#2E3138]"
                }`}
              >
                <span className="text-lg leading-[22px] tracking-[-0.2px]">
                  {city.name}
                </span>
                {selectedCity === city.name && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-[6.86px] bg-[#1051E8]">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
