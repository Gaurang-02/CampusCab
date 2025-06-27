"use client";

import React from "react";

type Suggestion = {
  description: string;
  place_id: string;
  [key: string]: string;
};

type Props = {
  suggestions: Suggestion[];
  setVehiclePanel: (val: boolean) => void;
  setPanelOpen: (val: boolean) => void;
  setPickup: (val: string) => void;
  setDestination: (val: string) => void;
  activeField: "pickup" | "destination" | null;
};

const LocationSearchPanel: React.FC<Props> = ({
  suggestions,
  setPickup,
  setDestination,
  activeField,
}) => {
  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion.description); // ✅ Use description
    } else if (activeField === "destination") {
      setDestination(suggestion.description);
    }
    // setVehiclePanel(true);
    // setPanelOpen(false);
  };

  return (
    <div>
      {suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(elem)}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{elem.description}</h4>{" "}
          {/* ✅ FIX HERE */}
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
