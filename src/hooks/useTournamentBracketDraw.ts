import { useCallback, useEffect, useState } from "react";
import type { BracketRound } from "@/components/EventBracket";
import { getTournamentBracketDraw } from "@/data/tournamentBracketDraw";

/**
 * Live-updating stored draw for an event (must match current template first-round size).
 */
export function useTournamentBracketDraw(
  eventId: string | undefined,
  templateRounds: BracketRound[] | null
): BracketRound[] | null {
  const templateMatchCount = templateRounds?.[0]?.matches.length ?? 0;

  const read = useCallback((): BracketRound[] | null => {
    if (!eventId || templateMatchCount === 0) return null;
    return getTournamentBracketDraw(eventId, templateMatchCount);
  }, [eventId, templateMatchCount]);

  const [draw, setDraw] = useState<BracketRound[] | null>(() => read());

  useEffect(() => {
    setDraw(read());
  }, [read]);

  useEffect(() => {
    const sync = () => setDraw(read());
    window.addEventListener("padelhub-tournament-bracket-draw-changed", sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "padelhub_tournament_bracket_draw") sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("padelhub-tournament-bracket-draw-changed", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [read]);

  return draw;
}
