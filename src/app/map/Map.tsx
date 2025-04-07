/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import socket from "@/lib/socket";
import React, { useEffect, useState } from "react";

export default function Map() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // Setup connection status listener
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Listen for messages from the server
    const onServerMessage = (data: any) => {
      setMessages((prev) => [...prev, `Server: ${data.data}`]);
    };

    const onMessage = (data: any) => {
      setMessages((prev) => [...prev, `Received: ${data}`]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("server_message", onServerMessage);
    socket.on("server_event", onServerMessage);
    socket.on("message", onMessage);

    // Check initial connection state
    setIsConnected(socket.connected);

    // Cleanup function
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("server_message", onServerMessage);
      socket.off("server_event", onServerMessage);
      socket.off("message", onMessage);
    };
  }, []);

  // Send a message to the server
  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      socket.emit("message", inputMessage);
      setMessages((prev) => [...prev, `Sent: ${inputMessage}`]);
      setInputMessage("");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}
        ></div>
        <span>{isConnected ? "Connected" : "Disconnected"}</span>
      </div>

      <div className="border rounded p-3 h-60 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-1">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded px-3 py-2 mr-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
