import { createBrowserRouter } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import RootLayout from "../layouts/RootLayout";
import ForgotPassword from "../pages/Authentication/ForgotPassword/ForgotPassword";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Home from "../pages/Home/Home/Home";
import Projects from "../pages/Projects/Projects";
import Tasks from "../pages/Tasks/Tasks";
import Teams from "../pages/Teams/Teams";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "teams",
        Component: Teams,
      },
      {
        path: "tasks",
        Component: Tasks,
      },
      {
        path: "projects",
        Component: Projects,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "forgot-password",
        Component: ForgotPassword,
      },
    ],
  },
]);
