const MAP = {
  PENDING:   { label: "অপেক্ষমাণ", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30" },
  CONFIRMED: { label: "নিশ্চিত",   cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30" },
  COMPLETED: { label: "সম্পন্ন",   cls: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30" },
  CANCELLED: { label: "বাতিল",     cls: "bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30" },
};

export default function StatusBadge({ status }) {
  const s = MAP[status] || MAP.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}