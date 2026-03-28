import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import {
  addCustomEvent,
  EVENT_TYPES,
  getEventById,
  isCustomEventId,
  updateCustomEvent,
  type Event,
} from "@/data/events";
import NotFound from "./NotFound";

const TYPE_UNSET = "__unset__";

const AdminCreateEventForm = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { eventId } = useParams<{ eventId: string }>();
  const isEdit = Boolean(eventId) && pathname.endsWith("/edit");
  const existing = eventId ? getEventById(eventId) : null;

  const [title, setTitle] = useState("");
  const [type, setType] = useState<NonNullable<Event["type"]> | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [teamsCount, setTeamsCount] = useState("");

  useEffect(() => {
    if (!isEdit || !existing || !isCustomEventId(existing.id)) return;
    setTitle(existing.title);
    setType(existing.type ?? "");
    setDate(existing.date);
    setTime(existing.time ?? "");
    setVenue(existing.venue);
    setLocation(existing.location);
    setImageUrl(existing.imageUrl ?? "");
    setDescription(existing.description ?? "");
    setTeamsCount(existing.teamsCount ?? "");
  }, [isEdit, existing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Event = {
      id: isEdit && eventId ? eventId : (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `e-${Date.now()}`),
      title: title.trim(),
      date,
      time: time.trim() || undefined,
      venue: venue.trim(),
      location: location.trim(),
      type: type || undefined,
      teamsCount:
        type === "tournament" && teamsCount.trim() ? teamsCount.trim() : undefined,
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim() || undefined,
    };

    if (isEdit && eventId) {
      updateCustomEvent({ ...payload, id: eventId });
      toast.success("Event saved", { description: payload.title });
      navigate(`/admin/events/${eventId}`);
      return;
    }

    addCustomEvent(payload);
    toast.success("Event created", { description: payload.title });
    navigate(`/admin/events/${payload.id}`);
  };

  if (isEdit) {
    if (!eventId || !existing) return <NotFound />;
    if (!isCustomEventId(existing.id)) {
      return (
        <div className="rounded-2xl border border-border bg-card px-6 py-10 shadow-sm sm:px-8">
          <p className="text-sm text-muted-foreground font-['Space_Grotesk'] leading-relaxed">
            Built-in demo events cannot be edited. Create a new event or edit one you added from this device.
          </p>
          <Button asChild className="mt-6 rounded-xl font-['Space_Grotesk']" variant="secondary">
            <Link to="/admin/events/new">Back to events</Link>
          </Button>
        </div>
      );
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5 sm:px-8">
        <Link
          to="/admin/events/new"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground font-['Space_Grotesk'] hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Back to events
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm text-muted-foreground font-['Space_Grotesk'] leading-relaxed max-w-2xl">
            {isEdit
              ? "Changes apply to the public event page and admin views on this device."
              : "Match the public event page: type, title, schedule, venue & location, optional image and description."}
          </p>
          <Button
            type="submit"
            form="admin-create-event-form"
            className="h-11 shrink-0 rounded-xl px-6 font-['Space_Grotesk'] font-semibold w-full sm:w-auto"
          >
            {isEdit ? "Save changes" : "Create event"}
          </Button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <form
          id="admin-create-event-form"
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl flex-col gap-5"
        >
          <div className="space-y-2">
            <Label className="font-['Space_Grotesk']">Type</Label>
            <Select
              value={type || TYPE_UNSET}
              onValueChange={(v) => {
                const next = v === TYPE_UNSET ? "" : (v as NonNullable<Event["type"]>);
                setType(next);
                if (next !== "tournament") setTeamsCount("");
              }}
            >
              <SelectTrigger className="font-['Space_Grotesk'] rounded-xl h-11">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TYPE_UNSET} className="font-['Space_Grotesk']">
                  None
                </SelectItem>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value} className="font-['Space_Grotesk']">
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === "tournament" ? (
            <div className="space-y-2">
              <Label htmlFor="admin-teams-count" className="font-['Space_Grotesk']">
                How many teams will play
              </Label>
              <Input
                id="admin-teams-count"
                value={teamsCount}
                onChange={(e) => setTeamsCount(e.target.value)}
                className="font-['Space_Grotesk'] rounded-xl h-11"
                placeholder="e.g. 16 or 8 teams"
                autoComplete="off"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="admin-title" className="font-['Space_Grotesk']">
              Title
            </Label>
            <Input
              id="admin-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl h-11"
              placeholder="The Hub Prime Series #2"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admin-date" className="font-['Space_Grotesk']">
                Date
              </Label>
              <Input
                id="admin-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-['Space_Grotesk'] rounded-xl h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-time" className="font-['Space_Grotesk']">
                Time
              </Label>
              <Input
                id="admin-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="font-['Space_Grotesk'] rounded-xl h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admin-venue" className="font-['Space_Grotesk']">
                Venue
              </Label>
              <Input
                id="admin-venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="font-['Space_Grotesk'] rounded-xl h-11"
                placeholder="Padel Hub Society"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-location" className="font-['Space_Grotesk']">
                Location
              </Label>
              <Input
                id="admin-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="font-['Space_Grotesk'] rounded-xl h-11"
                placeholder="Downtown"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-image" className="font-['Space_Grotesk']">
              Image URL
            </Label>
            <Input
              id="admin-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl h-11"
              placeholder="https://…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-description" className="font-['Space_Grotesk']">
              Description
            </Label>
            <Textarea
              id="admin-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="font-['Space_Grotesk'] rounded-xl min-h-[120px] resize-y"
              placeholder="Details shown on the Details tab…"
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl font-['Space_Grotesk'] font-semibold sm:w-auto sm:min-w-[200px]"
          >
            {isEdit ? "Save changes" : "Create event"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateEventForm;
