"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Logs() {
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          "http://192.168.194.156:5000/api/get_logs"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch logs");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          const formattedLogs = data.map((log) => {
            const timestamp = new Date(log.date_logged).toLocaleString();
            const message = log.message;
            const tag = log.component_data?.id || "Unknown Tag";
            const username =
              log.component_data?.data?.username || "Unknown User";

            return `${timestamp} | ${message} | Tag: ${tag} | User: ${username}`;
          });

          setLogs(formattedLogs);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="bg-black text-green-500 h-full w-full">
      <CardHeader>
        <CardTitle className="text-green-500">Terminal Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={logContainerRef}
          className="bg-black text-green-500 font-mono h-[400px] overflow-y-auto p-2 border border-green-500 rounded-lg"
        >
          {logs.map((log, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {log}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
