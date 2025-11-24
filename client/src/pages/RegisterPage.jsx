// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerCustomer, fetchProfile } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const tokenFromStore = useSelector((state) => state.auth.token);

  // if already logged in, don't show signup
  useEffect(() => {
    const savedToken = tokenFromStore || localStorage.getItem("accessToken");
    if (savedToken) {
      navigate("/dashboard");
    }
  }, [tokenFromStore, navigate]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(registerCustomer(form));

    if (registerCustomer.fulfilled.match(resultAction)) {
      // we got a token from the backend in the thunk
      await dispatch(fetchProfile());
      navigate("/dashboard");
    }
  };

  return (
    <div
      style={{
        minHeight: "95vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        style={{
          width: "100%",
          maxWidth: 460,
          padding: "32px 36px",
          borderRadius: 28,
          background:
            "radial-gradient(circle at top left, rgba(255, 255, 255, 0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(180, 0, 255, 0.25), transparent 60%), rgba(7, 10, 26, 0.92)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.9), 0 0 80px rgba(0, 255, 242, 0.2)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          color: "#f9fafb",
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Create your account
          </h2>
          <p
            style={{
              marginTop: 8,
              fontSize: 16,
              color: "#cbd5f5",
            }}
          >
            Sign up to start generating AI-powered campaigns.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p
            style={{
              color: "#fca5a5",
              fontSize: 15,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* First name */}
          <div>
            <label
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              First name
            </label>
            <input
              type="text"
              placeholder="John"
              required
              value={form.first_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, first_name: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "11px 13px",
                borderRadius: 9999,
                border: "1px solid rgba(148, 163, 184, 0.6)",
                background: "rgba(3, 7, 18, 0.9)",
                color: "#e5e7eb",
                fontSize: 13,
                outline: "none",
                boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.8)",
              }}
            />
          </div>

          {/* Last name */}
          <div>
            <label
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Last name
            </label>
            <input
              type="text"
              placeholder="Doe"
              required
              value={form.last_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, last_name: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "11px 13px",
                borderRadius: 9999,
                border: "1px solid rgba(148, 163, 184, 0.6)",
                background: "rgba(3, 7, 18, 0.9)",
                color: "#e5e7eb",
                fontSize: 13,
                outline: "none",
                boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.8)",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "11px 13px",
                borderRadius: 9999,
                border: "1px solid rgba(148, 163, 184, 0.6)",
                background: "rgba(3, 7, 18, 0.9)",
                color: "#e5e7eb",
                fontSize: 15,
                outline: "none",
                boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.8)",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "11px 13px",
                borderRadius: 9999,
                border: "1px solid rgba(148, 163, 184, 0.6)",
                background: "rgba(3, 7, 18, 0.9)",
                color: "#e5e7eb",
                fontSize: 13,
                outline: "none",
                boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.8)",
              }}
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: status === "loading" ? 1 : 1.01 }}
            whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
            type="submit"
            disabled={status === "loading"}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 9999,
              border: "none",
              background:
                "radial-gradient(circle at top, #4adeff, #00e5ff 60%, #00b7ff 100%)",
              color: "#020617",
              fontSize: 15,
              fontWeight: 600,
              cursor: status === "loading" ? "default" : "pointer",
              boxShadow:
                "0 4px 4px rgba(34, 211, 238, 0.6), 0 0 10px rgba(34, 211, 238, 0.9)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              opacity: status === "loading" ? 0.4 : 1,
            }}
          >
            {status === "loading" ? "Creating account..." : "Sign up"}
          </motion.button>
        </form>

        {/* Bottom link */}
        <p
          style={{
            marginTop: 18,
            fontSize: 16,
            textAlign: "center",
            color: "#cbd5f5",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#7dd3fc", textDecoration: "none" }}
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
