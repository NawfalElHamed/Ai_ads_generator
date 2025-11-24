// src/routes/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const tokenFromStore = useSelector((state) => state.auth.token);

  // If Redux doesn't have a token yet, try to get it from localStorage
  const savedToken = tokenFromStore || localStorage.getItem("accessToken");

  if (!savedToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
