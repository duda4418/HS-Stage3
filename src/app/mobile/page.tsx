"use client";

import { useCallback, useState } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

export default function MobileController() {
  const [accelerator, setAccelerator] = useState(100);

  const sendMovementCommand = useCallback((direction: string, accelerator: number) => {
    fetch(
      `http://192.168.171.47:5000/api/motor/move?direction=${direction}&speed=${accelerator}`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((data) => console.log("Car Movement Response:", data))
      .catch((err) => console.error("Error sending movement command:", err));
  }, []);

  const stopCar = useCallback(() => {
    fetch("http://192.168.171.47:5000/api/motor/stop", { method: "GET" })
      .then((res) => res.json())
      .then((data) => console.log("Car Stopped:", data))
      .catch((err) => console.error("Error sending stop command:", err));
  }, []);

  const handleControl = useCallback(
    (direction: "forward" | "backward" | "left" | "right" | "rotate") => {
      sendMovementCommand(direction, accelerator);
    },
    [accelerator, sendMovementCommand]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#abb9cf] text-white px-4 py-8 gap-8">
      {/* Joystick */}
      <div className="grid grid-cols-3 grid-rows-3 gap-4">
        <div />
        <button
          onMouseDown={() => handleControl("forward")}
          onMouseUp={stopCar}
          className="bg-blue-600 hover:bg-blue-700 w-20 h-20 rounded-full flex items-center justify-center text-xl shadow-xl active:scale-95 transition"
        >
          <ArrowUp />
        </button>
        <div />

        <button
          onMouseDown={() => handleControl("left")}
          onMouseUp={stopCar}
          className="bg-blue-600 hover:bg-blue-700 w-20 h-20 rounded-full flex items-center justify-center text-xl shadow-xl active:scale-95 transition"
        >
          <ArrowLeft />
        </button>

        <button
          onMouseDown={() => handleControl("rotate")}
          onMouseUp={stopCar}
          className="bg-[#6597e6] hover:bg-purple-700 w-20 h-20 rounded-full flex items-center justify-center text-xl shadow-xl active:scale-95 transition"
        >
          <RotateCcw />
        </button>

        <button
          onMouseDown={() => handleControl("right")}
          onMouseUp={stopCar}
          className="bg-blue-600 hover:bg-blue-700 w-20 h-20 rounded-full flex items-center justify-center text-xl shadow-xl active:scale-95 transition"
        >
          <ArrowRight />
        </button>

        <div />
        <button
          onMouseDown={() => handleControl("backward")}
          onMouseUp={stopCar}
          className="bg-blue-600 hover:bg-blue-700 w-20 h-20 rounded-full flex items-center justify-center text-xl shadow-xl active:scale-95 transition"
        >
          <ArrowDown />
        </button>
        <div />
      </div>

      {/* Controls */}
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center text-lg font-medium">
          Accelerator: {accelerator}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={accelerator}
          onChange={(e) => setAccelerator(Number(e.target.value))}
          className="w-full accent-blue-500"
        />  
        <button
          onClick={stopCar}
          className="w-full bg-red-600 hover:bg-red-700 px-6 py-4 rounded-xl shadow-lg transition active:scale-95"
        >
          STOP
        </button>
      </div>
    </div>
  );
}
