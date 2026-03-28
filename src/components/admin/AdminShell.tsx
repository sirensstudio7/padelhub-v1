import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  ExternalLink,
  LogOut,
  Menu,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { setAdminAuthenticated } from "@/lib/adminAuth";
import { getRegisteredClubCount } from "@/data/mockClubs";
import { getRegisteredMemberCount } from "@/data/memberStats";

const memberCount = getRegisteredMemberCount();
const clubCount = getRegisteredClubCount();

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-['Space_Grotesk'] transition-colors",
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  );

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const onCreateEventFlow =
    pathname === "/admin/events/new" ||
    pathname === "/admin/events/create" ||
    /^\/admin\/events\/[^/]+\/edit$/.test(pathname) ||
    /^\/admin\/events\/[^/]+$/.test(pathname);

  return (
    <nav className="flex flex-col gap-1 px-3 py-2" onClick={onNavigate}>
      <NavLink to="/admin/dashboard" end className={navClass}>
        <LayoutDashboard className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
        Overview
      </NavLink>
      <NavLink
        to="/admin/events/new"
        className={({ isActive }) => navClass({ isActive: isActive || onCreateEventFlow })}
      >
        <CalendarPlus className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
        Create event
      </NavLink>
      <NavLink to="/admin/users" className={navClass}>
        {({ isActive }) => (
          <>
            <Users className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
            <span className="min-w-0 truncate">Players</span>
            <span
              className={cn(
                "ml-auto shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                isActive
                  ? "bg-primary-foreground/25 text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {memberCount}
            </span>
          </>
        )}
      </NavLink>
      <Link
        to="/library"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium font-['Space_Grotesk'] transition-colors",
          "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Building2 className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
        <span className="min-w-0 flex-1 truncate">Clubs</span>
        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-foreground">
          {clubCount}
        </span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-50" strokeWidth={1.75} />
      </Link>
      <Link
        to="/ranks"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-['Space_Grotesk'] transition-colors",
          "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <CalendarDays className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
        Public events
        <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-50" strokeWidth={1.75} />
      </Link>
    </nav>
  );
}

function pageMeta(pathname: string): { title: string; description: string } {
  if (pathname === "/admin/events/create") {
    return {
      title: "New event",
      description: "Fill in the form and publish to the public list.",
    };
  }
  if (pathname === "/admin/events/new") {
    return {
      title: "Create event",
      description: "Start a new event or review past events below.",
    };
  }
  if (/^\/admin\/events\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: "Edit event",
      description: "Update details shown on the public event page.",
    };
  }
  if (/^\/admin\/events\/[^/]+$/.test(pathname) && pathname !== "/admin/events/new" && pathname !== "/admin/events/create") {
    return {
      title: "Event details",
      description: "Schedule, venue, and bracket — admin preview (not the public page).",
    };
  }
  if (pathname.startsWith("/admin/users")) {
    return {
      title: "Players",
      description: "See how many players are in the app and review the demo directory.",
    };
  }
  return {
    title: "Overview",
    description: "Manage what members see in the PadelHub app.",
  };
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { title, description } = pageMeta(pathname);

  const closeMobile = () => setMobileOpen(false);

  const logout = () => {
    setAdminAuthenticated(false);
    navigate("/admin", { replace: true });
  };

  return (
    <div className="flex h-[100dvh] min-h-0 w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card/90 backdrop-blur-sm md:flex lg:w-64">
        <div className="flex h-16 items-center border-b border-border px-5">
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight font-['Space_Grotesk'] text-foreground">
              PadelHub
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground font-['Space_Grotesk']">
              Admin
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col py-4">
          <AdminNav />
          <div className="mt-auto border-t border-border px-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-3 rounded-lg font-['Space_Grotesk'] text-muted-foreground hover:text-foreground"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden shrink-0" aria-label="Open menu">
                <Menu className="h-5 w-5" strokeWidth={1.75} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-[min(100%,18rem)] flex-col p-0">
              <SheetHeader className="border-b border-border px-4 py-4 text-left">
                <SheetTitle className="font-['Space_Grotesk'] text-left">PadelHub Admin</SheetTitle>
              </SheetHeader>
              <div className="min-h-0 flex-1 overflow-y-auto py-2">
                <AdminNav onNavigate={closeMobile} />
              </div>
              <div className="mt-auto border-t border-border p-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full font-['Space_Grotesk']"
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" strokeWidth={1.75} />
                  Log out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold tracking-tight font-['Space_Grotesk'] sm:text-xl">
              {title}
            </h1>
            <p className="hidden truncate text-sm text-muted-foreground font-['Space_Grotesk'] sm:block">
              {description}
            </p>
          </div>

          <Button variant="outline" size="sm" className="hidden shrink-0 font-['Space_Grotesk'] sm:inline-flex" asChild>
            <Link to="/ranks" target="_blank" rel="noopener noreferrer">
              View public app
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          </Button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-muted/25">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
