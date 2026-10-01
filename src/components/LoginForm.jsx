import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { errMsg } from "../utils/format";
import PasswordInput from "./PasswordInput";

export default function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      // সফল হলে AuthContext এর user বদলায় → AuthPage নিজেই redirect করে
    } catch (err) {
      toast.error(errMsg(err, "লগইন ব্যর্থ হয়েছে।"));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">আবার স্বাগতম 👋</h2>
        <p className="mt-1 text-sm text-muted">তোমার অ্যাকাউন্টে লগইন করো</p>
      </div>
      <div>
        <label className="label">ইমেইল</label>
        <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
      </div>
      <div>
        <label className="label">পাসওয়ার্ড</label>
        <PasswordInput name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? "লগইন হচ্ছে..." : "লগইন"}
      </button>
      <p className="text-center text-sm text-muted">
        অ্যাকাউন্ট নেই?{" "}
        <button type="button" onClick={onSwitchToRegister} className="font-semibold text-brand hover:underline">
          রেজিস্ট্রেশন করো
        </button>
      </p>
    </form>
  );
}