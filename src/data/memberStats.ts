import { mockLeaderboard } from "./mockLeaderboard";

/** Count of registered members in demo data (replace with API when available). */
export function getRegisteredMemberCount(): number {
  return mockLeaderboard.length;
}

export type AdminMemberRow = {
  id: string;
  name: string;
  rank: number;
  points: number;
  isCurrentUser?: boolean;
};

export function getRegisteredMembersForAdmin(): AdminMemberRow[] {
  return mockLeaderboard.map((e) => ({
    id: e.id,
    name: e.name,
    rank: e.rank,
    points: e.points,
    isCurrentUser: e.isCurrentUser,
  }));
}
