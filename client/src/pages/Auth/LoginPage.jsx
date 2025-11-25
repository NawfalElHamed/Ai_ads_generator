import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchProfile } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const tokenFromStore = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedToken = tokenFromStore || localStorage.getItem("accessToken");
    if (savedToken) {
      navigate("/generator");
    }
  }, [tokenFromStore, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(form));

    if (login.fulfilled.match(resultAction)) {
      await dispatch(fetchProfile());

      const token = resultAction.payload?.token;
      if (token) {
        if (rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
      }

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
      {/* 🔵 background gradient is already on body, this adds soft glows */}
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
            top: -160,
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

      {/* 🧊 outer gradient border wrapper (perfect glass frame) */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 430,
          padding: 2,
          borderRadius: 30,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(0, 234, 255, 0.35), rgba(123,60,255,0.4))",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(0, 234, 255, 0.4)",
        }}
      >
        {/* inner true glass card */}
        <div
          style={{
            position: "relative",
            borderRadius: 26,
            padding: "30px 34px 26px",
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.92), rgba(15,23,42,0.82))",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            backdropFilter: "blur(26px)",
            WebkitBackdropFilter: "blur(26px)",
            overflow: "hidden",
            color: "#f9fafb",
          }}
        >
          {/* soft inner glows */}
          <div
            style={{
              position: "absolute",
              top: -90,
              right: -40,
              width: 160,
              height: 160,
              background: "rgba(0, 234, 255, 0.22)",
              filter: "blur(70px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -90,
              left: -40,
              width: 160,
              height: 160,
              background: "rgba(123, 60, 255, 0.3)",
              filter: "blur(70px)",
              pointerEvents: "none",
            }}
          />

          {/* subtle top highlight strip */}
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

          {/* header / badge */}
          <div
            style={{
              marginBottom: 24,
              textAlign: "center",
              position: "relative",
              // zIndex: 1,
              border: 0,
            }}
          >
            <div>
              <Box
                component="img"
                src="/Logo-Auth.png"
                alt="Logo"
                sx={{ height: 100, width: 100, mr: 1 }}
              />
            </div>

            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                margin: 0,
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                marginTop: 8,
                fontSize: 14,
                color: "#cbd5f5",
              }}
            >
              Sign in to access your AI-powered campaigns.
            </p>
          </div>

          {/* error */}
          {error && (
            <p
              style={{
                color: "#fca5a5",
                fontSize: 14,
                marginBottom: 12,
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              {error}
            </p>
          )}

          {/* form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* email */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Email
              </label>
              <div
                style={{
                  position: "relative",
                  borderRadius: 999,
                  padding: 1,
                  background:
                    "linear-gradient(135deg, rgba(148,163,184,0.55), rgba(15,23,42,0.8))",
                }}
              >
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
                    padding: "10px 13px",
                    borderRadius: 999,
                    border: "none",
                    background:
                      "radial-gradient(circle at top, rgba(15,23,42,0.98), rgba(15,23,42,0.9))",
                    color: "#e5e7eb",
                    fontSize: 13,
                    outline: "none",
                    boxShadow:
                      "inset 0 0 0 1px rgba(15,23,42,0.9), 0 12px 30px rgba(15,23,42,0.95)",
                  }}
                />
                {/* light sheen */}
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: 18,
                    right: "30%",
                    height: 1,
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0.25), transparent)",
                    opacity: 0.7,
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Password
              </label>
              <div
                style={{
                  position: "relative",
                  borderRadius: 999,
                  padding: 1,
                  background:
                    "linear-gradient(135deg, rgba(148,163,184,0.55), rgba(15,23,42,0.8))",
                }}
              >
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
                    padding: "10px 13px",
                    borderRadius: 999,
                    border: "none",
                    background:
                      "radial-gradient(circle at top, rgba(15,23,42,0.98), rgba(15,23,42,0.9))",
                    color: "#e5e7eb",
                    fontSize: 13,
                    outline: "none",
                    boxShadow:
                      "inset 0 0 0 1px rgba(15,23,42,0.9), 0 12px 30px rgba(15,23,42,0.95)",
                  }}
                />
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

            {/* remember / forgot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 2,
                fontSize: 13,
                color: "#cbd5f5",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  color: rememberMe ? "#7dd3fc" : "#cbd5f5",
                }}
                onClick={() => setRememberMe((prev) => !prev)}
              >
                {/* custom glass switch */}
                <div
                  style={{
                    width: 32,
                    height: 18,
                    borderRadius: 999,
                    padding: 2,
                    background: rememberMe
                      ? "linear-gradient(135deg,#22d3ee,#0ea5e9)"
                      : "rgba(15,23,42,0.9)",
                    border: "1px solid rgba(148,163,184,0.7)",
                    boxShadow: rememberMe
                      ? "0 0 12px rgba(34,211,238,0.9)"
                      : "inset 0 0 8px rgba(15,23,42,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: rememberMe ? "flex-end" : "flex-start",
                    transition: "all 0.18s ease-out",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "999px",
                      background: "#020617",
                    }}
                  />
                </div>
                <span>Remember me</span>
              </label>

              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#7dd3fc",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 13,
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* submit */}
            <motion.button
              whileHover={{ scale: status === "loading" ? 1 : 1.01 }}
              whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
              type="submit"
              disabled={status === "loading"}
              style={{
                marginTop: 18,
                width: "100%",
                padding: "12px 14px",
                borderRadius: 9999,
                border: "none",
                background:
                  "linear-gradient(135deg,#4adeff,#00e5ff 55%,#00b7ff)",
                color: "#020617",
                fontSize: 15,
                fontWeight: 600,
                cursor: status === "loading" ? "default" : "pointer",
                boxShadow:
                  "0 2px 5px rgba(34,211,238,0.7), 0 0 26px rgba(34,211,238,1)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                opacity: status === "loading" ? 0.45 : 1,
              }}
            >
              {status === "loading" ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* bottom link */}
          <p
            style={{
              marginTop: 18,
              fontSize: 14,
              textAlign: "center",
              color: "#cbd5f5",
              position: "relative",
              zIndex: 1,
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
        </div>
      </motion.div>
    </div>
  );
}
