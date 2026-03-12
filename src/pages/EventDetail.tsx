import { useParams, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, SentIcon, Calendar03Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { getEventById, formatEventDate, formatEventTime } from "@/data/events";
import SafeImage from "@/components/SafeImage";
import EventBracket from "@/components/EventBracket";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotFound from "./NotFound";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = eventId ? getEventById(eventId) : null;

  if (!event) return <NotFound />;

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
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
          </div>

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
              <EventBracket />
            </TabsContent>
          </Tabs>

          <Button
            asChild
            className="w-full font-['Space_Grotesk'] font-semibold rounded-xl h-11"
          >
            <a
              href="#register"
              className="inline-flex items-center justify-center"
            >
              Register for this event
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
