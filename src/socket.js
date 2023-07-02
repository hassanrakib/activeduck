import { io } from "socket.io-client";

// main namespace
export const socket = io(import.meta.env.VITE_LOCAL_HOST, {
    // send token to the socket server
    auth: {
        token: `Bearer ${localStorage.getItem("token")}`,
    }
});
