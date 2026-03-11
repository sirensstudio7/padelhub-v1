import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import ClubIndex from "./pages/ClubIndex";
import ClubDetail from "./pages/ClubDetail";
import ClubMembers from "./pages/ClubMembers";
import Placeholder from "./pages/Placeholder";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import MatchDetail from "./pages/MatchDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/library" element={<PageTransition><ClubIndex /></PageTransition>} />
          <Route path="/library/:clubId" element={<PageTransition><ClubDetail /></PageTransition>} />
          <Route path="/library/:clubId/members" element={<PageTransition><ClubMembers /></PageTransition>} />
          <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
          <Route path="/ranks" element={<PageTransition><Placeholder /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/profile/:userId" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/match/:matchId" element={<PageTransition><MatchDetail /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
