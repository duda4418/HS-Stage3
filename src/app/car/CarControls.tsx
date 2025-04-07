"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function CarController() {
  const [accelerator, setAccelerator] = useState(0);
  const [isReverse, setIsReverse] = useState(false);

  const sendMovementCommand = (direction: string, accelerator: number) => {
    fetch(
      `http://192.168.194.156:5000/api/move?direction=${direction}&speed=${accelerator}&frequency=15000`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => console.log("Car Movement Response:", data))
      .catch((error) =>
        console.error("Error sending movement command:", error)
      );
  };

  const stopCar = () => {
    fetch("http://192.168.194.156:5000/api/stop", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => console.log("Car Stopped:", data))
      .catch((error) => console.error("Error sending stop command:", error));
  };

  useEffect(() => {
    const direction = !isReverse ? "backward" : "forward";
    sendMovementCommand(direction, accelerator);
  }, [accelerator, isReverse]);

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Car Controller</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label
            htmlFor="accelerator"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Accelerator
          </label>
          <input
            id="accelerator"
            type="range"
            min="0"
            max="100"
            value={accelerator}
            onChange={(e) => setAccelerator(Number(e.target.value))}
            className="w-full"
          />
          <p className="mt-2 text-sm text-gray-500">
            {isReverse ? "Reversing" : "Driving Forward"} at {accelerator}%
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Switch
            checked={isReverse}
            onCheckedChange={setIsReverse}
            className="cursor-pointer"
          />
          <span>Enable Reverse</span>
        </div>
        <Button onClick={stopCar} className="w-full bg-red-500 text-white">
          Stop Car
        </Button>
      </CardContent>
    </Card>
  );
}
