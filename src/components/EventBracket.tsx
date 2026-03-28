import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getMatchWinningSide } from "@/lib/bracketMatchResult";

export type BracketMatch = {
  id: string;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  /** When scores tie, which side advances (set by admin). */
  winnerSide?: "team1" | "team2";
};

export type BracketRound = {
  name: string;
  shortName?: string;
  matches: BracketMatch[];
};

const defaultBracket: BracketRound[] = [
  {
    name: "Quarterfinals",
    shortName: "UBQF",
    matches: [
      { id: "q1", team1: "TBD", team2: "TBD" },
      { id: "q2", team1: "TBD", team2: "TBD" },
      { id: "q3", team1: "TBD", team2: "TBD" },
      { id: "q4", team1: "TBD", team2: "TBD" },
    ],
  },
  {
    name: "Semifinals",
    shortName: "UBSF",
    matches: [
      { id: "s1", team1: "TBD", team2: "TBD" },
      { id: "s2", team1: "TBD", team2: "TBD" },
    ],
  },
  {
    name: "Grand Final",
    shortName: "GF",
    matches: [{ id: "f1", team1: "TBD", team2: "TBD" }],
  },
];

const MATCH_WIDTH = 160;
const OPPONENT_HEIGHT = 24;
/** Match card outer height (two rows + 1px top/bottom border) */
const MATCH_HEIGHT = OPPONENT_HEIGHT * 2 + 2;
const CONNECTOR_WIDTH = 24;
/** Space that was between round groups — bridged by the outgoing horizontal line */
const ROUND_GAP = 16;
const GAP_BETWEEN_MATCHES = 12;

/** SVG width: stem + line extending flush to the next round column (no flex gap between groups) */
const CONNECTOR_OUT_WIDTH = CONNECTOR_WIDTH + ROUND_GAP;

/** Vertical gap between matches in `roundIndex` so cells line up with connector midpoints from the previous round. */
function getMatchGapForRound(roundIndex: number): number {
  let g = GAP_BETWEEN_MATCHES;
  for (let i = 0; i < roundIndex; i++) {
    g = MATCH_HEIGHT + 2 * g;
  }
  return g;
}

/** Padding above a round’s match stack so the first cell centers on the incoming connector line. */
function getRoundMatchPaddingTop(roundIndex: number): number {
  let sum = 0;
  for (let i = 0; i < roundIndex; i++) {
    sum += (MATCH_HEIGHT + getMatchGapForRound(i)) / 2;
  }
  return sum;
}

function MatchCell({ match, className }: { match: BracketMatch; className?: string }) {
  const hasScore = match.score1 !== undefined && match.score2 !== undefined;
  const winSide = getMatchWinningSide(match);
  const row1Win = winSide === "team1";
  const row2Win = winSide === "team2";
  return (
    <div
      className={cn(
        "rounded border border-border bg-card overflow-hidden text-sm font-['Space_Grotesk']",
        className
      )}
      style={{ minWidth: MATCH_WIDTH }}
    >
      <div
        className={cn(
          "flex items-center justify-between px-2 border-b border-border",
          row1Win ? "bg-primary/15 font-semibold text-foreground" : "bg-muted/30"
        )}
        style={{ height: OPPONENT_HEIGHT }}
      >
        <span className="truncate flex-1">{match.team1}</span>
        {hasScore && (
          <span className="shrink-0 w-6 text-center text-muted-foreground tabular-nums">
            {match.score1}
          </span>
        )}
      </div>
      <div
        className={cn(
          "flex items-center justify-between px-2",
          row2Win ? "bg-primary/15 font-semibold text-foreground" : ""
        )}
        style={{ height: OPPONENT_HEIGHT }}
      >
        <span className="truncate flex-1">{match.team2}</span>
        {hasScore && (
          <span className="shrink-0 w-6 text-center text-muted-foreground tabular-nums">
            {match.score2}
          </span>
        )}
      </div>
    </div>
  );
}

/** Draws the Y-shaped connector: two lines from left (from two matches) merge into one line to the right */
function BracketConnectorBlock({ pairGap }: { pairGap: number }) {
  const wStem = CONNECTOR_WIDTH;
  const wOut = CONNECTOR_OUT_WIDTH;
  const h = MATCH_HEIGHT * 2 + pairGap;
  const half = wStem / 2;
  const y1 = MATCH_HEIGHT / 2; // center of first match
  const y2 = MATCH_HEIGHT + pairGap + MATCH_HEIGHT / 2; // center of second match
  const yMid = (y1 + y2) / 2;

  return (
    <div
      className="shrink-0 flex items-center text-border"
      style={{ width: wOut, height: h }}
      aria-hidden
    >
      <svg width={wOut} height={h} className="overflow-visible" stroke="currentColor" strokeWidth="2" fill="none">
        {/* top match: horizontal from left to middle */}
        <line x1={0} y1={y1} x2={half} y2={y1} />
        {/* vertical from top to center */}
        <line x1={half} y1={y1} x2={half} y2={yMid} />
        {/* center to right edge — meets next round MatchCell (outer flex gap-0) */}
        <line x1={half} y1={yMid} x2={wOut} y2={yMid} />
        {/* vertical from center to bottom */}
        <line x1={half} y1={yMid} x2={half} y2={y2} />
        {/* bottom match: horizontal from middle to left */}
        <line x1={half} y1={y2} x2={0} y2={y2} />
      </svg>
    </div>
  );
}

export default function EventBracket({
  rounds = defaultBracket,
  scoreActionSlot,
}: {
  rounds?: BracketRound[];
  scoreActionSlot?: (ctx: {
    roundIndex: number;
    matchIndex: number;
    match: BracketMatch;
  }) => ReactNode;
}) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-start min-w-max gap-0" style={{ paddingRight: ROUND_GAP }}>
        {rounds.map((round, roundIndex) => {
          const nextRound = rounds[roundIndex + 1];
          const hasConnector = nextRound != null;
          const connectorBlockCount = hasConnector ? nextRound.matches.length : 0;
          const matchGap = getMatchGapForRound(roundIndex);

          const matchStackPaddingTop = getRoundMatchPaddingTop(roundIndex);

          return (
            <div key={round.name} className="flex flex-col gap-2 shrink-0">
              <div
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-['Space_Grotesk'] mb-1"
                style={{ marginLeft: 2 }}
              >
                {round.shortName ?? round.name}
              </div>
              {/* Matches and outgoing connectors share paddingTop so every round lines up (8 → 128 teams). */}
              <div className="flex items-start gap-0" style={{ paddingTop: matchStackPaddingTop }}>
                <div className="flex flex-col" style={{ gap: matchGap }}>
                  {round.matches.map((match, matchIndex) => (
                    <div
                      key={match.id}
                      className="flex shrink-0 items-center gap-2"
                    >
                      <MatchCell match={match} />
                      {scoreActionSlot ? (
                        <div className="pointer-events-auto shrink-0 self-center">
                          {scoreActionSlot({ roundIndex, matchIndex, match })}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
                {hasConnector && (
                  <div className="flex flex-col shrink-0" style={{ gap: matchGap }}>
                    {Array.from({ length: connectorBlockCount }).map((_, i) => (
                      <BracketConnectorBlock key={i} pairGap={matchGap} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
