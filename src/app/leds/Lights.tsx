"use client";
import React, { useState, useEffect } from "react";

export default function Lights() {
  const [ledStates, setLedStates] = useState([false, false, false]);

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://192.168.194.156:5000/api/get_logs");
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const newLedStates = [false, false, false];

        data.forEach((log) => {
          if (log.message.includes("LED ONE TURN ON")) {
            newLedStates[0] = true;
          } else if (log.message.includes("LED ONE TURNED OFF")) {
            newLedStates[0] = false;
          }
          if (log.message.includes("LED TWO TURN ON")) {
            newLedStates[1] = true;
          } else if (log.message.includes("LED TWO TURNED OFF")) {
            newLedStates[1] = false;
          }
          if (log.message.includes("LED THREE TURN ON")) {
            newLedStates[2] = true;
          } else if (log.message.includes("LED THREE TURNED OFF")) {
            newLedStates[2] = false;
          }
        });

        setLedStates(newLedStates);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const ledColors = [
    { active: "bg-red-500", inactive: "bg-red-900" },
    { active: "bg-green-500", inactive: "bg-green-900" },
    { active: "bg-yellow-100", inactive: "bg-yellow-400" },
  ];

  return (
    <div className="h-[600px] flex flex-col items-center justify-center">
      <div className="flex space-x-12">
        {ledStates.map((isOn, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-full transition-colors duration-300 
              ${isOn ? ledColors[index].active + " shadow-lg animate-pulse" : ledColors[index].inactive}`}
          />
        ))}
      </div>
    </div>
  );
}
