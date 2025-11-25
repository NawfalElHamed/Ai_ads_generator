// src/router.jsx
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./helpers/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";

const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const GeneratorPage = lazy(() => import("./pages/Generator/Generator"));

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
            path: "/generator",
            element: withSuspense(<GeneratorPage />),
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
