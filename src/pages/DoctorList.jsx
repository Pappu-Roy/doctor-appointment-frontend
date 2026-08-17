import { useEffect, useState } from "react";
import { getDoctors } from "../services/doctor.service";
import DoctorCard from "../components/DoctorCard";

export default function DoctorList() {
  // --- Data + UI state ---
  // Three separate booleans (loading/error/data) instead of one combined
  // "status" string — simpler to read for a beginner, even though a
  // reducer would be "more correct" for a bigger app.
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Filter/search state (what the user is typing) --- 
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);

  // Re-fetch whenever page, specialty, or location changes.
  // This is the bridge between "what the user wants" (filter state)
  // and "what we show" (doctors state) — every dependency change
  // re-runs the effect, which re-calls the API.
  useEffect(() => {
    let ignore = false; // guards against a race: an old, slow request
    // overwriting the result of a newer one if responses arrive out of order.

    async function fetchDoctors() {
      setLoading(true);
      setError("");
      try {
        const result = await getDoctors({ page, specialty, location });
        if (!ignore) {
          setDoctors(result.data);
          setPagination(result.pagination);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message || "ডাক্তারদের তথ্য আনতে সমস্যা হয়েছে। আবার চেষ্টা করো।"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchDoctors();
    return () => {
      ignore = true;
    };
  }, [page, specialty, location]);

  // Changing a filter should always jump back to page 1 —
  // otherwise you could be stuck on "page 4" of a filtered list that only has 1 page.
  function handleSpecialtyChange(value) {
    setSpecialty(value);
    setPage(1);
  }

  function handleLocationChange(value) {
    setLocation(value);
    setPage(1);
  }

  return (
    <div className="doctor-list-page">
      <h1>ডাক্তার খুঁজুন</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Specialty (যেমন: Cardiology)"
          value={specialty}
          onChange={(e) => handleSpecialtyChange(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location (যেমন: Dhaka)"
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
        />
      </div>

      {loading && <p>লোড হচ্ছে...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && doctors.length === 0 && (
        <p>কোনো ডাক্তার পাওয়া যায়নি। ফিল্টার বদলে দেখো।</p>
      )}

      <div className="doctor-grid">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            আগের পাতা
          </button>
          <span>
            {pagination.page} / {pagination.totalPages}
          </span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
            পরের পাতা
          </button>
        </div>
      )}
    </div>
  );
}