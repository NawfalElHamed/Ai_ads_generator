// src/router.jsx
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./helpers/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

const withSuspense = (Element) => (
  <Suspense fallback={<div>Loading...</div>}>{Element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(<LoginPage />),
  },
  {
    path: "/register",
    element: withSuspense(<RegisterPage />),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        // 🔥 all authenticated pages wrapped with MainLayout (logo + header)
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: withSuspense(<DashboardPage />),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(<LoginPage />),
  },
]);

export default router;
