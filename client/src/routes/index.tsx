import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PrivateLayout } from "../components/layout";
import Login from "../pages/login";
import Register from "../pages/register";
import ForgotPassword from "../pages/forgotPwd";
import Chat from "../pages/chat";
import { Outlet } from "react-router-dom";

import ResetPassword from "../pages/resetPwd";
import { SharedPage } from "../pages/shared";
import { NotFoundPage } from "../pages/404";
import { ServerErrorPage } from "../pages/500";

const TestPages = () => {
  return (
    <div>
      <p>Google Pop Up</p>
    </div>
  );
};

const PublicLayout = () => {
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
      {
        path: "s/:sharedCode",
        element: <SharedPage />,
      },
      {
        path: "404",
        element: <NotFoundPage />,
      },
      {
        path: "500",
        element: <ServerErrorPage />,
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
