/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState, useEffect } from "react";

export function CPUCard({ cpu_info }: any) {


  const [cpuInfo, setCpuInfo] = useState<any>(null);

  useEffect(() => {
    const fetchCPUInfo = async () => {
      try {
        const response = await fetch("http://192.168.194.156:5000/api/cpu_info");
        const data = await response.json();
        setCpuInfo(data);
        console.log("CPU INFO:",data)
      } catch (error) {
        console.error("Error fetching CPU info:", error);
      }
    };

    fetchCPUInfo();
    const interval = setInterval(fetchCPUInfo, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>CPU Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>System CPU Metrics</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Attribute</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Architecture</TableCell>
              <TableCell>
                {cpuInfo ? cpuInfo.architecture : "unknown"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CPU Model</TableCell>
              <TableCell>
                {cpuInfo ? cpuInfo.cpu_model : "unknown"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CPU Frequency</TableCell>
              <TableCell>
                {cpuInfo ? cpuInfo.cpu_frequency : "unknown"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Physical Cores</TableCell>
              <TableCell>{cpuInfo ? cpuInfo.cpu_cores : "unknown"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Logical Processors</TableCell>
              <TableCell>
                {cpuInfo ? cpuInfo.logical_processors : "unknown"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CPU Usage</TableCell>
              <TableCell>{cpuInfo ? cpuInfo.cpu_usage : "unknown"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Temperature</TableCell>
              <TableCell>{cpuInfo ? cpuInfo.temperature : "unknown"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
