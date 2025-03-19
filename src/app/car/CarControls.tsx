"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function CarController() {
  // Accelerator value ranges from 0 to 100
  const [accelerator, setAccelerator] = useState(0);
  // Reverse mode toggled on/off
  const [isReverse, setIsReverse] = useState(false);

  // Compute the speed based on reverse mode.
  // If reverse is enabled, speed is negative.
  const speed = isReverse ? -accelerator : accelerator;

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Car Controller</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Accelerator Control */}
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
            {isReverse ? "Reversing" : "Driving Forward"} at {Math.abs(speed)}%
          </p>
        </div>
        {/* Reverse Switch */}
        <div className="flex items-center space-x-3">
          <Switch
            checked={isReverse}
            onCheckedChange={setIsReverse}
            className="cursor-pointer"
          />
          <span>Enable Reverse</span>
        </div>
      </CardContent>
    </Card>
  );
}
