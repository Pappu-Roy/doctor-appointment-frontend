import { useEffect, useState } from "react";
import { MapPin, Search, SearchX } from "lucide-react";
import { getDoctors } from "../services/doctor.service";
import DoctorCard from "../components/DoctorCard";
import useDebounce from "../hooks/useDebounce";
import { errMsg } from "../utils/format";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({ specialty: "", location: "" });
  const [page, setPage] = useState(1);

  // ইউজার টাইপ থামালে (400ms) তবেই API call হবে
  const debounced = useDebounce(filters, 400);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    getDoctors({ page, ...debounced })
      .then((res) => {
        if (ignore) return;
        setDoctors(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => !ignore && setError(errMsg(err, "ডাক্তারদের তথ্য আনতে সমস্যা হয়েছে।")))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [page, debounced]);

  const setFilter = (name) => (e) => {
    setFilters((f) => ({ ...f, [name]: e.target.value }));
    setPage(1); // ফিল্টার বদলালে সবসময় ১ম পাতায়
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* ---- Hero ---- */}
      <section className="mb-10 text-center">
        <span className="chip">বিশ্বস্ত ডাক্তার · সহজ বুকিং</span>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          তোমার জন্য <span className="gradient-text">সেরা ডাক্তার</span> খুঁজে নাও
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">বিশেষত্ব বা এলাকা দিয়ে খুঁজে, ফাঁকা সময় দেখে সরাসরি বুক করো।</p>

        <div className="card mx-auto mt-8 grid max-w-2xl gap-2 p-2 sm:grid-cols-2">
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input !border-transparent !bg-transparent pl-10" placeholder="বিশেষত্ব (যেমন: Cardiology)" value={filters.specialty} onChange={setFilter("specialty")} />
          </div>
          <div className="relative sm:border-l sm:border-line">
            <MapPin size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input !border-transparent !bg-transparent pl-10" placeholder="এলাকা (যেমন: Dhaka)" value={filters.location} onChange={setFilter("location")} />
          </div>
        </div>
      </section>

      {error && <p className="mb-6 rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-56" />)}
        </div>
      ) : doctors.length === 0 && !error ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center text-muted">
          <SearchX size={36} />
          <p>কোনো ডাক্তার পাওয়া যায়নি। ফিল্টার বদলে দেখো।</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>আগের পাতা</button>
          <span className="text-sm text-muted">{pagination.page} / {pagination.totalPages}</span>
          <button className="btn-ghost" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>পরের পাতা</button>
        </div>
      )}
    </div>
  );
}