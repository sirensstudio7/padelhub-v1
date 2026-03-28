import type { BracketRound } from "@/components/EventBracket";

const STORAGE_KEY = "padelhub_tournament_bracket_draw";

type Stored = Record<
  string,
  {
    rounds: BracketRound[];
    /** Hash so we invalidate if bracket shape changes */
    firstRoundMatchCount: number;
  }
>;

function readAll(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Stored;
  } catch {
    return {};
  }
}

function writeAll(data: Stored): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota */
  }
  window.dispatchEvent(new CustomEvent("padelhub-tournament-bracket-draw-changed"));
}

export function getTournamentBracketDraw(
  eventId: string,
  templateFirstRoundMatches: number
): BracketRound[] | null {
  const row = readAll()[eventId];
  if (!row || !Array.isArray(row.rounds) || row.rounds.length === 0) return null;
  if (row.firstRoundMatchCount !== templateFirstRoundMatches) return null;
  const first = row.rounds[0];
  if (!first?.matches || first.matches.length !== templateFirstRoundMatches) return null;
  return row.rounds;
}

export function setTournamentBracketDraw(eventId: string, rounds: BracketRound[]): void {
  const first = rounds[0];
  const n = first?.matches?.length ?? 0;
  const all = readAll();
  all[eventId] = { rounds, firstRoundMatchCount: n };
  writeAll(all);
}

export function clearTournamentBracketDraw(eventId: string): void {
  const all = readAll();
  delete all[eventId];
  writeAll(all);
}
