import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const initialForm = { name: "", email: "", password: "", phone: "", role: "PATIENT" };

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { register } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      onSuccess?.();
    } catch (err) {
      // errors[0] is the first Zod validation issue from the backend, e.g.
      // "Password must be at least 8 characters" — showing the specific
      // field-level message is more useful than a generic "Validation failed".
      const backendErrors = err.response?.data?.errors;
      const message =
        backendErrors?.[0]?.issue || err.response?.data?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>নতুন অ্যাকাউন্ট</h2>

      {error && <p className="error-text">{error}</p>}

      <label>
        নাম
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        ইমেইল
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>

      <label>
        পাসওয়ার্ড
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          required
        />
      </label>

      <label>
        ফোন (ঐচ্ছিক)
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
      </label>

      <label>
        আমি একজন
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="PATIENT">রোগী (Patient)</option>
          <option value="DOCTOR">ডাক্তার (Doctor)</option>
        </select>
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "তৈরি হচ্ছে..." : "রেজিস্ট্রেশন করো"}
      </button>

      <p className="auth-switch">
        অ্যাকাউন্ট আছে?{" "}
        <button type="button" className="link-button" onClick={onSwitchToLogin}>
          লগইন করো
        </button>
      </p>
    </form>
  );
}