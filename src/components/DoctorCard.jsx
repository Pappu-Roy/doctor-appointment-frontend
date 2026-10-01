import { Link } from "react-router-dom";
import { ArrowRight, Award, MapPin } from "lucide-react";
import { initials } from "../utils/format";

export default function DoctorCard({ doctor }) {
  const name = doctor.user?.name || "নাম নেই";
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="card group flex flex-col gap-4 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-glow"
    >
      <div className="flex items-center gap-3.5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-accent text-lg font-bold text-white">
          {initials(name)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">ডাঃ {name}</h3>
          <span className="chip mt-1">{doctor.specialty}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5"><Award size={15} /> {Number(doctor.experience).toLocaleString("bn-BD")} বছর</span>
        {doctor.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {doctor.location}</span>}
      </div>

      {doctor.bio && <p className="line-clamp-2 text-sm text-muted">{doctor.bio}</p>}

      <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
        <div>
          <p className="text-xs text-muted">কনসাল্টেশন ফি</p>
          <p className="text-lg font-bold">৳ {Number(doctor.fee).toLocaleString("bn-BD")}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition group-hover:gap-2.5">
          অ্যাপয়েন্টমেন্ট <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}