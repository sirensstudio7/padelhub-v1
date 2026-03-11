export type PadelPosition = "left" | "right";
export type RankChange = "up" | "down";

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
  avatarUrl?: string;
  position?: PadelPosition;
  rankChange?: RankChange;
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: "1", name: "Alexander Martinez", points: 24580, rank: 1, avatarUrl: "https://i.pravatar.cc/80?u=1", position: "left" },
  { id: "2", name: "Jessica Kim", points: 22340, rank: 2, avatarUrl: "https://i.pravatar.cc/80?u=2", position: "right", rankChange: "down" },
  { id: "3", name: "David Chen", points: 21100, rank: 3, avatarUrl: "https://i.pravatar.cc/80?u=3", position: "left", rankChange: "up" },
  { id: "4", name: "Sarah Wilson", points: 19870, rank: 4, avatarUrl: "https://i.pravatar.cc/80?u=4", position: "right", rankChange: "up" },
  { id: "5", name: "Marcus Johnson", points: 18650, rank: 5, avatarUrl: "https://i.pravatar.cc/80?u=5", position: "left", rankChange: "down" },
  { id: "6", name: "Elena Rodriguez", points: 17420, rank: 6, avatarUrl: "https://i.pravatar.cc/80?u=6", position: "right", rankChange: "up" },
  { id: "7", name: "James Park", points: 16200, rank: 7, avatarUrl: "https://i.pravatar.cc/80?u=7", position: "left", rankChange: "down" },
  { id: "8", name: "Olivia Brown", points: 14980, rank: 8, isCurrentUser: true, avatarUrl: "https://i.pravatar.cc/80?u=8", position: "right", rankChange: "up" },
  { id: "9", name: "Ryan Thompson", points: 13750, rank: 9, avatarUrl: "https://i.pravatar.cc/80?u=9", position: "left", rankChange: "down" },
  { id: "10", name: "Sophia Lee", points: 12530, rank: 10, avatarUrl: "https://i.pravatar.cc/80?u=10", position: "right", rankChange: "up" },
  { id: "11", name: "Daniel Kim", points: 11300, rank: 11, avatarUrl: "https://i.pravatar.cc/80?u=11", position: "left", rankChange: "down" },
  { id: "12", name: "Emma Davis", points: 10080, rank: 12, avatarUrl: "https://i.pravatar.cc/80?u=12", position: "right", rankChange: "up" },
  { id: "13", name: "Liam Wilson", points: 9880, rank: 13, avatarUrl: "https://i.pravatar.cc/80?u=13", position: "left", rankChange: "down" },
  { id: "14", name: "Ava Martinez", points: 9650, rank: 14, avatarUrl: "https://i.pravatar.cc/80?u=14", position: "right", rankChange: "up" },
  { id: "15", name: "Noah Taylor", points: 9420, rank: 15, avatarUrl: "https://i.pravatar.cc/80?u=15", position: "left", rankChange: "down" },
];
