"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SPICard() {
  const [spiFreq, setSpiFreq] = useState<string | null>(null);

  useEffect(() => {
    const fetchSPIFrequency = async () => {
      try {
        const response = await fetch(
          "http://192.168.194.156:5000/api/spi_frequency"
        );
        const data = await response.json();
        setSpiFreq(
          data.spi_frequency ? `${data.spi_frequency / 1e6} MHz` : "N/A"
        );
      } catch (error) {
        console.error("Error fetching SPI frequency:", error);
        setSpiFreq("Error");
      }
    };

    fetchSPIFrequency();
  }, []);

  return (
    <Card className="w-[200px]">
      <CardHeader>
        <CardTitle>SPI Frequency</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{spiFreq || "Loading..."}</p>
      </CardContent>
    </Card>
  );
}
