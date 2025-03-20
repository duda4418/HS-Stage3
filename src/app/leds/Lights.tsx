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
      console.log("DATA:", data)
      if (Array.isArray(data)) {
        const newLedStates = [false, false, false];

        const lastLog = data[data.length - 1]; // Get the last log entry

      if (lastLog) {
        if (lastLog.message.includes("LED ONE TURN ON")) {
          newLedStates[0] = true;
        } else if (lastLog.message.includes("LED ONE TURNED OFF")) {
          newLedStates[0] = false;
        }
        if (lastLog.message.includes("LED TWO TURN ON")) {
          newLedStates[1] = true;
        } else if (lastLog.message.includes("LED TWO TURNED OFF")) {
          newLedStates[1] = false;
        }
        if (lastLog.message.includes("LED THREE TURN ON")) {
          newLedStates[2] = false;
        } else if (lastLog.message.includes("LED THREE TURNED OFF")) {
          newLedStates[2] = false;
        }
      }
        setLedStates(newLedStates);
        console.log("Ledstates:", ledStates)
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [ledStates]);

  const ledColors = [
    { inactive: "bg-gray-400", active: "bg-yellow-300" },
    { inactive: "bg-gray-400", active: "bg-green-500" },  
    { inactive: "bg-gray-400", active: "bg-red-500" },
  ];

  return (
    <div className="h-[600px] flex flex-col items-center justify-center">
      <div className="flex space-x-12">
        {ledStates.map((isOn, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-full transition-colors duration-300 
              ${isOn ? ledColors[index].active /*+ " shadow-lg animate-pulse"*/ : ledColors[index].inactive}`}
          />
        ))}
      </div>
    </div>
  );
}
