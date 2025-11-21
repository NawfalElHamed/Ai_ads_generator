// src/utils/index.js (or whatever path)
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Base64url safe decoder
const decodeJWT = (token) => {
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const checkTokenIsExpired = (token) => {
  if (!token) return true;

  const payload = token.split(".")[1];
  const decoded = decodeJWT(payload);
  if (!decoded?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
};
