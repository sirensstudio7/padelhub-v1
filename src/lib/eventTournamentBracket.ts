import type { Event } from "@/data/events";
import {
  buildBracketRoundsForTeams,
  getBracketSlotCount,
  parseTeamCountFromField,
} from "@/lib/knockoutBracket";

export function getTournamentBracketFromEvent(event: Event | null) {
  if (!event || event.type !== "tournament" || !event.teamsCount) return null;
  const n = parseTeamCountFromField(event.teamsCount);
  if (n == null) return null;
  return {
    rounds: buildBracketRoundsForTeams(n),
    slots: getBracketSlotCount(n),
    entered: n,
  };
}

/**
 * Parsed player/team cap from the tournament “how many teams” field. `null` means no fixed cap
 * (non-tournament, missing field, or unparsable).
 */
export function getTournamentRegistrationCapacity(event: Event | null): number | null {
  const tb = getTournamentBracketFromEvent(event);
  return tb ? tb.entered : null;
}
