import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../services/auth.service";
import { setAccessToken } from "../services/api";

const AuthContext = createContext(null);

// ⚠️ FIX: React.StrictMode dev এ useEffect দুইবার চালায় → দুটো /auth/refresh একসাথে যেত।
// Refresh token rotation থাকায় দ্বিতীয়টা ব্যর্থ হয়ে user কে logout করে দিতে পারত।
// তাই একটাই promise বানিয়ে দুইবারেই সেটা ভাগ করে নিচ্ছি।
let sessionPromise = null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!sessionPromise) sessionPromise = refreshAccessToken();

    sessionPromise
      .then((result) => {
        setAccessToken(result.data.accessToken);
        setUser(result.data.user);
      })
      .catch(() => {
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  async function login(credentials) {
    const result = await loginUser(credentials);
    setAccessToken(result.data.accessToken);
    setUser(result.data.user);
  }

  async function register(payload) {
    await registerUser(payload);
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      setAccessToken(null);
      setUser(null);
      sessionPromise = null; // পরে আবার login/refresh করলে যেন নতুন করে চেক হয়
    }
  }

  return (
    <AuthContext.Provider value={{ user, checkingSession, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}