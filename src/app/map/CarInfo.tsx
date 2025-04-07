/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CarInfo = () => {
  // State variables
  const [leftWheelRpm, setLeftWheelRpm] = useState(0);
  const [rightWheelRpm, setRightWheelRpm] = useState(0);
  const [avgRpm, setAvgRpm] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [history, setHistory] = useState([]);
  const [lastTime, setLastTime] = useState(null);

  // Car configuration with specific Arduino motor parameters
  const [config, setConfig] = useState({
    wheelDiameter: 0.065, // meters (65mm)
    gearRatio: 1.48, // gear ratio of the Arduino DC motor
    rpmThreshold: 5, // threshold to determine if the car is moving (lower for small DC motors)
  });

  // Calculate speed from RPM
  const calculateSpeed = (rpm: number) => {
    // Speed (m/s) = (RPM × π × wheelDiameter) / (60 × gearRatio)
    // Convert to km/h by multiplying by 3.6
    return (
      (rpm * Math.PI * config.wheelDiameter * 3.6) / (60 * config.gearRatio)
    );
  };

  // Fetch RPM data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the same API structure as your other endpoints
        const response = await fetch(
          "http://192.168.171.47:5000/api/sensor/rpm"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch RPM data");
        }

        const data = await response.json();
        const currentLeftRpm = data.sensor_2_rpm || 0;
        const currentRightRpm = data.sensor_1_rpm || 0;
        const currentTime = data.time || Date.now() / 1000;

        setLeftWheelRpm(currentLeftRpm);
        setRightWheelRpm(currentRightRpm);

        // Calculate average RPM from both wheels
        const currentAvgRpm = (currentLeftRpm + currentRightRpm) / 2;
        setAvgRpm(currentAvgRpm);

        // Determine if the car is moving based on RPM threshold
        const moving = currentAvgRpm > config.rpmThreshold;
        setIsMoving(moving);

        // Calculate current speed based on average RPM
        const currentSpeed = calculateSpeed(currentAvgRpm);
        setSpeed(currentSpeed);

        // If we have a previous timestamp, calculate distance traveled
        if (lastTime !== null && moving) {
          const timeDeltaSeconds = currentTime - lastTime;
          // Distance = speed (m/s) * time (s) / 1000 to get km
          const distanceTraveled =
            ((currentSpeed / 3.6) * timeDeltaSeconds) / 1000;
          setDistance((prevDistance) => prevDistance + distanceTraveled);
        }

        setLastTime(currentTime);

        // Update history
        const timestamp = new Date().toLocaleTimeString();
        setHistory((prevHistory) => {
          const newHistory = [
            ...prevHistory,
            {
              time: timestamp,
              leftRpm: currentLeftRpm,
              rightRpm: currentRightRpm,
              avgRpm: currentAvgRpm.toFixed(1),
              speed: currentSpeed.toFixed(1),
            },
          ];

          // Keep last 20 data points for the chart
          if (newHistory.length > 20) {
            return newHistory.slice(newHistory.length - 20);
          }
          return newHistory;
        });
      } catch (error) {
        console.error("Error fetching RPM data:", error);
      }
    };

    // Fetch data immediately and then every second
    fetchData();
    const interval = setInterval(fetchData, 100000);

    return () => clearInterval(interval);
  }, [config, lastTime]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Speed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="text-5xl font-bold">{speed.toFixed(1)}</div>
                  <div className="ml-2 text-2xl text-gray-500">km/h</div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  Current RPM (Avg): {avgRpm.toFixed(1)}
                </div>
                <div className="text-center text-xs text-gray-400 mt-1">
                  Left: {leftWheelRpm} RPM | Right: {rightWheelRpm} RPM
                </div>
                <div className="text-center text-xs text-gray-400 mt-2">
                  Arduino DC Motor (65mm wheel, 1.48:1 gear ratio)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distance Traveled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="text-5xl font-bold">
                    {Math.round(distance * 100000)}
                  </div>
                  <div className="ml-2 text-2xl text-gray-500">cm</div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  Status: {isMoving ? "Moving" : "Stopped"}
                </div>
                <div className="text-center text-xs text-gray-400 mt-1">
                  {(distance * 1000).toFixed(1)} meters
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Speed History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="speed"
                      stroke="#2563eb"
                      name="Speed (km/h)"
                    />
                    <Line
                      type="monotone"
                      dataKey="leftRpm"
                      stroke="#dc2626"
                      name="Left RPM"
                    />
                    <Line
                      type="monotone"
                      dataKey="rightRpm"
                      stroke="#16a34a"
                      name="Right RPM"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarInfo;
