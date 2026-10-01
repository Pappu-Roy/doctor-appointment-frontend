import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Laravel এর `auth` আর `role` middleware এর React সংস্করণ।
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  // লগইন নেই → /auth এ পাঠাও, আর কোথা থেকে এসেছিল মনে রাখো (লগইনের পর ফিরিয়ে আনতে)
  if (!user) return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}