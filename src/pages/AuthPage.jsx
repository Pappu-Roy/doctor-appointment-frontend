import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage({ onAuthSuccess }) {
  // "mode" here is just UI state — which form to show. Not routing,
  // because we haven't added React Router yet (that comes when the app
  // has enough pages to need real URLs — Day 5 territory). For now,
  // toggling a local state variable is the simplest thing that works.
  const [mode, setMode] = useState("login"); // "login" | "register"

  return (
    <div className="auth-page">
      {mode === "login" ? (
        <LoginForm onSuccess={onAuthSuccess} onSwitchToRegister={() => setMode("register")} />
      ) : (
        <RegisterForm
          onSuccess={() => setMode("login")} // after successful register, drop them into the login form
          onSwitchToLogin={() => setMode("login")}
        />
      )}
    </div>
  );
}