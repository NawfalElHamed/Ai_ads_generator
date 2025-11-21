import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchProfile } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const resultAction = await dispatch(login({ email, password }));

    if (login.fulfilled.match(resultAction)) {
      await dispatch(fetchProfile());
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      {status === "loading" && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 300 }}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      {token && (
        <p style={{ marginTop: 8 }}>
          ✅ Logged in (token in Redux/localStorage)
        </p>
      )}

      <p style={{ marginTop: 10 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
