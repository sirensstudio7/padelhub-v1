export interface Club {
  id: string;
  name: string;
  memberCount: number;
  location?: string;
  imageUrl?: string;
  description?: string;
  courts?: number;
}

export function getClubById(id: string): Club | null {
  return mockClubs.find((c) => c.id === id) ?? null;
}

export function getClubByName(name: string): Club | null {
  return mockClubs.find((c) => c.name === name) ?? null;
}

export const mockClubs: Club[] = [
  { id: "1", name: "Padel Hub Society", memberCount: 124, location: "Downtown", imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=80&h=80&fit=crop", description: "Premier padel facility in the heart of the city. Open daily with coaching and social events.", courts: 6 },
  { id: "2", name: "Serve\nSide", memberCount: 89, location: "North Side", imageUrl: "https://images.unsplash.com/photo-1622163642998-1ee2a1d2a5f2?w=80&h=80&fit=crop", description: "Friendly club with a focus on leagues and tournaments.", courts: 4 },
  { id: "3", name: "Selasa Padel", memberCount: 156, location: "West End", imageUrl: "https://images.unsplash.com/photo-1595435934249-5d17d4a1d6f2?w=80&h=80&fit=crop", description: "Largest club in the region. Night lighting and indoor options.", courts: 8 },
  { id: "4", name: "Court Masters", memberCount: 67, location: "East District", imageUrl: "https://images.unsplash.com/photo-1617083274690-970a4b7380f0?w=80&h=80&fit=crop", description: "Boutique courts with premium surfaces and equipment.", courts: 3 },
  { id: "5", name: "Racket Republic", memberCount: 203, location: "Central", imageUrl: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=80&h=80&fit=crop", description: "All-in-one sports hub with padel, tennis and fitness.", courts: 10 },
];
