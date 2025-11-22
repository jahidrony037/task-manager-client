import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./context/AuthContext/AuthProvider";
import "./index.css";
import { router } from "./router/router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className=" mx-auto">
      <AuthProvider>
        <RouterProvider router={router}> </RouterProvider>
        <ToastContainer />
      </AuthProvider>
    </div>
  </StrictMode>
);
