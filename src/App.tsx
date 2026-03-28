import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProfileOverridesProvider } from "@/contexts/ProfileOverridesContext";
import BottomNav from "@/components/BottomNav";
import ClubBottomNav from "@/components/ClubBottomNav";
import PageTransition from "@/components/PageTransition";
import { useAccountRole } from "@/hooks/useAccountRole";
import Index from "./pages/Index";
import ClubIndex from "./pages/ClubIndex";
import ClubDetail from "./pages/ClubDetail";
import ClubMembers from "./pages/ClubMembers";
import Placeholder from "./pages/Placeholder";
import EventDetail from "./pages/EventDetail";
import EventRegister from "./pages/EventRegister";
import EventRegisterSuccess from "./pages/EventRegisterSuccess";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import MatchDetail from "./pages/MatchDetail";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import ClubOurPlayers from "./pages/club/ClubOurPlayers";
import ClubTrophy from "./pages/club/ClubTrophy";
import ClubHistory from "./pages/club/ClubHistory";
import ClubEvents from "./pages/club/ClubEvents";
import AdminRoute from "@/components/AdminRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateEvent from "./pages/AdminCreateEvent";
import AdminCreateEventForm from "./pages/AdminCreateEventForm";
import AdminEventDetail from "./pages/AdminEventDetail";
import AdminUsers from "./pages/AdminUsers";
import AdminLayout from "@/layouts/AdminLayout";
import AdminShell from "@/components/admin/AdminShell";

const queryClient = new QueryClient();

const BottomNavWrapper = () => {
  const { pathname } = useLocation();
  const role = useAccountRole();
  if (pathname === "/login" || pathname === "/signup" || pathname === "/onboarding") return null;
  if (pathname.startsWith("/event/")) return null;
  if (pathname.startsWith("/admin")) return null;
  if (role === "club") return <ClubBottomNav />;
  return <BottomNav />;
};

const HomeGuard = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useAuth();
  const role = useAccountRole();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!hasCompletedOnboarding) return <Navigate to="/onboarding" replace />;
  if (role === "club") return <Navigate to="/club/players" replace />;
  return (
    <PageTransition>
      <Index />
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ProfileOverridesProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeGuard />} />
          <Route path="/club/players" element={<PageTransition><ClubOurPlayers /></PageTransition>} />
          <Route path="/club/trophy" element={<PageTransition><ClubTrophy /></PageTransition>} />
          <Route path="/club/history" element={<PageTransition><ClubHistory /></PageTransition>} />
          <Route path="/club/events" element={<PageTransition><ClubEvents /></PageTransition>} />
          <Route path="/library" element={<PageTransition><ClubIndex /></PageTransition>} />
          <Route path="/library/:clubId" element={<PageTransition><ClubDetail /></PageTransition>} />
          <Route path="/library/:clubId/members" element={<PageTransition><ClubMembers /></PageTransition>} />
          <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
          <Route path="/ranks" element={<PageTransition><Placeholder /></PageTransition>} />
          <Route
            path="/event/:eventId/register/success"
            element={
              <PageTransition>
                <EventRegisterSuccess />
              </PageTransition>
            }
          />
          <Route path="/event/:eventId/register" element={<PageTransition><EventRegister /></PageTransition>} />
          <Route path="/event/:eventId" element={<PageTransition><EventDetail /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/profile/:userId" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/match/:matchId" element={<PageTransition><MatchDetail /></PageTransition>} />
          <Route path="/notifications" element={<PageTransition><Notifications /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
          <Route
            path="/admin"
            element={
              <PageTransition>
                <AdminLayout>
                  <AdminLogin />
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PageTransition>
                <AdminLayout>
                  <AdminRoute>
                    <AdminShell>
                      <AdminDashboard />
                    </AdminShell>
                  </AdminRoute>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/events/new"
            element={
              <PageTransition>
                <AdminLayout>
                  <AdminRoute>
                    <AdminShell>
                      <AdminCreateEvent />
                    </AdminShell>
                  </AdminRoute>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/events/create"
            element={
              <PageTransition>
                <AdminLayout>
                  <AdminRoute>
                    <AdminShell>
                      <AdminCreateEventForm />
                    </AdminShell>
                  </AdminRoute>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/events/:eventId/edit"
            element={
              <PageTransition>
                <AdminLayout>
                  <AdminRoute>
                    <AdminShell>
                      <AdminCreateEventForm />
                    </AdminShell>
                  </AdminRoute>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/events/:eventId"
            element={
              <PageTransition>
                <AdminLayout>
                  <AdminRoute>
                    <AdminShell>
                      <AdminEventDetail />
                    </AdminShell>
                  </AdminRoute>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PageTransition>
                <AdminLayout>
                  <AdminRoute>
                    <AdminShell>
                      <AdminUsers />
                    </AdminShell>
                  </AdminRoute>
                </AdminLayout>
              </PageTransition>
            }
          />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
          <BottomNavWrapper />
        </BrowserRouter>
        </ProfileOverridesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
