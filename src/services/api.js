import axios from "axios";

// A single configured axios instance, reused by every page/component.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // sends the httpOnly refresh-token cookie automatically
});

// --- Where the access token actually lives ---
// This is a plain module-level variable, NOT React state. Why? Because
// axios interceptors run outside the React component tree — they have no
// access to useState/useContext. So we need a "bridge": AuthContext calls
// setAccessToken() whenever the token changes, and this interceptor reads
// the same variable on every outgoing request.
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

// --- REQUEST interceptor: attach the token to every outgoing call ---
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// --- RESPONSE interceptor: auto-refresh on an expired token ---
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest.url?.includes("/auth/");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/auth/refresh").finally(() => {
            refreshPromise = null;
          });
        }
        const refreshResponse = await refreshPromise;
        const newToken = refreshResponse.data.data.accessToken;
        setAccessToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;