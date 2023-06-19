import { io } from "socket.io-client";

// main namespace
export const socket = io("http://localhost:5000", {
    // send token to the socket server
    auth: {
        token: `Bearer ${localStorage.getItem("token")}`,
    }
});
