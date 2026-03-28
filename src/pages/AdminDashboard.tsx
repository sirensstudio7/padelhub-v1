import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarAdd01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Building2, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRegisteredClubCount } from "@/data/mockClubs";
import { getRegisteredMemberCount } from "@/data/memberStats";
import { useEventsList } from "@/hooks/useEventsList";
import { cn } from "@/lib/utils";

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  to,
  external,
  className,
}: {
  title: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  to: string;
  external?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground",
            className
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
          strokeWidth={1.75}
        />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-['Space_Grotesk']">
        {title}
      </p>
      <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight font-['Space_Grotesk'] sm:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-sm text-muted-foreground font-['Space_Grotesk'] leading-snug">{hint}</p>
    </>
  );

  const cardClass =
    "group block rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md no-underline text-inherit";

  if (external) {
    return (
      <Link to={to} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {inner}
      </Link>
    );
  }
  return (
    <Link to={to} className={cardClass}>
      {inner}
    </Link>
  );
}

const AdminDashboard = () => {
  const events = useEventsList();
  const memberCount = getRegisteredMemberCount();
  const eventCount = events.length;
  const clubCount = getRegisteredClubCount();

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Players"
          value={memberCount}
          hint="Players in the demo directory. Open for full list."
          icon={Users}
          to="/admin/users"
          className="bg-primary/10 text-primary"
        />
        <StatCard
          title="Events"
          value={eventCount}
          hint="Seed + events you created. Opens the public list."
          icon={CalendarDays}
          to="/ranks"
          external
        />
        <StatCard
          title="Clubs"
          value={clubCount}
          hint="Venues in the demo library. Opens the club directory."
          icon={Building2}
          to="/library"
          external
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/events/new"
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={CalendarAdd01Icon} size={22} color="currentColor" strokeWidth={1.5} />
            </div>
            <ArrowRight
              className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
              strokeWidth={1.75}
            />
          </div>
          <h2 className="mt-4 text-lg font-semibold font-['Space_Grotesk']">Create event</h2>
          <p className="mt-1 text-sm text-muted-foreground font-['Space_Grotesk'] leading-relaxed">
            Publish tournaments, clinics, socials, and leagues to the upcoming events list.
          </p>
        </Link>

        <Link
          to="/ranks"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
              <HugeiconsIcon icon={Calendar03Icon} size={22} color="currentColor" strokeWidth={1.5} />
            </div>
            <ArrowRight
              className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
              strokeWidth={1.75}
            />
          </div>
          <h2 className="mt-4 text-lg font-semibold font-['Space_Grotesk']">Public events</h2>
          <p className="mt-1 text-sm text-muted-foreground font-['Space_Grotesk'] leading-relaxed">
            Open the member-facing list in a new tab to verify how events appear.
          </p>
        </Link>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-8 text-center sm:text-left">
        <p className="text-sm text-muted-foreground font-['Space_Grotesk'] max-w-xl">
          Tip: use the sidebar for quick navigation. New events you create appear on the public app after you save.
        </p>
        <Button asChild className="mt-4 font-['Space_Grotesk']" size="sm">
          <Link to="/admin/events/new">New event</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
