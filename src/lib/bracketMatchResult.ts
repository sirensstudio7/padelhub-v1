import type { BracketMatch, BracketRound } from "@/components/EventBracket";

export function cloneBracketRounds(rounds: BracketRound[]): BracketRound[] {
  return JSON.parse(JSON.stringify(rounds)) as BracketRound[];
}

export function isByeLabel(s: string): boolean {
  return s.trim().toUpperCase() === "BYE";
}

function isTbd(s: string): boolean {
  return s.trim() === "TBD" || s.trim() === "";
}

/**
 * Whether both slots are known (not TBD). BYE vs a name is valid.
 */
export function canRecordMatchResult(match: BracketMatch): boolean {
  const t1 = match.team1.trim();
  const t2 = match.team2.trim();
  if (isTbd(t1) || isTbd(t2)) return false;
  return true;
}

/** One side is BYE and the other is a real name — walkover, no play. */
export function isWalkoverByeMatch(match: BracketMatch): boolean {
  const t1 = match.team1.trim();
  const t2 = match.team2.trim();
  if (isTbd(t1) || isTbd(t2)) return false;
  return isByeLabel(t1) !== isByeLabel(t2);
}

/** Winning row for styling; null if undecided. */
export function getMatchWinningSide(match: BracketMatch): "team1" | "team2" | null {
  const t1 = match.team1.trim();
  const t2 = match.team2.trim();
  if (isTbd(t1) || isTbd(t2)) return null;
  if (isByeLabel(t1) && !isByeLabel(t2)) return "team2";
  if (isByeLabel(t2) && !isByeLabel(t1)) return "team1";
  if (isByeLabel(t1) && isByeLabel(t2)) return null;

  const s1 = match.score1;
  const s2 = match.score2;
  if (s1 === undefined || s2 === undefined) return null;
  if (s1 > s2) return "team1";
  if (s2 > s1) return "team2";
  return match.winnerSide ?? null;
}

export function resolveWinnerName(
  match: BracketMatch,
  tieBreaker?: "team1" | "team2"
): { name: string; side: "team1" | "team2" } | null {
  const merged: BracketMatch = {
    ...match,
    winnerSide: tieBreaker ?? match.winnerSide,
  };
  const side = getMatchWinningSide(merged);
  if (!side) return null;
  const name = side === "team1" ? match.team1.trim() : match.team2.trim();
  return { name, side };
}

/**
 * Sets scores (and optional tie-break), advances winner into the next round, clears downstream scores on that match.
 */
export function applyMatchResult(
  rounds: BracketRound[],
  roundIndex: number,
  matchIndex: number,
  score1: number,
  score2: number,
  tieBreaker?: "team1" | "team2"
): BracketRound[] {
  const next = cloneBracketRounds(rounds);
  const m = next[roundIndex]?.matches[matchIndex];
  if (!m) return rounds;

  m.score1 = score1;
  m.score2 = score2;
  if (score1 === score2 && tieBreaker) m.winnerSide = tieBreaker;
  else delete m.winnerSide;

  const resolved = resolveWinnerName(m, tieBreaker);
  if (!resolved) {
    throw new Error("Could not determine a winner. Check scores or pick a tie-break.");
  }

  if (roundIndex >= next.length - 1) return next;

  const nr = roundIndex + 1;
  const nm = Math.floor(matchIndex / 2);
  const top = matchIndex % 2 === 0;
  const target = next[nr]?.matches[nm];
  if (!target) return next;

  if (top) target.team1 = resolved.name;
  else target.team2 = resolved.name;

  delete target.score1;
  delete target.score2;
  delete target.winnerSide;

  return next;
}
