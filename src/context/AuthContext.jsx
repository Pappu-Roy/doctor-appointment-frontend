import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../services/auth.service";
import { setAccessToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Why this flag exists: on the very first render, we don't yet know if
  // the user is logged in (that requires an async call to /auth/refresh).
  // Without this flag, the app would briefly flash the "logged out" UI
  // even for someone who IS logged in, before the refresh call resolves.
  const [checkingSession, setCheckingSession] = useState(true);

  // Runs ONCE when the app first mounts (empty dependency array []).
  // This is the "silent login" described above: we ask the backend
  // "does my refresh cookie still work?" instead of assuming logged-out.
  useEffect(() => {
    async function trySilentLogin() {
      try {
        const result = await refreshAccessToken();
        setAccessToken(result.data.accessToken);
        setUser(result.data.user);
      } catch {
        // A failed refresh here just means "not logged in" — not a real
        // error, so we deliberately don't setError or log anything scary.
        setAccessToken(null);
        setUser(null);
      } finally {
        setCheckingSession(false);
      }
    }
    trySilentLogin();
  }, []);

  async function login(credentials) {
    const result = await loginUser(credentials);
    setAccessToken(result.data.accessToken);
    setUser(result.data.user);
  }

  async function register(payload) {
    await registerUser(payload);
    // Deliberately NOT auto-logging in after register. Keeping register
    // and login as two explicit, separate actions is simpler to reason
    // about and matches what most real apps do (confirm email, etc. could
    // slot in between the two later without restructuring this).
  }

  async function logout() {
    await logoutUser();
    setAccessToken(null);
    setUser(null);
  }

  const value = { user, checkingSession, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook so components do `const { user, login } = useAuth()` instead
// of importing useContext + AuthContext everywhere. The thrown error is a
// safety net — it catches the mistake of using useAuth() outside <AuthProvider>
// at development time instead of silently returning undefined.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}