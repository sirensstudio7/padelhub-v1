export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  location: string;
  venue: string;
  type?: "tournament" | "clinic" | "social" | "league";
  imageUrl?: string;
  description?: string;
}

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

export function getEventById(id: string): Event | null {
  return upcomingEvents.find((e) => e.id === id) ?? null;
}

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
