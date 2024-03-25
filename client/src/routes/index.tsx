import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "../components/layout";
import Login from "../pages/login";
import Register from "../pages/register";
import ForgotPassword from "../pages/forgotPwd";
import Chat from "../pages/chat";
import ResetPassword from "../pages/resetPws";

// puiblic (login/register)
// private routes
const router = createBrowserRouter([
  {
    path: "",
    element: <DefaultLayout />,
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
  {
    path: "",
    // errorElement:
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
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
