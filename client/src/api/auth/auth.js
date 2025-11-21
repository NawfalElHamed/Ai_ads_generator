// src/api/auth.js
import api from "../client";

// POST /users/login
export const loginApi = (credentials) =>
  api.post("/users/login", credentials);

// POST /users/customer  (register)
export const registerCustomerApi = (data) =>
  api.post("/users/register", data);

// GET /users/profile (needs Authorization header)
export const getProfileApi = () =>
  api.get("/users/profile");

// Optional: verify account if you use it
export const verifyCustomerApi = (token) =>
  api.post(`/users/verify?token=${token}`);
