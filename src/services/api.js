import axios from "axios";

// A single configured axios instance, reused by every page/component.
// If we later need to attach the JWT access token to every request
// (Day 3+, once booking needs login), we do it in ONE place here —
// not in every fetch call scattered across the app.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // sends the httpOnly refresh-token cookie when needed
});

export default api;