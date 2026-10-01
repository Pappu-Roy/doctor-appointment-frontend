import { useState } from "react";
import { Stethoscope, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { errMsg } from "../utils/format";
import PasswordInput from "./PasswordInput";

const ROLES = [
  { value: "PATIENT", label: "রোগী", icon: User },
  { value: "DOCTOR", label: "ডাক্তার", icon: Stethoscope },
];

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "PATIENT" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register({ ...form, phone: form.phone || undefined });
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন লগইন করো।");
      onSuccess?.();
    } catch (err) {
      toast.error(errMsg(err, "রেজিস্ট্রেশন ব্যর্থ হয়েছে।"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">নতুন অ্যাকাউন্ট</h2>
        <p className="mt-1 text-sm text-muted">কয়েক সেকেন্ডেই শুরু করো</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ROLES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setForm((p) => ({ ...p, role: value }))}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
              form.role === value ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:text-fg"
            }`}
          >
            <Icon size={17} /> {label}
          </button>
        ))}
      </div>

      <div>
        <label className="label">নাম</label>
        <input className="input" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="label">ইমেইল</label>
        <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label className="label">পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)</label>
        <PasswordInput name="password" value={form.password} onChange={handleChange} minLength={8} required />
      </div>
      <div>
        <label className="label">ফোন (ঐচ্ছিক)</label>
        <input className="input" type="tel" name="phone" value={form.phone} onChange={handleChange} />
      </div>

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? "তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করো"}
      </button>
      <p className="text-center text-sm text-muted">
        অ্যাকাউন্ট আছে?{" "}
        <button type="button" onClick={onSwitchToLogin} className="font-semibold text-brand hover:underline">
          লগইন করো
        </button>
      </p>
    </form>
  );
}