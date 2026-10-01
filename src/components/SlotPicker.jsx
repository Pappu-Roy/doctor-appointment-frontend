import { useEffect, useMemo, useState } from "react";
import { CalendarOff } from "lucide-react";
import { getDoctorSlots } from "../services/doctor.service";
import { errMsg, formatTime, toDateInputValue } from "../utils/format";
import Spinner from "./Spinner";

const DAYS_AHEAD = 14;
const WD_SHORT = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];

/**
 * Props:
 *  doctorId, availability  — ডাক্তারের সাপ্তাহিক সময়সূচি (কোন কোন বার কাজ করেন)
 *  selectedSlot, onSelect  — নির্বাচিত slot (parent এর state)
 *  refreshKey              — বদলালে slot আবার আনে (যেমন 409 Conflict এর পর)
 */
export default function SlotPicker({ doctorId, availability = [], selectedSlot, onSelect, refreshKey = 0 }) {
  const workingDays = useMemo(() => new Set(availability.map((a) => a.dayOfWeek)), [availability]);

  // আজ থেকে ১৪ দিন। ডাক্তার যেদিন বসেন না সেদিন disabled।
  const days = useMemo(
    () =>
      Array.from({ length: DAYS_AHEAD }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return { key: toDateInputValue(d), date: d, today: i === 0, works: workingDays.has(d.getDay()) };
      }),
    [workingDays]
  );

  const [date, setDate] = useState(() => days.find((d) => d.works)?.key ?? null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date) return;
    let ignore = false; // পুরনো ধীর request নতুনটার ফল মুছে না দিতে
    setLoading(true);
    setError("");
    getDoctorSlots(doctorId, date)
      .then((data) => !ignore && setSlots(data.slots))
      .catch((err) => !ignore && setError(errMsg(err, "স্লট আনতে সমস্যা হয়েছে।")))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [doctorId, date, refreshKey]);

  const freeCount = slots.filter((s) => s.available).length;

  if (!date) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted">
        <CalendarOff size={28} />
        ডাক্তার এখনো কোনো সময়সূচি দেননি।
      </div>
    );
  }

  return (
    <div>
      {/* ---- তারিখের সারি ---- */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
        {days.map((d) => {
          const active = d.key === date;
          return (
            <button
              key={d.key}
              disabled={!d.works}
              onClick={() => {
                setDate(d.key);
                onSelect(null);
              }}
              className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border px-2 py-2.5 transition ${
                active
                  ? "border-transparent bg-gradient-to-b from-brand to-accent text-white shadow-glow"
                  : d.works
                  ? "border-line bg-surface2/60 hover:border-brand/50"
                  : "cursor-not-allowed border-line/50 opacity-35"
              }`}
            >
              <span className="text-[11px] font-medium opacity-80">{d.today ? "আজ" : WD_SHORT[d.date.getDay()]}</span>
              <span className="text-xl font-bold leading-tight">{d.date.toLocaleDateString("bn-BD", { day: "numeric" })}</span>
              <span className="text-[11px] opacity-80">{d.date.toLocaleDateString("bn-BD", { month: "short" })}</span>
            </button>
          );
        })}
      </div>

      {/* ---- Slot grid ---- */}
      <div className="mt-2 min-h-[8rem]">
        {loading ? (
          <div className="grid place-items-center py-10"><Spinner /></div>
        ) : error ? (
          <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{error}</p>
        ) : slots.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">এই দিনে কোনো স্লট নেই।</p>
        ) : (
          <>
            <p className="mb-3 text-xs text-muted">{freeCount.toLocaleString("bn-BD")}টি স্লট ফাঁকা</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map((s) => {
                const selected = selectedSlot?.startTime === s.startTime;
                return (
                  <button
                    key={s.startTime}
                    disabled={!s.available}
                    onClick={() => onSelect(s)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      selected
                        ? "border-transparent bg-gradient-to-r from-brand to-accent text-white shadow-glow"
                        : s.available
                        ? "border-line bg-surface2/60 hover:border-brand hover:text-brand"
                        : "cursor-not-allowed border-line/50 text-muted line-through opacity-40"
                    }`}
                  >
                    {formatTime(s.startTime)}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}