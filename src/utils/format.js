// ---------- তারিখ/সময় (ব্রাউজারের local timezone অনুযায়ী) ----------
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("bn-BD", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("bn-BD", { hour: "numeric", minute: "2-digit" });

// "2026-10-05" — ⚠️ toISOString() ব্যবহার করিনি: ওটা UTC দেয়, রাত ১২টার পর BD তে আগের দিন দেখাত
export function toDateInputValue(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

// Backend এর error shape { message, errors:[{field,issue}] } থেকে সবচেয়ে কাজের বার্তাটা বের করে
export const errMsg = (err, fallback = "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করো।") =>
  err?.response?.data?.errors?.[0]?.issue || err?.response?.data?.message || fallback;

export const WEEKDAYS_BN = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];