import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthProvider from "./context/authContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProfileProvider from "./context/ProfileContext";
import Profile from "./pages/Profile";
import Listing from "./pages/Listing";
import Application from "./pages/Application";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // guests: all listing //host: all application
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />, // Create your profile (name, about me, ...)
  },
  {
    path: "/listing",
    element: <Listing />, // Add a new listing
  },
  {
    path: "/apply/:id",
    element: <Application />, // Add a new listing
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </AuthProvider>
  </React.StrictMode>
);
