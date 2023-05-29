import { createBrowserRouter } from "react-router-dom";
import SignIn from "../Pages/SignIn/SignIn/SignIn";
import SignUp from "../Pages/SignUp/SignUp/SignUp";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Auth from "../Pages/Auth/Auth/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Auth />
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "signin",
        element: <SignIn />
      }
    ]
  }
]);

export default router;
