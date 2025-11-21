import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, logout } from "../features/auth/authSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && token) {
      dispatch(fetchProfile());
    }
  }, [user, token, dispatch]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard (Protected)</h2>
      <button onClick={() => dispatch(logout())}>Logout</button>

      <h3 style={{ marginTop: 16 }}>User from Redux:</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage;
