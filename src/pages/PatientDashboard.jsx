import { useAuth } from "../context/AuthContext";
import AppointmentsPanel from "../components/AppointmentsPanel";

export default function PatientDashboard() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">হ্যালো, <span className="gradient-text">{user.name}</span> 👋</h1>
      <p className="mb-8 mt-1 text-muted">তোমার সব অ্যাপয়েন্টমেন্ট এখানে।</p>
      <AppointmentsPanel perspective="patient" />
    </div>
  );
}