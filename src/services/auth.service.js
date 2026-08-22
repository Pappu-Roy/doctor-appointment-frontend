import api from "./api";

// Each function here maps 1:1 to a backend route. Kept dumb on purpose —
// no state, no side effects beyond the HTTP call. AuthContext.jsx is where
// we decide WHAT to do with the response (store the token, update user, etc).

export async function registerUser({ name, email, password, phone, role }) {
  const res = await api.post("/auth/register", { name, email, password, phone, role });
  return res.data; // { success, message, data: { user } }
}

export async function loginUser({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { success, message, data: { user, accessToken } }
}

// No body needed — the httpOnly refresh cookie is sent automatically by
// the browser because api.js has withCredentials: true.
export async function refreshAccessToken() {
  const res = await api.post("/auth/refresh");
  return res.data; // { success, message, data: { user, accessToken } }
}

export async function logoutUser() {
  const res = await api.post("/auth/logout");
  return res.data;
}