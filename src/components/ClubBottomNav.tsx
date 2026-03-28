import { NavLink } from "react-router-dom";
import { CalendarDays, History, Trophy, UsersRound } from "lucide-react";
import { getCurrentPlayerDisplayName, getCurrentUserId, getPlayerProfile } from "@/data/playerProfile";
import { useProfileOverrides } from "@/contexts/ProfileOverridesContext";
import SafeImage from "@/components/SafeImage";
import "./BottomNav.css";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `club-nav-item flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1 ${isActive ? "active" : ""}`;

const ClubBottomNav = () => {
  const { overrides } = useProfileOverrides();
  const currentUserId = getCurrentUserId();
  const currentProfile = currentUserId ? getPlayerProfile(currentUserId) : null;
  const avatarUrl = overrides.avatarUrl !== undefined ? overrides.avatarUrl ?? undefined : currentProfile?.avatarUrl;
  const displayName = getCurrentPlayerDisplayName() ?? currentProfile?.name;
  const fallbackInitial = displayName?.charAt(0) ?? "?";

  return (
    <div className="bottom-nav club-bottom-nav">
      <nav className="tab-bar tab-bar--club" aria-label="Club navigation">
        <NavLink to="/club/players" className={linkClass} aria-label="Our players" title="Our players">
          <UsersRound className="h-[22px] w-[22px] shrink-0" strokeWidth={1.75} aria-hidden />
        </NavLink>

        <NavLink to="/club/trophy" className={linkClass} aria-label="Our trophy" title="Our trophy">
          <Trophy className="h-[22px] w-[22px] shrink-0" strokeWidth={1.75} aria-hidden />
        </NavLink>

        <NavLink to="/club/history" className={linkClass} aria-label="History" title="History">
          <History className="h-[22px] w-[22px] shrink-0" strokeWidth={1.75} aria-hidden />
        </NavLink>

        <NavLink to="/club/events" className={linkClass} aria-label="Events" title="Events">
          <CalendarDays className="h-[22px] w-[22px] shrink-0" strokeWidth={1.75} aria-hidden />
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `user club-nav-item flex flex-col items-center justify-center min-w-0 flex-1 py-1 ${isActive ? "active" : ""}`
          }
          aria-label="Profile"
          title="Profile"
        >
          <span className="profile-tab-avatar" aria-hidden>
            <SafeImage
              src={avatarUrl ?? undefined}
              alt=""
              className="w-6 h-6 rounded-full object-cover border-2 border-white"
              fallback={
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold font-['Space_Grotesk'] border-2 border-white">
                  {fallbackInitial}
                </span>
              }
            />
          </span>
        </NavLink>
      </nav>
    </div>
  );
};

export default ClubBottomNav;
