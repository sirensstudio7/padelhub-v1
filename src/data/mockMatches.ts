export interface MatchDetail {
  id: string;
  title: string;
  subtitle: string;
  isLive: boolean;
  clubId?: string;
  player1Name: string;
  player1Rank: string;
  player1Flag?: string;
  player2Name: string;
  player2Rank: string;
  player2Flag?: string;
  setScore: string;
  currentSet: number;
  pointScoreLeft: string;
  pointScoreRight: string;
  gameCountLeft: number;
  gameCountRight: number;
  setScores: { set: number; p1: string; p2: string }[];
  duration: string;
  setDurations: string[];
  commentatorName: string;
  commentatorAvatar?: string;
  audioDuration: string;
}

const mockMatchDetails: Record<string, MatchDetail> = {
  "1": {
    id: "1",
    title: "Club Championship",
    subtitle: "Semi-final · Court #1",
    isLive: true,
    player1Name: "You & Partner",
    player1Rank: "Club: 4",
    player2Name: "Jessica K. & David C.",
    player2Rank: "Club: 2",
    setScore: "2 : 0",
    currentSet: 3,
    pointScoreLeft: "40",
    pointScoreRight: "30",
    gameCountLeft: 1,
    gameCountRight: 2,
    setScores: [
      { set: 1, p1: "4", p2: "6" },
      { set: 2, p1: "7⁷", p2: "6⁵" },
      { set: 3, p1: "1", p2: "2" },
    ],
    duration: "1:59",
    setDurations: ["38'", "53'", "19'"],
    commentatorName: "Martin Tyler",
    audioDuration: "81'",
    clubId: "1",
  },
  "2": {
    id: "2",
    title: "Prime Series",
    subtitle: "Quarter-final · Court #2",
    isLive: false,
    player1Name: "You & Partner",
    player1Rank: "Club: 4",
    player2Name: "Alexander M. & Sarah W.",
    player2Rank: "Club: 1",
    setScore: "1 : 2",
    currentSet: 3,
    pointScoreLeft: "30",
    pointScoreRight: "40",
    gameCountLeft: 4,
    gameCountRight: 5,
    setScores: [
      { set: 1, p1: "6", p2: "4" },
      { set: 2, p1: "4", p2: "6" },
      { set: 3, p1: "4", p2: "6" },
    ],
    duration: "2:12",
    setDurations: ["45'", "52'", "35'"],
    commentatorName: "Martin Tyler",
    audioDuration: "92'",
    clubId: "1",
  },
  "3": {
    id: "3",
    title: "Club Championship",
    subtitle: "Round of 16 · Court #1",
    isLive: false,
    player1Name: "You & Partner",
    player1Rank: "Club: 4",
    player2Name: "Elena R. & James P.",
    player2Rank: "Club: 6",
    setScore: "2 : 0",
    currentSet: 2,
    pointScoreLeft: "—",
    pointScoreRight: "—",
    gameCountLeft: 6,
    gameCountRight: 1,
    setScores: [
      { set: 1, p1: "6", p2: "2" },
      { set: 2, p1: "6", p2: "1" },
    ],
    duration: "1:15",
    setDurations: ["38'", "37'"],
    commentatorName: "Martin Tyler",
    audioDuration: "75'",
    clubId: "1",
  },
};

export function getMatchDetail(matchId: string): MatchDetail | null {
  return mockMatchDetails[matchId] ?? null;
}

export function getMatchesForClub(clubId: string): MatchDetail[] {
  return Object.values(mockMatchDetails).filter((m) => m.clubId === clubId);
}
