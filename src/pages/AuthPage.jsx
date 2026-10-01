import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CalendarCheck, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const FEATURES = [
  { icon: CalendarCheck, text: "কয়েক ক্লিকেই অ্যাপয়েন্টমেন্ট বুক" },
  { icon: Zap, text: "রিয়েল-টাইম ফাঁকা স্লট, ডাবল বুকিং নেই" },
  { icon: ShieldCheck, text: "নিরাপদ লগইন ও ব্যক্তিগত তথ্য সুরক্ষা" },
];

export default function AuthPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState("login");

  // লগইন হয়ে গেলে (বা আগে থেকেই লগইন থাকলে) যেখান থেকে এসেছিল সেখানে ফেরত পাঠাও
  if (user) return <Navigate to={location.state?.from || "/dashboard"} replace />;

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
      <div className="hidden lg:block">
        <span className="chip">স্মার্ট হেলথকেয়ার বুকিং</span>
        <h1 className="mt-5 text-5xl font-bold leading-tight">
          সঠিক ডাক্তার, <br />
          <span className="gradient-text">সঠিক সময়ে।</span>
        </h1>
        <p className="mt-5 max-w-md text-muted">
          বিশেষজ্ঞ ডাক্তার খুঁজুন, ফাঁকা সময় দেখুন আর মুহূর্তেই অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।
        </p>
        <ul className="mt-8 space-y-4">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                <Icon size={18} />
              </span>
              <span className="text-sm font-medium">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
        {mode === "login" ? (
          <LoginForm onSwitchToRegister={() => setMode("register")} />
        ) : (
          <RegisterForm onSuccess={() => setMode("login")} onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}