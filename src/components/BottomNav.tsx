import { NavLink, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClipboardIcon, TennisRacketIcon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { getCurrentUserId } from "@/data/playerProfile";
import { getPlayerProfile } from "@/data/playerProfile";
import { useProfileOverrides } from "@/contexts/ProfileOverridesContext";
import SafeImage from "@/components/SafeImage";
import "./BottomNav.css";

const BottomNav = () => {
  const { pathname } = useLocation();
  const { overrides } = useProfileOverrides();
  const hideNav = false; // nav visible on all main app routes (profile, club detail, club members)
  if (hideNav) return null;

  const currentUserId = getCurrentUserId();
  const currentProfile = currentUserId ? getPlayerProfile(currentUserId) : null;
  const avatarUrl = overrides.avatarUrl !== undefined ? overrides.avatarUrl ?? undefined : currentProfile?.avatarUrl;
  const displayName = overrides.name !== undefined && overrides.name !== null ? overrides.name : currentProfile?.name;
  const fallbackInitial = displayName?.charAt(0) ?? "?";
  return (
    <div className="bottom-nav">
      <nav className="tab-bar">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `home ${isActive ? "active" : ""}`}
          aria-label="Home"
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M3 18V10.5339C3 9.57062 3.46259 8.66591 4.24353 8.1019L10.2435 3.76856C11.2921 3.01128 12.7079 3.01128 13.7565 3.76856L19.7565 8.1019C20.5374 8.66591 21 9.57062 21 10.5339V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </NavLink>

        <NavLink
          to="/library"
          className={({ isActive }) => `chart ${isActive ? "active" : ""}`}
          aria-label="Clubs"
        >
          <HugeiconsIcon icon={ClipboardIcon} size={24} color="currentColor" strokeWidth={1.5} aria-hidden />
        </NavLink>

        <NavLink
          to="/quiz"
          className={({ isActive }) => `marker ${isActive ? "active" : ""}`}
          aria-label="Quiz"
        >
          <HugeiconsIcon icon={TennisRacketIcon} size={24} color="currentColor" strokeWidth={1.5} aria-hidden />
        </NavLink>

        <NavLink
          to="/ranks"
          className={({ isActive }) => `trophy ${isActive ? "active" : ""}`}
          aria-label="Ranks"
        >
          <HugeiconsIcon icon={Calendar03Icon} size={24} color="currentColor" strokeWidth={1.5} aria-hidden />
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `user ${isActive ? "active" : ""}`}
          aria-label="Profile"
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

export default BottomNav;
