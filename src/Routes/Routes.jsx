import { createBrowserRouter } from "react-router-dom";
import Signup from "../Pages/SignUp/SignUp/SignUp";
import SignIn from "../Pages/SignIn/SignIn/SignIn";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <SignIn />
  }
]);

export default router;
