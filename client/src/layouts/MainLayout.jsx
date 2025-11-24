// src/layouts/MainLayout.jsx
import React from "react";

import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col text-white">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
