import type { BracketMatch, BracketRound } from "@/components/EventBracket";

/** First integer in the string, e.g. "16", "8 teams", "12 players" → 16, 8, 12 */
export function parseTeamCountFromField(input: string): number | null {
  const m = input.trim().match(/\d+/);
  if (!m) return null;
  const n = parseInt(m[0], 10);
  if (!Number.isFinite(n) || n < 2) return null;
  return Math.min(n, 128);
}

export function getBracketSlotCount(teamCount: number): number {
  return nextPowerOfTwo(Math.max(2, Math.min(teamCount, 128)));
}

function nextPowerOfTwo(n: number): number {
  let p = 2;
  while (p < n) p *= 2;
  return p;
}

function labelForRound(matchesInRound: number): { name: string; shortName: string } {
  switch (matchesInRound) {
    case 1:
      return { name: "Grand Final", shortName: "GF" };
    case 2:
      return { name: "Semifinals", shortName: "SF" };
    case 4:
      return { name: "Quarterfinals", shortName: "QF" };
    case 8:
      return { name: "Round of 16", shortName: "R16" };
    case 16:
      return { name: "Round of 32", shortName: "R32" };
    case 32:
      return { name: "Round of 64", shortName: "R64" };
    case 64:
      return { name: "Round of 128", shortName: "R128" };
    default:
      return {
        name: `${matchesInRound * 2} teams`,
        shortName: `R${matchesInRound * 2}`,
      };
  }
}

/**
 * Single-elimination bracket: team count is rounded up to the next power of 2 (byes implied).
 * Left column = first round (most matches), right = final.
 */
export function buildBracketRoundsForTeams(teamCount: number): BracketRound[] {
  const bracketSize = getBracketSlotCount(teamCount);
  const rounds: BracketRound[] = [];
  let matchesInRound = bracketSize / 2;
  let roundIdx = 0;

  while (matchesInRound >= 1) {
    const { name, shortName } = labelForRound(matchesInRound);
    const matches: BracketMatch[] = [];
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        id: `r${roundIdx}-m${i + 1}`,
        team1: "TBD",
        team2: "TBD",
      });
    }
    rounds.push({ name, shortName, matches });
    matchesInRound = Math.floor(matchesInRound / 2);
    roundIdx++;
  }

  return rounds;
}
