import { createBrowserRouter } from "react-router-dom";
import SignIn from "../Pages/SignIn/SignIn/SignIn";
import SignUp from "../Pages/SignUp/SignUp/SignUp";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin",
    element: <SignIn />
  }
]);

export default router;
