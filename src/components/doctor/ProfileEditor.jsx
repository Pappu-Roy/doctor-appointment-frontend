import { useState } from "react";
import { Save } from "lucide-react";
import { updateDoctorProfile } from "../../services/doctor.service";
import { useToast } from "../../context/ToastContext";
import { errMsg } from "../../utils/format";

export default function ProfileEditor({ profile, onSaved }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    specialty: profile.specialty === "Not set" ? "" : profile.specialty,
    experience: profile.experience,
    fee: Number(profile.fee),
    bufferTime: profile.bufferTime,
    location: profile.location || "",
    bio: profile.bio || "",
  });

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // number ফিল্ডগুলো form এ string থাকে, পাঠানোর আগে Number() করতে হয়
      const updated = await updateDoctorProfile(profile.id, {
        specialty: form.specialty,
        experience: Number(form.experience),
        fee: Number(form.fee),
        bufferTime: Number(form.bufferTime),
        location: form.location,
        bio: form.bio,
      });
      onSaved({ ...profile, ...updated });
      toast.success("প্রোফাইল সেভ হয়েছে।");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-5 sm:p-6">
      <h3 className="text-lg font-semibold">প্রোফাইল তথ্য</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">বিশেষত্ব (Specialty)</label>
          <input className="input" name="specialty" value={form.specialty} onChange={change} placeholder="যেমন: Cardiology" required minLength={2} />
        </div>
        <div>
          <label className="label">অবস্থান</label>
          <input className="input" name="location" value={form.location} onChange={change} placeholder="যেমন: Dhaka" />
        </div>
        <div>
          <label className="label">অভিজ্ঞতা (বছর)</label>
          <input className="input" type="number" min="0" name="experience" value={form.experience} onChange={change} />
        </div>
        <div>
          <label className="label">ফি (৳)</label>
          <input className="input" type="number" min="0" name="fee" value={form.fee} onChange={change} />
        </div>
        <div>
          <label className="label">দুই অ্যাপয়েন্টমেন্টের বিরতি (মিনিট, ০–৬০)</label>
          <input className="input" type="number" min="0" max="60" name="bufferTime" value={form.bufferTime} onChange={change} />
        </div>
      </div>
      <div>
        <label className="label">সংক্ষিপ্ত পরিচিতি</label>
        <textarea className="input min-h-[96px]" name="bio" value={form.bio} onChange={change} maxLength={1000} />
      </div>
      <button className="btn-primary" disabled={saving}>
        <Save size={16} /> {saving ? "সেভ হচ্ছে..." : "সেভ করো"}
      </button>
    </form>
  );
}