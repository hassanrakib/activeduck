import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../Pages/Shared/Loader/Loader";
import { socket } from "../socket";

const RequireAuth = ({ children }) => {
  // get the current authenticated user from the context
  const { user, loading } = useAuth();

  // get the current location
  const location = useLocation();

  if (loading) {
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

  //   if the visitor is not authenticated the user variable is null
  if (!user) {
    // Redirect user to the /auth page
    // but, save the current location
    // after sign in, drop the visitor to page where he/she was trying to go
    // using the saved location

    // send the location to the /auth page using the state prop
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // connect to the socket server as we are sure that user successfully signed in
  // and the token in localStorage exists
  socket.connect();

  //   if the visitor is an authenticated user, let him/her go to the destination page
  return children;
};

export default RequireAuth;
