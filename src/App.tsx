import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProfileOverridesProvider } from "@/contexts/ProfileOverridesContext";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import ClubIndex from "./pages/ClubIndex";
import ClubDetail from "./pages/ClubDetail";
import ClubMembers from "./pages/ClubMembers";
import Placeholder from "./pages/Placeholder";
import EventDetail from "./pages/EventDetail";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import MatchDetail from "./pages/MatchDetail";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const BottomNavWrapper = () => {
  const { pathname } = useLocation();
  if (pathname === "/login" || pathname === "/signup" || pathname === "/onboarding") return null;
  return <BottomNav />;
};

const HomeGuard = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!hasCompletedOnboarding) return <Navigate to="/onboarding" replace />;
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
          <Route path="/library" element={<PageTransition><ClubIndex /></PageTransition>} />
          <Route path="/library/:clubId" element={<PageTransition><ClubDetail /></PageTransition>} />
          <Route path="/library/:clubId/members" element={<PageTransition><ClubMembers /></PageTransition>} />
          <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
          <Route path="/ranks" element={<PageTransition><Placeholder /></PageTransition>} />
          <Route path="/event/:eventId" element={<PageTransition><EventDetail /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/profile/:userId" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/match/:matchId" element={<PageTransition><MatchDetail /></PageTransition>} />
          <Route path="/notifications" element={<PageTransition><Notifications /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
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
