// lib/socket.ts
import { io } from "socket.io-client";

// Create a socket connection to the Flask backend
const socket = io("http://192.168.180.156:5000", {
  transports: ["polling"],
  timeout: 30000,
  path: "/socket.io", // Explicitly set the path
});

// Add some logging for development
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

export default socket;
