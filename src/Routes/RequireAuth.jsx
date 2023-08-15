import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../Pages/Shared/Loader/Loader";
import React from "react";
import { socket } from "../socket";

const RequireAuth = ({ children }) => {
  // get the current authenticated user from the context
  const { user, loading } = useAuth();

  // get the current location
  const location = useLocation();

  React.useEffect(() => {
    // user not loading and user found condition
    // ensures all credentials needed to make a socket connection exists
    if (!loading && user) {
      // update socket auth token then connect
      socket.auth = { token: `Bearer ${localStorage.getItem("token")}` };

      // now as we have updated the token, there will be no issue while connecting
      socket.connect();
    }

    // disconnect the socket
    // before the RequireAuth unmounts disconnect
    // works for logout
    return () => {
      socket.disconnect();
    };
  }, [loading, user]);

  // if user loading
  if (loading) {
    // show loader
    return (
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

  // if the visitor is an authenticated user & after the socket connection established successfully
  // let him/her go to the destination page
  return children;
};

export default RequireAuth;
