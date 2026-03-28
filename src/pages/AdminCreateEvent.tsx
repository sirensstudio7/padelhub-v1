import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatEventDate,
  formatEventTime,
  getPastEventsSorted,
  getUpcomingEventsSorted,
  isCustomEventId,
} from "@/data/events";
import { useEventsList } from "@/hooks/useEventsList";

const AdminCreateEvent = () => {
  const allEvents = useEventsList();
  const upcomingEvents = useMemo(() => getUpcomingEventsSorted(allEvents), [allEvents]);
  const pastEvents = useMemo(() => getPastEventsSorted(allEvents), [allEvents]);

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-sm text-muted-foreground font-['Space_Grotesk'] leading-relaxed max-w-2xl">
              Add a new event for the public list. Upcoming events appear below; after a date passes, they move to
              Past events.
            </p>
            <Button
              asChild
              className="h-11 shrink-0 rounded-xl px-6 font-['Space_Grotesk'] font-semibold w-full sm:w-auto"
            >
              <Link to="/admin/events/create">Create event</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border px-6 py-5 sm:px-8">
          <h2 className="text-base font-semibold font-['Space_Grotesk']">Upcoming events</h2>
          <p className="mt-1 text-sm text-muted-foreground font-['Space_Grotesk']">
            Today or future dates (same list as public). Soonest first — includes events you create here.
          </p>
        </div>
        <div className="divide-y divide-border">
          {upcomingEvents.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground font-['Space_Grotesk'] sm:px-8">
              No upcoming events. Create one above, or check that the date is not in the past.
            </p>
          ) : (
            upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8"
              >
                <Link
                  to={`/admin/events/${ev.id}`}
                  className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium font-['Space_Grotesk'] text-foreground truncate">{ev.title}</p>
                    <p className="text-sm text-muted-foreground font-['Space_Grotesk'] truncate">
                      {ev.venue}, {ev.location}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 text-sm text-muted-foreground font-['Space_Grotesk'] sm:justify-end sm:text-right">
                    {ev.type ? (
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-foreground">
                        {ev.type}
                      </span>
                    ) : null}
                    <span className="tabular-nums">
                      {formatEventDate(ev.date)}
                      {ev.time ? ` · ${formatEventTime(ev.time)}` : ""}
                    </span>
                  </div>
                </Link>
                {isCustomEventId(ev.id) ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9 shrink-0 gap-1.5 self-start rounded-lg px-3 font-['Space_Grotesk'] text-xs font-semibold sm:self-center"
                  >
                    <Link to={`/admin/events/${ev.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                      Edit
                    </Link>
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border px-6 py-5 sm:px-8">
          <h2 className="text-base font-semibold font-['Space_Grotesk']">Past events</h2>
          <p className="mt-1 text-sm text-muted-foreground font-['Space_Grotesk']">
            Events with a date before today, or earlier today if a start time was set. Newest first.
          </p>
        </div>
        <div className="divide-y divide-border">
          {pastEvents.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground font-['Space_Grotesk'] sm:px-8">
              No past events yet. When event dates pass, they appear here.
            </p>
          ) : (
            pastEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col gap-2 px-6 py-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8"
              >
                <Link
                  to={`/admin/events/${ev.id}`}
                  className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium font-['Space_Grotesk'] text-foreground truncate">{ev.title}</p>
                    <p className="text-sm text-muted-foreground font-['Space_Grotesk'] truncate">
                      {ev.venue}, {ev.location}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 text-sm text-muted-foreground font-['Space_Grotesk'] sm:justify-end sm:text-right">
                    {ev.type ? (
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-foreground">
                        {ev.type}
                      </span>
                    ) : null}
                    <span className="tabular-nums">
                      {formatEventDate(ev.date)}
                      {ev.time ? ` · ${formatEventTime(ev.time)}` : ""}
                    </span>
                  </div>
                </Link>
                {isCustomEventId(ev.id) ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9 shrink-0 gap-1.5 self-start rounded-lg px-3 font-['Space_Grotesk'] text-xs font-semibold sm:self-center"
                  >
                    <Link to={`/admin/events/${ev.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                      Edit
                    </Link>
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCreateEvent;
