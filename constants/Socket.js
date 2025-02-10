import { io } from "socket.io-client";
import { BASE_URL } from "./Config";


const socket = io(BASE_URL, {
  autoConnect: false, // Don't connect automatically
  transports: ["websocket"], // Ensure WebSocket transport
});

// Function to connect the socket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Function to disconnect the socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Function to get the socket instance
export const getSocket = () => socket;
