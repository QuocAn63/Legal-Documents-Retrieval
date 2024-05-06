import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { PrivateLayout } from "../components/layout";
import Login from "../pages/login";
import Register from "../pages/register";
import ForgotPassword from "../pages/forgotPwd";
import Chat from "../pages/chat";
import { Outlet } from "react-router-dom";

import ResetPassword from "../pages/resetPws";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";

// puiblic (login/register)
// private routes

const TestPages = () => {
  return (
    <div>
      <p>Google Pop Up</p>
    </div>
  );
};

const PublicLayout = () => {
  const userToken = useSelector((state: RootState) => state.user.user?.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      navigate("/");
    }
  }, [navigate, userToken]);

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "",
    // errorElement:
    element: <PublicLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgotpwd",
        element: <ForgotPassword />,
      },
      {
        path: "resetpwd",
        element: <ResetPassword />,
      },
      {
        path: "login/google",
        element: <TestPages />,
      },
    ],
  },
  {
    path: "",
    element: <PrivateLayout />,
    // errorElement:
    children: [
      {
        index: true,
        element: <Chat isMain />,
      },
      {
        path: "c/:conversationID",
        element: <Chat />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
