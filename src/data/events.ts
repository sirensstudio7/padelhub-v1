export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  location: string;
  venue: string;
  type?: "tournament" | "clinic" | "social" | "league";
  /** Shown for tournaments: how many teams will play (free text, e.g. "16" or "8 teams"). */
  teamsCount?: string;
  imageUrl?: string;
  description?: string;
}

/** Seed events (bundled). Custom events from admin are stored in localStorage and merged via `getAllEvents`. */
export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "The Hub Prime Series #1",
    date: "2025-04-12",
    time: "09:00",
    location: "Downtown",
    venue: "Padel Hub Society",
    type: "tournament",
    imageUrl: "/banner.jpeg",
    description: "The first stop of The Hub Prime Series. Open doubles tournament with group stage and knockout rounds. Prizes for top teams and ranking points toward the series final.",
  },
  {
    id: "2",
    title: "Beginner Clinic",
    date: "2025-04-15",
    time: "18:00",
    location: "North Side",
    venue: "Serve Side",
    type: "clinic",
    imageUrl: "https://images.unsplash.com/photo-1622163642998-1ee2a1d2a5f2?w=400&h=200&fit=crop",
  },
  {
    id: "3",
    title: "Friday Night Social",
    date: "2025-04-18",
    time: "19:00",
    location: "West End",
    venue: "Selasa Padel",
    type: "social",
    imageUrl: "https://images.unsplash.com/photo-1595435934249-5d17d4a1d6f2?w=400&h=200&fit=crop",
  },
  {
    id: "4",
    title: "League Round 3",
    date: "2025-04-20",
    time: "10:00",
    location: "Central",
    venue: "Racket Republic",
    type: "league",
    imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=200&fit=crop",
  },
  {
    id: "5",
    title: "Mixed Doubles Cup",
    date: "2025-04-25",
    time: "08:00",
    location: "East District",
    venue: "Court Masters",
    type: "tournament",
    imageUrl: "https://images.unsplash.com/photo-1617083274690-970a4b7380f0?w=400&h=200&fit=crop",
  },
];

const CUSTOM_EVENTS_KEY = "padelhub_custom_events";

function readCustomEvents(): Event[] {
  try {
    const raw = localStorage.getItem(CUSTOM_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is Event =>
        e != null &&
        typeof e === "object" &&
        typeof (e as Event).id === "string" &&
        typeof (e as Event).title === "string" &&
        typeof (e as Event).date === "string" &&
        typeof (e as Event).location === "string" &&
        typeof (e as Event).venue === "string"
    );
  } catch {
    return [];
  }
}

export function getAllEvents(): Event[] {
  return [...upcomingEvents, ...readCustomEvents()];
}

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** True if the event date/time is before now (local). */
export function isEventPast(e: Event): boolean {
  const today = localDateString(new Date());
  if (e.date < today) return true;
  if (e.date > today) return false;
  if (!e.time) return false;
  const [hh, mm] = e.time.split(":").map((x) => parseInt(x, 10));
  const start = new Date(`${e.date}T12:00:00`);
  start.setHours(hh || 0, mm || 0, 0, 0);
  return start.getTime() < Date.now();
}

export function getPastEventsSorted(events: Event[]): Event[] {
  return events
    .filter(isEventPast)
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      if (byDate !== 0) return byDate;
      return a.title.localeCompare(b.title);
    });
}

/** Today or future by date/time; soonest first (public + custom). */
export function getUpcomingEventsSorted(events: Event[]): Event[] {
  return events
    .filter((e) => !isEventPast(e))
    .sort((a, b) => {
      const byDate = a.date.localeCompare(b.date);
      if (byDate !== 0) return byDate;
      return a.title.localeCompare(b.title);
    });
}

export function getEventById(id: string): Event | null {
  return getAllEvents().find((e) => e.id === id) ?? null;
}

function writeCustomEvents(events: Event[]): void {
  try {
    localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(events));
  } catch {
    /* quota */
  }
  window.dispatchEvent(new CustomEvent("padelhub-events-changed"));
}

export function isCustomEventId(id: string): boolean {
  return readCustomEvents().some((e) => e.id === id);
}

export function addCustomEvent(event: Event): void {
  writeCustomEvents([...readCustomEvents(), event]);
}

export function updateCustomEvent(updated: Event): void {
  const all = readCustomEvents();
  const idx = all.findIndex((e) => e.id === updated.id);
  if (idx === -1) return;
  const next = [...all];
  next[idx] = updated;
  writeCustomEvents(next);
}

export const EVENT_TYPES: { value: NonNullable<Event["type"]>; label: string }[] = [
  { value: "tournament", label: "Tournament" },
  { value: "clinic", label: "Clinic" },
  { value: "social", label: "Social" },
  { value: "league", label: "League" },
];

export function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function formatEventTime(timeStr?: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m || "00"} ${ampm}`;
}
