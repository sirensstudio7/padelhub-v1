import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { useProfileOverrides } from "@/contexts/ProfileOverridesContext";
import { getEventById } from "@/data/events";
import type { EventRegistration } from "@/data/eventRegistrations";
import { getRegistrationsForEvent } from "@/data/eventRegistrations";
import { Button } from "@/components/ui/button";
import NotFound from "./NotFound";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground font-['Space_Grotesk']">
        {label}
      </dt>
      <dd className="min-w-0 text-sm text-foreground font-['Space_Grotesk'] sm:text-right">{value}</dd>
    </div>
  );
}

const EventRegisterSuccess = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const { setOverrides } = useProfileOverrides();
  const event = eventId ? getEventById(eventId) : null;

  const fromState = (location.state as { registration?: EventRegistration } | null)?.registration;
  const fromStore =
    eventId && !fromState ? getRegistrationsForEvent(eventId).at(-1) : undefined;
  const registration = fromState ?? fromStore;

  useEffect(() => {
    if (!registration?.name?.trim()) return;
    setOverrides({ name: registration.name.trim() });
  }, [registration, setOverrides]);

  if (!event || !registration) return <NotFound />;

  const genderLabel = registration.gender === "m" ? "M" : registration.gender === "f" ? "F" : "—";

  return (
    <div className="min-h-[100dvh] bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-4">
          <Link
            to={`/event/${event.id}`}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Back to event"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </Link>
          <h1 className="flex-1 text-center text-xl font-semibold font-['Space_Grotesk'] text-foreground">
            Registration
          </h1>
          <div className="w-10 shrink-0" aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CheckCircle2 className="h-10 w-10" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="mt-5 text-2xl font-bold font-['Space_Grotesk'] text-foreground">
            You&apos;re registered
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-['Space_Grotesk']">
            Your application for <span className="font-medium text-foreground">{event.title}</span> is saved.
            The organizer needs to approve it before you appear in the tournament bracket.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground font-['Space_Grotesk']">
            Your details
          </p>
          <dl>
            <DetailRow label="Name" value={registration.name} />
            <DetailRow label="Phone" value={registration.phone ?? "—"} />
            <DetailRow label="Address" value={registration.address ?? "—"} />
            <DetailRow label="Gender" value={genderLabel} />
            <DetailRow label="T-shirt size" value={registration.tshirtSize ?? "—"} />
          </dl>
        </div>

        <Button className="mt-8 h-11 w-full rounded-xl font-['Space_Grotesk'] font-semibold shadow-sm" asChild>
          <Link to={`/event/${event.id}`}>Back to event</Link>
        </Button>
      </div>
    </div>
  );
};

export default EventRegisterSuccess;
