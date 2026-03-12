import { useLocation, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, Calendar03Icon, Location01Icon } from "@hugeicons/core-free-icons";
import RevealSection from "@/components/RevealSection";
import SafeImage from "@/components/SafeImage";
import {
  upcomingEvents,
  formatEventDate,
  formatEventTime,
  type Event,
} from "@/data/events";

const EventCard = ({ event }: { event: Event }) => (
  <Link
    to={`/event/${event.id}`}
    className="block rounded-2xl border border-border bg-card overflow-hidden shadow-sm no-underline text-inherit transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    {event.imageUrl && (
      <div className="aspect-[2/1] w-full overflow-hidden bg-muted">
        <SafeImage
          src={event.imageUrl}
          alt=""
          className="w-full h-full object-cover"
          fallback={null}
        />
      </div>
    )}
    <div className="p-4 flex flex-col gap-3">
      <div>
        {event.type && (
          <span className="text-xs font-medium text-primary uppercase tracking-wide font-['Space_Grotesk']">
            {event.type}
          </span>
        )}
        <h2 className="text-lg font-bold text-foreground font-['Space_Grotesk'] mt-0.5 line-clamp-2">
          {event.title}
        </h2>
      </div>
      <div className="flex flex-col gap-1.5 text-sm text-muted-foreground font-['Space_Grotesk']">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar03Icon} size={16} color="currentColor" strokeWidth={1.5} className="shrink-0" />
          <span>
            {formatEventDate(event.date)}
            {event.time ? ` · ${formatEventTime(event.time)}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Location01Icon} size={16} color="currentColor" strokeWidth={1.5} className="shrink-0" />
          <span>{event.venue}, {event.location}</span>
        </div>
      </div>
    </div>
  </Link>
);

const EventsPage = () => (
  <div className="min-h-[100dvh] bg-background pb-16">
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center shrink-0" aria-label="PadelHub home">
          <SafeImage
            src="/logo.png"
            alt="PadelHub"
            className="h-8 w-auto object-contain object-left"
            fallback={
              <span className="h-8 flex items-center text-lg font-bold text-primary font-['Space_Grotesk']">
                PadelHub
              </span>
            }
          />
        </Link>
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="p-2 rounded-full text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          <HugeiconsIcon icon={Notification01Icon} size={24} color="currentColor" strokeWidth={1.5} />
        </Link>
      </div>
    </header>

    <div className="max-w-lg mx-auto mt-4">
      <RevealSection className="px-4 py-4">
        <h1 className="text-3xl font-bold tracking-widest text-foreground font-['Space_Grotesk'] whitespace-nowrap">
          Upcoming events
        </h1>
        <p className="text-sm text-muted-foreground font-['Space_Grotesk'] mt-1">
          Tournaments, clinics and social play
        </p>
      </RevealSection>

      <RevealSection stagger staggerDelay={0.05} className="flex flex-col gap-4 px-4 pb-8">
        {upcomingEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </RevealSection>
    </div>
  </div>
);

const Placeholder = () => {
  const location = useLocation();
  const segment = location.pathname.slice(1).toLowerCase();

  if (segment === "ranks") {
    return <EventsPage />;
  }

  const pageName = (segment || "home").toUpperCase();
  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center pb-16">
      <RevealSection className="text-center">
        <h1 className="text-2xl font-bold tracking-widest text-muted-foreground">
          {pageName}
        </h1>
      </RevealSection>
    </div>
  );
};

export default Placeholder;
