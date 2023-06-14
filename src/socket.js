import { io } from "socket.io-client";

// main namespace
export const socket = io("http://localhost:5000");
