import { Clock, Phone } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatTime } from "../utils/format";

// perspective: "patient" হলে ডাক্তারের তথ্য, "doctor" হলে রোগীর তথ্য দেখায়
export default function AppointmentCard({ appt, perspective, children }) {
  const d = new Date(appt.startTime);
  const isPatientView = perspective === "patient";
  const title = isPatientView ? `ডাঃ ${appt.doctor?.user?.name ?? ""}` : appt.patient?.name;
  const sub = isPatientView ? appt.doctor?.specialty : appt.patient?.phone || appt.patient?.email;

  return (
    <div className="card animate-fade-up flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-brand/25 bg-brand/10 text-center leading-tight">
        <div>
          <div className="text-xl font-bold text-brand">{d.toLocaleDateString("bn-BD", { day: "numeric" })}</div>
          <div className="text-[11px] font-medium text-muted">{d.toLocaleDateString("bn-BD", { month: "short" })}</div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{title}</h3>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted">
          {!isPatientView && sub && <Phone size={13} />} {sub}
        </p>
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium">
          <Clock size={14} className="text-brand" />
          {d.toLocaleDateString("bn-BD", { weekday: "long" })}, {formatTime(appt.startTime)}
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:items-end">
        <StatusBadge status={appt.status} />
        {children && <div className="flex flex-wrap gap-2">{children}</div>}
      </div>
    </div>
  );
}