import { useMemo } from "react";
import { createPortal } from "react-dom";
import { useParams, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, SentIcon, Calendar03Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { getEventById, formatEventDate, formatEventTime } from "@/data/events";
import {
  getTournamentBracketFromEvent,
  getTournamentRegistrationCapacity,
} from "@/lib/eventTournamentBracket";
import { getTournamentBracketDisplayRounds } from "@/lib/bracketRandomDraw";
import { useEventRegistrations } from "@/hooks/useEventRegistrations";
import {
  normalizeRegistrationStatus,
  getRegistrationSlotsUsed,
} from "@/data/eventRegistrations";
import { useTournamentBracketDraw } from "@/hooks/useTournamentBracketDraw";
import SafeImage from "@/components/SafeImage";
import EventBracket from "@/components/EventBracket";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotFound from "./NotFound";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = eventId ? getEventById(eventId) : null;
  const registrations = useEventRegistrations(eventId);

  const approvedRegistrations = useMemo(
    () => registrations.filter((r) => normalizeRegistrationStatus(r) === "approved"),
    [registrations]
  );

  const tournamentBracket = useMemo(() => getTournamentBracketFromEvent(event), [event]);
  const bracketTemplateRounds = tournamentBracket?.rounds ?? null;
  const storedBracketDraw = useTournamentBracketDraw(eventId, bracketTemplateRounds);
  const displayBracketRounds = useMemo(() => {
    if (!tournamentBracket) return undefined;
    return getTournamentBracketDisplayRounds(
      tournamentBracket.rounds,
      storedBracketDraw,
      approvedRegistrations,
      tournamentBracket.slots
    );
  }, [tournamentBracket, storedBracketDraw, approvedRegistrations]);

  if (!event) return <NotFound />;

  const registrationCapacity = getTournamentRegistrationCapacity(event);
  const slotsUsed = eventId ? getRegistrationSlotsUsed(eventId) : 0;
  const registrationFull =
    registrationCapacity != null && slotsUsed >= registrationCapacity;

  const registerBar = (
    <nav
      id="register"
      className="pointer-events-auto fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-background/95 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.12)] backdrop-blur-sm supports-[backdrop-filter]:bg-background/80"
      aria-label="Event registration"
    >
      <div className="mx-auto max-w-lg px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {registrationFull ? (
          <Button
            type="button"
            disabled
            className="h-11 w-full cursor-not-allowed rounded-xl font-['Space_Grotesk'] font-semibold opacity-80 shadow-sm"
          >
            Registration full
          </Button>
        ) : (
          <Button
            type="button"
            className="h-11 w-full rounded-xl font-['Space_Grotesk'] font-semibold shadow-sm"
            asChild
          >
            <Link to={`/event/${event.id}/register`}>Register for this event</Link>
          </Button>
        )}
      </div>
    </nav>
  );

  return (
    <>
    <div className="min-h-[100dvh] bg-background pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between gap-2">
          <Link
            to="/ranks"
            className="p-2 -ml-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            aria-label="Back to events"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </Link>
          <h1 className="text-xl font-semibold text-foreground font-['Space_Grotesk'] flex-1 text-center">
            Event details
          </h1>
          <div className="flex items-center gap-0 shrink-0">
            <button
              type="button"
              aria-label="Share"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <HugeiconsIcon icon={SentIcon} size={24} color="currentColor" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
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
        <div className="px-4 py-6 flex flex-col gap-6">
          <div>
            {event.type && (
              <span className="text-xs font-medium text-primary uppercase tracking-wide font-['Space_Grotesk']">
                {event.type}
              </span>
            )}
            <h2 className="text-2xl font-bold text-foreground font-['Space_Grotesk'] mt-0.5">
              {event.title}
            </h2>
            {registrationCapacity != null ? (
              <p className="mt-2 text-xs text-muted-foreground font-['Space_Grotesk'] tabular-nums">
                {slotsUsed} / {registrationCapacity} applications (pending + approved)
                {approvedRegistrations.length > 0
                  ? ` · ${approvedRegistrations.length} approved`
                  : ""}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 text-muted-foreground font-['Space_Grotesk']">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Calendar03Icon} size={20} color="currentColor" strokeWidth={1.5} className="shrink-0" />
              <span>
                {formatEventDate(event.date)}
                {event.time ? ` · ${formatEventTime(event.time)}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Location01Icon} size={20} color="currentColor" strokeWidth={1.5} className="shrink-0" />
              <span>{event.venue}, {event.location}</span>
            </div>
            {event.type === "tournament" && event.teamsCount ? (
              <p className="text-sm text-muted-foreground font-['Space_Grotesk']">
                <span className="font-medium text-foreground">Teams playing: </span>
                {event.teamsCount}
              </p>
            ) : null}
          </div>

          {event.type === "tournament" ? (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-2 font-['Space_Grotesk']">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="bracket">Bracket</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-3">
                {event.description ? (
                  <p className="text-sm text-muted-foreground font-['Space_Grotesk'] leading-relaxed">
                    {event.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground font-['Space_Grotesk']">No details available.</p>
                )}
              </TabsContent>
              <TabsContent value="bracket" className="mt-3">
                {tournamentBracket ? (
                  <>
                    <p className="mb-3 text-xs text-muted-foreground font-['Space_Grotesk'] leading-relaxed">
                      Single elimination for up to {tournamentBracket.slots} team slots (from “{event.teamsCount}”
                      {tournamentBracket.slots > tournamentBracket.entered
                        ? ` — padded to ${tournamentBracket.slots} for a full bracket`
                        : ""}
                      ). Names appear in round 1 as players register (or after the organizer randomizes matchups).
                    </p>
                    <EventBracket rounds={displayBracketRounds} />
                  </>
                ) : (
                  <EventBracket />
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="w-full">
              {event.description ? (
                <p className="text-sm text-muted-foreground font-['Space_Grotesk'] leading-relaxed">
                  {event.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground font-['Space_Grotesk']">No details available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    {typeof document !== "undefined" ? createPortal(registerBar, document.body) : null}
    </>
  );
};

export default EventDetail;
