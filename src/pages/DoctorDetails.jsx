import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Award, CalendarCheck, MapPin, Wallet } from "lucide-react";
import { getDoctorById } from "../services/doctor.service";
import { createAppointment } from "../services/appointment.service";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import SlotPicker from "../components/SlotPicker";
import { WEEKDAYS_BN, errMsg, formatDate, formatTime, initials } from "../utils/format";

export default function DoctorDetails() {
  const { id } = useParams(); // URL এর /doctors/:id থেকে id
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [slot, setSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getDoctorById(id)
      .then((d) => !ignore && setDoctor(d))
      .catch(() => !ignore && setNotFound(true))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleBook() {
    setBooking(true);
    try {
      await createAppointment({ doctorId: doctor.id, startTime: slot.startTime });
      toast.success("অ্যাপয়েন্টমেন্ট রিকোয়েস্ট পাঠানো হয়েছে! ডাক্তারের কনফার্মেশনের অপেক্ষায়।");
      navigate("/dashboard");
    } catch (err) {
      toast.error(errMsg(err));
      if (err.response?.status === 409) {
        // অন্য কেউ আগে নিয়ে ফেলেছে — slot তালিকা নতুন করে আনো
        setSlot(null);
        setRefreshKey((k) => k + 1);
      }
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-5">
        <div className="skeleton h-96 lg:col-span-3" />
        <div className="skeleton h-96 lg:col-span-2" />
      </div>
    );
  }

  if (notFound || !doctor) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">ডাক্তার পাওয়া যায়নি</h2>
        <p className="mt-2 text-muted">প্রোফাইলটি নেই অথবা এখনো অনুমোদিত হয়নি।</p>
        <Link to="/" className="btn-primary mt-6">তালিকায় ফিরে যাও</Link>
      </div>
    );
  }

  const name = doctor.user?.name || "";
  // সাপ্তাহিক সময়সূচি বার অনুযায়ী সাজানো
  const byDay = {};
  doctor.availability.forEach((a) => (byDay[a.dayOfWeek] ||= []).push(a));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft size={16} /> সব ডাক্তার
      </Link>

      <div className="grid items-start gap-6 lg:grid-cols-5">
        {/* ---------- বাম: প্রোফাইল ---------- */}
        <div className="space-y-6 lg:col-span-3">
          <section className="card p-6">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-brand to-accent text-2xl font-bold text-white shadow-glow">
                {initials(name)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">ডাঃ {name}</h1>
                <span className="chip mt-2">{doctor.specialty}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Award, label: "অভিজ্ঞতা", value: `${Number(doctor.experience).toLocaleString("bn-BD")} বছর` },
                { icon: MapPin, label: "অবস্থান", value: doctor.location || "—" },
                { icon: Wallet, label: "ফি", value: `৳ ${Number(doctor.fee).toLocaleString("bn-BD")}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-line bg-surface2/50 p-3.5">
                  <Icon size={17} className="text-brand" />
                  <p className="mt-2 text-xs text-muted">{label}</p>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>

            {doctor.bio && (
              <div className="mt-6">
                <h2 className="mb-2 text-sm font-semibold text-muted">পরিচিতি</h2>
                <p className="leading-relaxed">{doctor.bio}</p>
              </div>
            )}
          </section>

          <section className="card p-6">
            <h2 className="mb-4 font-semibold">সাপ্তাহিক সময়সূচি</h2>
            {Object.keys(byDay).length === 0 ? (
              <p className="text-sm text-muted">এখনো কোনো সময়সূচি দেওয়া হয়নি।</p>
            ) : (
              <ul className="divide-y divide-line">
                {[6, 0, 1, 2, 3, 4, 5].filter((d) => byDay[d]).map((d) => (
                  <li key={d} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium">{WEEKDAYS_BN[d]}</span>
                    <span className="text-muted">{byDay[d].map((a) => `${a.startTime} – ${a.endTime}`).join(", ")}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ---------- ডান: বুকিং ---------- */}
        <aside className="card p-6 lg:sticky lg:top-24 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <CalendarCheck size={18} className="text-brand" /> অ্যাপয়েন্টমেন্ট নাও
          </h2>

          <SlotPicker
            doctorId={doctor.id}
            availability={doctor.availability}
            selectedSlot={slot}
            onSelect={setSlot}
            refreshKey={refreshKey}
          />

          <div className="mt-5 border-t border-line pt-5">
            {slot && (
              <div className="mb-4 rounded-xl border border-brand/25 bg-brand/10 p-3 text-sm">
                <p className="font-semibold">{formatDate(slot.startTime)}</p>
                <p className="text-muted">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)} · ফি ৳ {Number(doctor.fee).toLocaleString("bn-BD")}
                </p>
              </div>
            )}

            {!user ? (
              <button className="btn-primary w-full" onClick={() => navigate("/auth", { state: { from: location.pathname } })}>
                লগইন করে বুক করো
              </button>
            ) : user.role !== "PATIENT" ? (
              <p className="rounded-xl bg-surface2/60 p-3 text-center text-sm text-muted">শুধু রোগীরা অ্যাপয়েন্টমেন্ট বুক করতে পারেন।</p>
            ) : (
              <button className="btn-primary w-full" disabled={!slot || booking} onClick={handleBook}>
                {booking ? "বুক হচ্ছে..." : slot ? "বুকিং নিশ্চিত করো" : "একটি স্লট বেছে নাও"}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}