export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: "1", name: "Alexander M.", points: 24580, rank: 1 },
  { id: "2", name: "Jessica K.", points: 22340, rank: 2 },
  { id: "3", name: "David Chen", points: 21100, rank: 3 },
  { id: "4", name: "Sarah Wilson", points: 19870, rank: 4 },
  { id: "5", name: "Marcus J.", points: 18650, rank: 5 },
  { id: "6", name: "Elena Rodriguez", points: 17420, rank: 6 },
  { id: "7", name: "James Park", points: 16200, rank: 7 },
  { id: "8", name: "Olivia Brown", points: 14980, rank: 8, isCurrentUser: true },
  { id: "9", name: "Ryan Thompson", points: 13750, rank: 9 },
  { id: "10", name: "Sophia Lee", points: 12530, rank: 10 },
  { id: "11", name: "Daniel Kim", points: 11300, rank: 11 },
  { id: "12", name: "Emma Davis", points: 10080, rank: 12 },
];
