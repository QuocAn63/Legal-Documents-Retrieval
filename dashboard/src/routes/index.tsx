import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { BotsPage, LoginPage, MainPage } from "../pages";
import DefaultLayout from "../components/layout";
import { UsersPage } from "../pages/users";
import { ReportsPage } from "../pages/reports";
import { DocumentPage } from "../pages/documents";

const router = createBrowserRouter([
  {
    path: "",
    // errorElement:
    element: <DefaultLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "",
    element: <DefaultLayout />,
    // errorElement:
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/bots",
        element: <BotsPage />,
      },
      {
        path: "/users",
        element: <UsersPage />,
      },
      {
        path: "/reports",
        element: <ReportsPage />,
      },
      {
        path: "/documents",
        element: <DocumentPage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
