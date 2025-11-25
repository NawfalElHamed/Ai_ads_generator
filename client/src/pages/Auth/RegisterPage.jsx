// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerCustomer, fetchProfile } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const tokenFromStore = useSelector((state) => state.auth.token);

  useEffect(() => {
    const savedToken = tokenFromStore || localStorage.getItem("accessToken");
    if (savedToken) {
      navigate("/generator");
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
      await dispatch(fetchProfile());
      navigate("/generator");
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🔵 background glows */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -150,
            left: -80,
            width: 280,
            height: 280,
            background: "#00eaff",
            filter: "blur(130px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 120,
            right: -60,
            width: 260,
            height: 260,
            background: "#7b3cff",
            filter: "blur(130px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: "50%",
            transform: "translateX(-50%)",
            width: 340,
            height: 340,
            background: "#00ff9f",
            filter: "blur(160px)",
          }}
        />
      </div>

      {/* 🧊 outer gradient glass border */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: 480,
          padding: 2,
          borderRadius: 30,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(0,234,255,0.35), rgba(123,60,255,0.35))",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(0,234,255,0.35)",
          position: "relative",
        }}
      >
        {/* Inner glass card */}
        <div
          style={{
            borderRadius: 26,
            padding: "32px 36px",
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.85), rgba(15,23,42,0.75))",
            border: "1px solid rgba(255,255,255,0.16)",
            backdropFilter: "blur(26px)",
            WebkitBackdropFilter: "blur(26px)",
            overflow: "hidden",
            color: "#f9fafb",
            position: "relative",
          }}
        >
          {/* extra transparent glow */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -40,
              width: 140,
              height: 140,
              background: "rgba(0,234,255,0.20)",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -80,
              left: -40,
              width: 140,
              height: 140,
              background: "rgba(123,60,255,0.25)",
              filter: "blur(80px)",
            }}
          />

          {/* subtle white highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)",
              opacity: 0.7,
            }}
          />

          {/* Header */}
          <div
            style={{
              marginBottom: 24,
              textAlign: "center",
              position: "relative",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                margin: 0,
              }}
            >
              Create your account
            </h2>
            <p
              style={{
                marginTop: 8,
                fontSize: 14,
                color: "#cbd5f5",
              }}
            >
              Start generating AI-powered campaigns.
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
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {["first_name", "last_name", "email", "password"].map((field) => (
              <div key={field}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 14,
                    textAlign: "left",
                    fontWeight: 500,
                  }}
                >
                  {field === "first_name"
                    ? "First name"
                    : field === "last_name"
                    ? "Last name"
                    : field === "email"
                    ? "Email"
                    : "Password"}
                </label>

                {/* Glass Input Wrapper */}
                <div
                  style={{
                    position: "relative",
                    borderRadius: 999,
                    padding: 1,
                    background:
                      "linear-gradient(135deg, rgba(148,163,184,0.55), rgba(15,23,42,0.7))",
                  }}
                >
                  <input
                    type={field === "password" ? "password" : "text"}
                    placeholder={
                      field === "email"
                        ? "you@example.com"
                        : field === "first_name"
                        ? "John"
                        : field === "last_name"
                        ? "Doe"
                        : "••••••••"
                    }
                    required
                    value={form[field]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "10px 13px",
                      borderRadius: 999,
                      border: "none",
                      background:
                        "radial-gradient(circle at top, rgba(15,23,42,0.92), rgba(15,23,42,0.75))",
                      color: "#e5e7eb",
                      fontSize: 13,
                      outline: "none",
                      boxShadow:
                        "inset 0 0 0 1px rgba(15,23,42,0.85), 0 12px 25px rgba(15,23,42,0.9)",
                    }}
                  />

                  {/* input highlight */}
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: 18,
                      right: "35%",
                      height: 1,
                      background:
                        "linear-gradient(to right, rgba(255,255,255,0.24), transparent)",
                      opacity: 0.7,
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: status === "loading" ? 1 : 1.01 }}
              whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
              disabled={status === "loading"}
              type="submit"
              style={{
                marginTop: 10,
                width: "100%",
                padding: "12px 14px",
                borderRadius: 9999,
                border: "none",
                background:
                  "linear-gradient(135deg,#4adeff,#00e5ff 55%,#00b7ff)",
                color: "#020617",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow:
                  "0 2px 5px rgba(34,211,238,0.7), 0 0 26px rgba(34,211,238,1)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                opacity: status === "loading" ? 0.45 : 1,
              }}
            >
              {status === "loading" ? "Creating account..." : "Sign up"}
            </motion.button>
          </form>

          {/* Bottom Link */}
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
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
        </div>
      </motion.div>
    </div>
  );
}
