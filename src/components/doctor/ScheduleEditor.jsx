import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { setDoctorAvailability } from "../../services/doctor.service";
import { useToast } from "../../context/ToastContext";
import { WEEKDAYS_BN, errMsg } from "../../utils/format";

// Backend এ 0 = রবিবার। বাংলাদেশে সপ্তাহ শনি থেকে শুরু, তাই দেখানোর ক্রম আলাদা।
const DISPLAY_ORDER = [6, 0, 1, 2, 3, 4, 5];

// "09:00" < "13:00" — HH:mm ফরম্যাটে string তুলনাই সঠিক
function validate(windows) {
  for (const w of windows) {
    if (!w.startTime || !w.endTime || w.startTime >= w.endTime) {
      return `${WEEKDAYS_BN[w.dayOfWeek]}: শুরুর সময় শেষের সময়ের আগে হতে হবে।`;
    }
  }
  for (const day of DISPLAY_ORDER) {
    const list = windows.filter((w) => w.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 1; i < list.length; i++) {
      if (list[i].startTime < list[i - 1].endTime) return `${WEEKDAYS_BN[day]}: দুটি সময় একে অপরের সাথে মিশে গেছে।`;
    }
  }
  return null;
}

export default function ScheduleEditor({ profile, onSaved }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [windows, setWindows] = useState(
    profile.availability.map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }))
  );

  const add = (day) => setWindows((w) => [...w, { dayOfWeek: day, startTime: "09:00", endTime: "13:00" }]);
  const remove = (i) => setWindows((w) => w.filter((_, idx) => idx !== i));
  const update = (i, field, value) => setWindows((w) => w.map((x, idx) => (idx === i ? { ...x, [field]: value } : x)));

  async function save() {
    if (windows.length === 0) return toast.error("কমপক্ষে একটি সময় যোগ করো।");
    const problem = validate(windows);
    if (problem) return toast.error(problem);

    setSaving(true);
    try {
      const availability = await setDoctorAvailability(profile.id, windows);
      onSaved({ ...profile, availability });
      toast.success("সময়সূচি সেভ হয়েছে।");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card space-y-4 p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-semibold">সাপ্তাহিক সময়সূচি</h3>
        <p className="mt-1 text-sm text-muted">প্রতিটি সময়-পরিসর ৩০ মিনিটের স্লটে ভাগ হবে (বিরতি সহ)।</p>
      </div>

      <div className="divide-y divide-line">
        {DISPLAY_ORDER.map((day) => {
          const rows = windows.map((w, i) => ({ ...w, i })).filter((w) => w.dayOfWeek === day);
          return (
            <div key={day} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start">
              <div className="w-28 shrink-0 pt-2 text-sm font-medium">{WEEKDAYS_BN[day]}</div>
              <div className="flex-1 space-y-2">
                {rows.length === 0 && <p className="pt-2 text-sm text-muted">ছুটি</p>}
                {rows.map((r) => (
                  <div key={r.i} className="flex items-center gap-2">
                    <input type="time" className="input !w-auto" value={r.startTime} onChange={(e) => update(r.i, "startTime", e.target.value)} />
                    <span className="text-muted">–</span>
                    <input type="time" className="input !w-auto" value={r.endTime} onChange={(e) => update(r.i, "endTime", e.target.value)} />
                    <button onClick={() => remove(r.i)} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-500/10 hover:text-red-500" aria-label="মুছো">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => add(day)} className="btn-ghost !px-3 !py-1.5 self-start" aria-label="সময় যোগ করো">
                <Plus size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <button className="btn-primary" onClick={save} disabled={saving}>
        <Save size={16} /> {saving ? "সেভ হচ্ছে..." : "সময়সূচি সেভ করো"}
      </button>
    </div>
  );
}