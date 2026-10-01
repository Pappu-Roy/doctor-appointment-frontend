import { useEffect } from "react";

// window.confirm() এর সুন্দর বিকল্প। Esc চাপলে বন্ধ হয়।
export default function ConfirmDialog({ open, title, message, confirmText = "হ্যাঁ, নিশ্চিত", danger, loading, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div className="card animate-fade-up w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onCancel} disabled={loading}>না, থাক</button>
          <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm} disabled={loading}>
            {loading ? "অপেক্ষা করো..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}