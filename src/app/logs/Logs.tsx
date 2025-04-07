/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import io from "socket.io-client"; // Make sure to npm install socket.io-client

export function Logs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Format log entries consistently
  const formatLog = (log: any) => {
    const timestamp = new Date(log.date_logged).toLocaleString();
    const message = log.message;

    if (message.includes("RFID SCANNED")) {
      const tag =
        log.component_data?.id ||
        log.component_data?.data?.tag_id ||
        "Unknown Tag";
      const username = log.component_data?.data?.username || "";
      return `${timestamp} | ${message} | Tag: ${tag}${username ? ` | User: ${username}` : ""}`;
    }

    if (message.includes("LED")) {
      const led = log.component_data?.data?.led || "Unknown LED";
      return `${timestamp} | ${message} | LED: ${led}`;
    }

    return `${timestamp} | ${message}`;
  };

  // Initial fetch of existing logs
  const fetchInitialLogs = async () => {
    try {
      const response = await fetch("http://192.168.171.47:5000/api/get_logs");
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedLogs = data.map(formatLog);
        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error("Error fetching initial logs:", error);
    }
  };

  // Setup Socket.IO connection
  useEffect(() => {
    // First fetch existing logs
    fetchInitialLogs();

    // Initialize Socket.IO connection
    socketRef.current = io("http://192.168.171.47:5000");

    // Socket.IO connection event
    socketRef.current.on("connect", () => {
      console.log("Socket.IO connected");
      setIsConnected(true);
    });

    // Socket.IO disconnection event
    socketRef.current.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setIsConnected(false);
    });

    // Listen for new log messages
    socketRef.current.on("message", (newLog: any) => {
      try {
        // setLogs((prevLogs) => [...prevLogs, formatLog(newLog)]);
        console.log(newLog);
      } catch (error) {
        console.error("Error processing new log:", error);
      }
    });

    // Error handling
    socketRef.current.on("connect_error", (error: any) => {
      console.error("Socket.IO connection error:", error);
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Fallback to HTTP polling if Socket.IO connection fails
  useEffect(() => {
    // Only set up polling if Socket.IO is not connected
    if (!isConnected) {
      const pollInterval = setInterval(fetchInitialLogs, 3000);
      return () => clearInterval(pollInterval);
    }
  }, [isConnected]);

  return (
    <Card className="bg-black text-green-500 h-full w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-500">Terminal Logs</CardTitle>
        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              try {
                const response = await fetch(
                  "http://192.168.171.47:5000/api/serial/test"
                );
                if (!response.ok) {
                  throw new Error("Failed to send test logs");
                }
                console.log("Test logs sent successfully");
              } catch (error) {
                console.error("Error sending test logs:", error);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
          >
            Send Logs
          </button>
          <div className="flex items-center">
            <span
              className={`h-2 w-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            <span className="text-xs">{isConnected ? "Live" : "Polling"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={logContainerRef}
          className="bg-black text-green-500 font-mono h-[550px] overflow-y-auto p-2 border border-green-500 rounded-lg"
        >
          {logs.map((log, index) => (
            <p
              key={index}
              className={`whitespace-pre-wrap ${
                index >= logs.length - 2 ? "text-yellow-500" : ""
              }`}
            >
              {log}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
 