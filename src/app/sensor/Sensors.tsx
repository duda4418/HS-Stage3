"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Sensors() {
  const canvasRef = useRef(null);
  const [sensorData, setSensorData] = useState({
    sensor_1: 15.61,
    sensor_2: 89.52,
    sensor_3: 78.12,
    sensor_4: 7.92,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Scale factor for converting cm to pixels
  const SCALE_FACTOR = 2; // 2 pixels = 1 cm

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://192.168.171.47:5000/api/sensor/distances"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sensor data");
        }

        const data = await response.json();
        console.log(data);
        // The data is already in the correct format
        // { sensor_1: 15.61, sensor_2: 89.52, sensor_3: 78.12, sensor_4: 7.92 }

        // Remove timestamp if it exists before setting state
        const { timestamp, ...sensorReadings } = data;

        setSensorData(sensorReadings);
        setError(null);
      } catch (err) {
        console.error("Error fetching ultrasonic sensor data:", err);
        setError("Failed to load sensor data");
      } finally {
        setLoading(false);
      }
    };

    // Fetch data on component mount
    fetchSensorData();

    // Set up polling interval
    const interval = setInterval(fetchSensorData, 300);

    // Clean up on component unmount
    return () => clearInterval(interval);
  }, []);

  // Draw on canvas whenever sensor data changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw coordinate axes
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw center point (representing the device)
    ctx.fillStyle = "#3b82f6"; // Blue
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw sensor dots
    const dotRadius = 6;

    // Function to draw a sensor dot
    const drawSensorDot = (distance, angle, sensorNumber) => {
      if (distance === null || distance === undefined) return;

      // Calculate coordinates
      const x = centerX + Math.cos(angle) * distance * SCALE_FACTOR;
      const y = centerY - Math.sin(angle) * distance * SCALE_FACTOR;

      // Choose color based on distance
      let color;
      if (distance < 10)
        color = "#ef4444"; // Red - close
      else if (distance < 30)
        color = "#f97316"; // Orange - medium
      else if (distance < 60)
        color = "#eab308"; // Yellow - far
      else color = "#22c55e"; // Green - very far

      // Draw the dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      // Add label with distance
      ctx.fillStyle = "#000000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${distance.toFixed(1)}cm`, x, y - 15);

      // Add sensor number
      ctx.fillText(`S${sensorNumber}`, x, y + 15);

      // Draw line from center to dot
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]); // Dashed line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset to solid line
    };

    // Draw dots for each sensor (angles in radians)
    // Sensor 1 - Front (upward)
    drawSensorDot(sensorData.sensor_1, Math.PI / 2, 1);

    // Sensor 2 - Right (rightward)
    drawSensorDot(sensorData.sensor_2, 0, 2);

    // Sensor 3 - Back (downward)
    drawSensorDot(sensorData.sensor_3, -Math.PI / 2, 3);

    // Sensor 4 - Left (leftward)
    drawSensorDot(sensorData.sensor_4, Math.PI, 4);

    // Draw labels for directions
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Front", centerX, 20);
    ctx.fillText("Back", centerX, height - 20);
    ctx.fillText("Left", 20, centerY);
    ctx.fillText("Right", width - 20, centerY);
  }, [sensorData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ultrasonic Sensor Map</CardTitle>
      </CardHeader>
      <CardContent>
        {/* {loading && <p className="text-center">Updating sensor data...</p>} */}

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p className="text-center">
            The map shows sensor readings as dots in 4 directions.
          </p>
          <p className="text-center">
            Colors indicate distance: Red (&lt;10cm), Orange (&lt;30cm), Yellow
            (&lt;60cm), Green (&gt;60cm)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
