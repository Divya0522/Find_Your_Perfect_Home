import { io } from "socket.io-client";

// Replace with your server URL
const socket = io("https://find-your-perfect-home-backend.onrender.com/api", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;