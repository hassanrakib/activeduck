import { createBrowserRouter } from "react-router-dom";
import Signup from "../Pages/SignUp/SignUp/SignUp";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />,
  },
]);

export default router;
