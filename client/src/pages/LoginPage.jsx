import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchProfile } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false); // 👈 new state
  const tokenFromStore = useSelector((state) => state.auth.token);

  useEffect(() => {
    const savedToken = tokenFromStore || localStorage.getItem("accessToken");

    if (savedToken) {
      navigate("/dashboard");
    }
  }, [tokenFromStore, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(form));

    if (login.fulfilled.match(resultAction)) {
      await dispatch(fetchProfile());

      // 👉 get the token from the login result (adapt to your authSlice)
      const token = resultAction.payload?.token;

      if (token) {
        if (rememberMe) {
          // keep it even after browser is closed
          localStorage.setItem("token", token);
        } else {
          // only for this tab/session
          sessionStorage.setItem("token", token);
        }
      }

      navigate("/dashboard");
    }
  };

  const checkboxLabel = { inputProps: { "aria-label": "Remember me" } };

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
          maxWidth: 420,
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
            Welcome back
          </h2>
          <p
            style={{
              marginTop: 8,
              fontSize: 15,
              color: "#cbd5f5",
            }}
          >
            Sign in to access your saved campaigns and presets.
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
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Email */}
          <div>
            <label
              style={{
                marginBottom: 18,
                fontSize: 15,
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
                fontSize: 13,
                outline: "none",
                boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.8)",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                marginBottom: 18,
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

          {/* Remember / Forgot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 2,
              fontSize: 14,
              color: "#cbd5f5",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
                color: rememberMe ? "#7dd3fc" : "#cbd5f5",
              }}
              onClick={() => setRememberMe((prev) => !prev)} // 👈 toggle manually
            >
              <span >Remember me</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
                color: "#7dd3fc",
              }}
              // onClick={() => setRememberMe((prev) => !prev)} // 👈 toggle manually
            >
              <span>Forgot password?</span>
            </label>
            {/* <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#7dd3fc",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Forgot password?
            </button> */}
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
            {status === "loading" ? "Logging in..." : "Login"}
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
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#7dd3fc", textDecoration: "none" }}
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
