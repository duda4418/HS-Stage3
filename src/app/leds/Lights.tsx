"use client";
import React, { useState } from "react";

export default function Lights() {
  const [ledStates, setLedStates] = useState([true, true, true]);

  const toggleLED = (index: number) => {
    setLedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const ledColors = [
    { active: "bg-red-500", inactive: "bg-red-900" },
    { active: "bg-green-500", inactive: "bg-green-900" },
    { active: "bg-blue-500", inactive: "bg-blue-900" },
  ];

  return (
    <div className="h-[600px] flex flex-col items-center justify-center">
      <div className="flex space-x-12">
        {ledStates.map((isOn, index) => (
          <div
            key={index}
            onClick={() => toggleLED(index)}
            className={`w-16 h-16 rounded-full cursor-pointer transition-colors duration-300 
              ${isOn ? ledColors[index].active + " shadow-lg animate-pulse" : ledColors[index].inactive}`}
          />
        ))}
      </div>
    </div>
  );
}
