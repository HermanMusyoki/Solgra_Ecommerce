import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthHooks";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-2">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-[#8B91A8] font-medium">Loading…</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-2">
      <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!user)    return <Navigate to="/login"  state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/"       replace />;
  return children;
}

export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}
