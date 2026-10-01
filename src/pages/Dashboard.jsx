import { useAuth } from "../context/AuthContext";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";

// একই /dashboard URL, কিন্তু role অনুযায়ী আলাদা পেজ
export default function Dashboard() {
  const { user } = useAuth();
  if (user.role === "DOCTOR") return <DoctorDashboard />;
  if (user.role === "ADMIN") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">অ্যাডমিন প্যানেল</h1>
        <p className="mt-2 text-muted">ডাক্তার অনুমোদন ও ইউজার ম্যানেজমেন্ট পরের Module এ আসছে।</p>
      </div>
    );
  }
  return <PatientDashboard />;
}