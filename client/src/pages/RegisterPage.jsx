import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerCustomer, fetchProfile } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const first_name = e.target.first_name.value;
    const last_name = e.target.last_name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const resultAction = await dispatch(
      registerCustomer({ first_name, last_name, email, password })
    );

    if (registerCustomer.fulfilled.match(resultAction)) {
      await dispatch(fetchProfile());
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>

      {status === "loading" && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 300 }}>
        <input name="first_name" placeholder="First name" required />
        <input name="last_name" placeholder="Last name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: 10 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
