import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Location01Icon } from "@hugeicons/core-free-icons";
import ClubPageLayout from "@/components/ClubPageLayout";
import ClubRoute from "@/components/ClubRoute";
import RevealSection from "@/components/RevealSection";
import SafeImage from "@/components/SafeImage";
import { formatEventDate, formatEventTime, type Event } from "@/data/events";
import { useEventsList } from "@/hooks/useEventsList";

const EventCard = ({ event }: { event: Event }) => (
  <Link
    to={`/event/${event.id}`}
    className="block rounded-2xl border border-border bg-card overflow-hidden shadow-sm no-underline text-inherit transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    {event.imageUrl && (
      <div className="aspect-[2/1] w-full overflow-hidden bg-muted">
        <SafeImage src={event.imageUrl} alt="" className="w-full h-full object-cover" fallback={null} />
      </div>
    )}
    <div className="p-4 flex flex-col gap-3">
      <div>
        {event.type && (
          <span className="text-xs font-medium text-primary uppercase tracking-wide font-['Space_Grotesk']">
            {event.type}
          </span>
        )}
        <h2 className="text-lg font-bold text-foreground font-['Space_Grotesk'] mt-0.5 line-clamp-2">{event.title}</h2>
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
          <span>
            {event.venue}, {event.location}
          </span>
        </div>
      </div>
    </div>
  </Link>
);

function ClubEventsContent() {
  const events = useEventsList();

  return (
    <ClubPageLayout
      title="Events"
      subtitle="Tournaments, clinics, and social play — open listings to register or share with your members."
    >
      <RevealSection stagger staggerDelay={0.05} className="flex flex-col gap-4 pb-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </RevealSection>
    </ClubPageLayout>
  );
}

export default function ClubEvents() {
  return (
    <ClubRoute>
      <ClubEventsContent />
    </ClubRoute>
  );
}
