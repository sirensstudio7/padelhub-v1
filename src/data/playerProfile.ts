import { mockLeaderboard } from "./mockLeaderboard";
import type { LeaderboardEntry } from "./mockLeaderboard";
import { mockClubs } from "./mockClubs";
import type { Club } from "./mockClubs";

export function getMembersByClubName(clubName: string): LeaderboardEntry[] {
  return mockLeaderboard.filter((e) => getPlayerProfile(e.id)?.clubJoined === clubName);
}

export interface ClubRankingEntry extends Club {
  totalPoints: number;
  rank: number;
}

export function getClubRanking(): ClubRankingEntry[] {
  const withPoints = mockClubs.map((club) => ({
    ...club,
    totalPoints: getMembersByClubName(club.name).reduce((sum, e) => sum + e.points, 0),
  }));
  withPoints.sort((a, b) => b.totalPoints - a.totalPoints);
  return withPoints.map((c, i) => ({ ...c, rank: i + 1 }));
}


export function getCurrentUserId(): string | null {
  const current = mockLeaderboard.find((e) => e.isCurrentUser);
  return current?.id ?? null;
}

export interface PlayerProfile {
  id: string;
  name: string;
  points: number;
  rank: number;
  handle: string;
  level: number;
  levelProgress: number;
  levelMultiplier: number;
  dayStreak: number;
  top3Finishes: number;
  gems: number;
  cardsToUnlock: number;
  isCurrentUser?: boolean;
  avatarUrl?: string;
  position?: "left" | "right";
  location?: string;
  tiktok?: string;
  instagram?: string;
  clubJoined?: string;
  clubLogoUrl?: string;
}

const levelMultipliers: Record<number, number> = {
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
  6: 1,
};

function generateHandle(name: string, id: string): string {
  const chars = (name.replace(/\s/g, "").toUpperCase() + id).slice(0, 5);
  return chars.padEnd(5, "X").slice(0, 5);
}

export function getPlayerProfile(userId: string): PlayerProfile | null {
  const entry = mockLeaderboard.find((e) => e.id === userId);
  if (!entry) return null;

  const level = Math.min(6, Math.max(1, Math.floor(entry.rank / 2) + 1));
  const levelProgress = entry.rank <= 3 ? 85 + entry.rank * 5 : 40 + (10 - entry.rank) * 6;

  const mockLocations: Record<string, string> = {
    "1": "Barcelona",
    "2": "Madrid",
    "3": "Valencia",
    "4": "Seville",
    "5": "Bilbao",
    "6": "Málaga",
    "7": "Alicante",
    "8": "Madrid",
    "9": "Barcelona",
    "10": "Valencia",
    "11": "Barcelona",
    "12": "Madrid",
    "13": "Valencia",
    "14": "Seville",
    "15": "Bilbao",
  };
  const mockSocials: Record<string, { tiktok: string; instagram: string }> = {
    "1": { tiktok: "@alexmart", instagram: "@alexmart" },
    "2": { tiktok: "@jesskim", instagram: "@jesskim" },
    "3": { tiktok: "@davidchen", instagram: "@davidchen" },
    "4": { tiktok: "@sarahw", instagram: "@sarahwilson" },
    "5": { tiktok: "@marcusj", instagram: "@marcusj" },
    "6": { tiktok: "@elenar", instagram: "@elenar" },
    "7": { tiktok: "@jamespark", instagram: "@jamespark" },
    "8": { tiktok: "@oliviab", instagram: "@oliviabrown" },
    "9": { tiktok: "@ryanth", instagram: "@ryanthompson" },
    "10": { tiktok: "@sophialee", instagram: "@sophialee" },
    "11": { tiktok: "@danielkim", instagram: "@danielkim" },
    "12": { tiktok: "@emmadavis", instagram: "@emmadavis" },
    "13": { tiktok: "@liamw", instagram: "@liamwilson" },
    "14": { tiktok: "@avam", instagram: "@avamartinez" },
    "15": { tiktok: "@noaht", instagram: "@noahtaylor" },
  };
  const socials = mockSocials[entry.id] ?? { tiktok: "", instagram: "" };
  const mockClubsJoined: Record<string, string> = {
    "1": "Padel Hub Society",
    "2": "Serve\nSide",
    "3": "Selasa Padel",
    "4": "Court Masters",
    "5": "Racket Republic",
    "6": "Padel Hub Society",
    "7": "Serve\nSide",
    "8": "Selasa Padel",
    "9": "Court Masters",
    "10": "Racket Republic",
    "11": "Padel Hub Society",
    "12": "Serve\nSide",
    "13": "Selasa Padel",
    "14": "Court Masters",
    "15": "Racket Republic",
  };

  return {
    id: entry.id,
    name: entry.name,
    points: entry.points,
    rank: entry.rank,
    handle: generateHandle(entry.name, entry.id),
    level,
    levelProgress: Math.min(100, levelProgress),
    levelMultiplier: levelMultipliers[level] ?? 6,
    dayStreak: entry.rank <= 5 ? 3 : entry.rank <= 8 ? 1 : 0,
    top3Finishes: entry.rank <= 3 ? 5 - entry.rank : 0,
    gems: (levelMultipliers[level] ?? 6) * 1,
    cardsToUnlock: 32,
    isCurrentUser: entry.isCurrentUser,
    avatarUrl: entry.avatarUrl,
    position: entry.position,
    location: mockLocations[entry.id] ?? "—",
    tiktok: socials.tiktok || undefined,
    instagram: socials.instagram || undefined,
    clubJoined: mockClubsJoined[entry.id] ?? undefined,
    clubLogoUrl: (() => {
      const name = mockClubsJoined[entry.id];
      if (!name) return undefined;
      const club = mockClubs.find((c) => c.name === name);
      return club?.imageUrl;
    })(),
  };
}
