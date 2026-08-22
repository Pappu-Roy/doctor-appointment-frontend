import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginForm({ onSuccess, onSwitchToRegister }) {
  const { login } = useAuth();

  // One state object instead of separate useState for email/password —
  // fine for 2 fields; if this grew to 6+ fields, a form library
  // (react-hook-form) would be worth it instead of hand-rolling this.
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser's default full-page-reload form submit
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      onSuccess?.();
    } catch (err) {
      // The backend deliberately returns the SAME message for "wrong email"
      // and "wrong password" (see auth.service.js on the backend) — it
      // never reveals which one was wrong, so we just show it as-is.
      setError(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>লগইন করো</h2>

      {error && <p className="error-text">{error}</p>}

      <label>
        ইমেইল
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        পাসওয়ার্ড
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "লগইন হচ্ছে..." : "লগইন"}
      </button>

      <p className="auth-switch">
        অ্যাকাউন্ট নেই?{" "}
        <button type="button" className="link-button" onClick={onSwitchToRegister}>
          রেজিস্ট্রেশন করো
        </button>
      </p>
    </form>
  );
}