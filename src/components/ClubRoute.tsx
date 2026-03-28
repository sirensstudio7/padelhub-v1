import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAccountRole } from "@/hooks/useAccountRole";

/** Restricts routes to logged-in club accounts (signup role `club`). */
export default function ClubRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, hasCompletedOnboarding } = useAuth();
  const role = useAccountRole();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!hasCompletedOnboarding) return <Navigate to="/onboarding" replace />;
  if (role !== "club") return <Navigate to="/" replace />;

  return <>{children}</>;
}
