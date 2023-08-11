import { io } from "socket.io-client";

// main namespace
export const socket = io(import.meta.env.VITE_LOCAL_HOST, {
    auth: {
        // send token to the socket server
        token: `Bearer ${localStorage.getItem("token")}`,
        // before connecting to socket server
        // we have to ensure that user is authenticated and token exists in localStorage
        // as we use socket middleware in the server side that verifies jwt token to create connection
        // that's why autoConnect property set to false
        autoConnect: false,
    }
});
