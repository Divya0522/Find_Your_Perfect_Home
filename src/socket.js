import { io } from "socket.io-client";

// Replace with your server URL
const socket = io("http://localhost:5001", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;