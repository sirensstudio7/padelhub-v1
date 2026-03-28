import type { BracketMatch, BracketRound } from "@/components/EventBracket";
import type { EventRegistration } from "@/data/eventRegistrations";

function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

export function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const t = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = t;
  }
}

/** Oldest sign-ups first, then pad with BYE up to bracket slot count. */
export function pickTeamLabelsForBracketSlots(
  registrations: EventRegistration[],
  bracketSlotCount: number
): string[] {
  const sorted = [...registrations].sort(
    (a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
  );
  const out = sorted.slice(0, bracketSlotCount).map((r) => r.name.trim() || "Player");
  while (out.length < bracketSlotCount) out.push("BYE");
  return out;
}

function applyFirstRoundLabels(
  templateRounds: BracketRound[],
  participantLabels: string[],
  shuffle: boolean
): BracketRound[] {
  if (templateRounds.length === 0) return templateRounds;
  const first = templateRounds[0];
  const slotsNeeded = first.matches.length * 2;
  const labels = participantLabels.slice(0, slotsNeeded);
  while (labels.length < slotsNeeded) labels.push("BYE");
  if (shuffle) shuffleInPlace(labels);

  const newMatches: BracketMatch[] = first.matches.map((m, i) => ({
    ...m,
    team1: labels[i * 2] ?? "TBD",
    team2: labels[i * 2 + 1] ?? "TBD",
  }));

  return [{ ...first, matches: newMatches }, ...templateRounds.slice(1)];
}

/**
 * Registration order (after pickTeamLabelsForBracketSlots); later rounds stay TBD.
 */
export function applySequentialFirstRound(
  templateRounds: BracketRound[],
  participantLabels: string[]
): BracketRound[] {
  return applyFirstRoundLabels(templateRounds, participantLabels, false);
}

/**
 * Randomly assigns teams to the first round; later rounds stay TBD.
 */
export function applyRandomFirstRound(
  templateRounds: BracketRound[],
  participantLabels: string[]
): BracketRound[] {
  return applyFirstRoundLabels(templateRounds, participantLabels, true);
}

/**
 * Stored admin draw wins; otherwise fill round 1 from registrations (sign-up order, then BYE).
 * With no registrations, returns the template (TBD).
 */
export function getTournamentBracketDisplayRounds(
  templateRounds: BracketRound[],
  storedDraw: BracketRound[] | null,
  registrations: EventRegistration[],
  bracketSlotCount: number
): BracketRound[] {
  if (storedDraw) return storedDraw;
  if (registrations.length === 0) return templateRounds;
  const labels = pickTeamLabelsForBracketSlots(registrations, bracketSlotCount);
  return applySequentialFirstRound(templateRounds, labels);
}
