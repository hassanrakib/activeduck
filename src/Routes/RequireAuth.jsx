import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../Pages/Shared/Loader/Loader";
import { socket } from "../socket";
import React from "react";

const RequireAuth = ({ children }) => {
  // get the current authenticated user from the context
  const { user, loading } = useAuth();

  // get the current location
  const location = useLocation();

  // state that says socket connection established or not
  const [isSocketConnected, setIsSocketConnected] = React.useState(false);

  // loader that is used here for different cases
  const LoadingUI = (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader />
    </div>
  );

  React.useEffect(() => {
    // if user not loading and user found condition
    // ensures all credentials needed to make a socket connection exists
    if (!loading && user) {
      // connect to the socket
      socket.connect();
    }

    // disconnect the socket
    // before the RequireAuth unmounts disconnect
    // works for logout
    return () => {
      socket.disconnect();
    };
  }, [loading, user]);

  React.useEffect(() => {
    // connect event listener
    function onConnectEvent() {
      // connect event makes isSocketConnected set to true
      setIsSocketConnected(true);
    }
    socket.on("connect", onConnectEvent);

    // cleanup
    return () => {
      socket.off("connect", onConnectEvent);
    };
  }, []);

  // if user loading
  if (loading) {
    // show loader
    return LoadingUI;
  }

  // if the visitor is not authenticated the user variable is null
  if (!user) {
    // Redirect user to the /auth page
    // but, save the current location
    // after sign in, drop the visitor to page where he/she was trying to go
    // using the saved location

    // send the location to the /auth page using the state prop
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // if socket connection not yet established
  if (!isSocketConnected) {
    // show loader
    return LoadingUI;
  }

  // if the visitor is an authenticated user & after the socket connection established successfully
  // let him/her go to the destination page
  return children;
};

export default RequireAuth;
