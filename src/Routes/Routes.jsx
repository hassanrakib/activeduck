import { createBrowserRouter } from "react-router-dom";
import SignIn from "../Pages/SignIn/SignIn/SignIn";
import SignUp from "../Pages/SignUp/SignUp/SignUp";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Auth from "../Pages/Auth/Auth/Auth";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import Home from "../Pages/Home/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
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
