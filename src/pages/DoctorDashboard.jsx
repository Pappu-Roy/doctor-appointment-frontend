import { useEffect, useState } from "react";
import { AlertTriangle, CalendarClock, UserCog } from "lucide-react";
import { getMyDoctorProfile } from "../services/doctor.service";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../utils/format";
import AppointmentsPanel from "../components/AppointmentsPanel";
import ProfileEditor from "../components/doctor/ProfileEditor";
import ScheduleEditor from "../components/doctor/ScheduleEditor";

const TABS = [
  { key: "appointments", label: "অ্যাপয়েন্টমেন্ট", icon: CalendarClock },
  { key: "profile", label: "প্রোফাইল ও সময়সূচি", icon: UserCog },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("appointments");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyDoctorProfile().then(setProfile).catch((err) => setError(errMsg(err)));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">ডাঃ <span className="gradient-text">{user.name}</span></h1>
      <p className="mb-6 mt-1 text-muted">রোগীর রিকোয়েস্ট ও নিজের সময়সূচি এখান থেকে সামলাও।</p>

      {profile && !profile.isVerified && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <p>
            তোমার প্রোফাইল এখনো <b>অ্যাডমিন অনুমোদনের অপেক্ষায়</b>। অনুমোদন না হওয়া পর্যন্ত রোগীরা তোমাকে খুঁজে পাবে না।
            এর মধ্যে প্রোফাইল ও সময়সূচি সাজিয়ে রাখো।
          </p>
        </div>
      )}
      {error && <p className="mb-6 rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

      <div className="mb-6 inline-flex rounded-2xl border border-line bg-surface2/50 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              tab === key ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === "appointments" && <AppointmentsPanel perspective="doctor" defaultTab="PENDING" />}

      {tab === "profile" && (profile ? (
        <div className="space-y-6">
          <ProfileEditor profile={profile} onSaved={setProfile} />
          <ScheduleEditor profile={profile} onSaved={setProfile} />
        </div>
      ) : (
        !error && <div className="skeleton h-72" />
      ))}
    </div>
  );
}