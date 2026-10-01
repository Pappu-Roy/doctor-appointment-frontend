import { useEffect, useState } from "react";
import { CalendarX } from "lucide-react";
import { getMyAppointments, updateAppointmentStatus } from "../services/appointment.service";
import { useToast } from "../context/ToastContext";
import { errMsg } from "../utils/format";
import AppointmentCard from "./AppointmentCard";
import ConfirmDialog from "./ConfirmDialog";

const TABS = [
  { key: "", label: "সব" },
  { key: "PENDING", label: "অপেক্ষমাণ" },
  { key: "CONFIRMED", label: "নিশ্চিত" },
  { key: "COMPLETED", label: "সম্পন্ন" },
  { key: "CANCELLED", label: "বাতিল" },
];

// State Diagram + Authorization Matrix অনুযায়ী কোন status এ কোন বোতাম
function actionsFor(perspective, status) {
  if (perspective === "patient") {
    return ["PENDING", "CONFIRMED"].includes(status)
      ? [{ to: "CANCELLED", label: "বাতিল করুন", cls: "btn-danger", confirm: true }]
      : [];
  }
  if (status === "PENDING")
    return [
      { to: "CONFIRMED", label: "কনফার্ম", cls: "btn-success" },
      { to: "CANCELLED", label: "রিজেক্ট", cls: "btn-danger", confirm: true },
    ];
  if (status === "CONFIRMED")
    return [
      { to: "COMPLETED", label: "সম্পন্ন", cls: "btn-success" },
      { to: "CANCELLED", label: "বাতিল", cls: "btn-danger", confirm: true },
    ];
  return [];
}

export default function AppointmentsPanel({ perspective, defaultTab = "" }) {
  const toast = useToast();
  const [tab, setTab] = useState(defaultTab);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null); // confirm dialog এর জন্য { appt, to }
  const [acting, setActing] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    getMyAppointments({ status: tab, page })
      .then((res) => {
        if (ignore) return;
        setItems(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => !ignore && setError(errMsg(err, "অ্যাপয়েন্টমেন্ট আনতে সমস্যা হয়েছে।")))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [tab, page, reloadKey]);

  async function run(appt, to) {
    setActing(true);
    try {
      await updateAppointmentStatus(appt.id, to);
      toast.success("স্ট্যাটাস আপডেট হয়েছে।");
      setReloadKey((k) => k + 1); // তালিকা আবার আনো
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setActing(false);
      setPending(null);
    }
  }

  const onAction = (appt, action) => (action.confirm ? setPending({ appt, to: action.to }) : run(appt, action.to));

  return (
    <div>
      {/* ---- ফিল্টার ট্যাব ---- */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              tab === t.key ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-24" />)}</div>
      ) : items.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-14 text-center text-muted">
          <CalendarX size={34} />
          <p>এখানে কোনো অ্যাপয়েন্টমেন্ট নেই।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((appt) => (
            <AppointmentCard key={appt.id} appt={appt} perspective={perspective}>
              {actionsFor(perspective, appt.status).map((a) => (
                <button key={a.to} className={`${a.cls} !px-3 !py-1.5`} onClick={() => onAction(appt, a)} disabled={acting}>
                  {a.label}
                </button>
              ))}
            </AppointmentCard>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>আগের</button>
          <span className="text-sm text-muted">{pagination.page} / {pagination.totalPages}</span>
          <button className="btn-ghost" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>পরের</button>
        </div>
      )}

      <ConfirmDialog
        open={!!pending}
        danger
        loading={acting}
        title="নিশ্চিত করো"
        message="বাতিল করলে স্লটটি আবার অন্য রোগীদের জন্য খুলে যাবে। এটা আর ফেরানো যাবে না।"
        confirmText="হ্যাঁ, বাতিল করো"
        onConfirm={() => run(pending.appt, pending.to)}
        onCancel={() => !acting && setPending(null)}
      />
    </div>
  );
}