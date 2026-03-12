import { cn } from "@/lib/utils";

export type BracketMatch = {
  id: string;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
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
const MATCH_HEIGHT = 48; // OPPONENT_HEIGHT * 2
const OPPONENT_HEIGHT = 24;
const CONNECTOR_WIDTH = 24;
const ROUND_GAP = 16;
const GAP_BETWEEN_MATCHES = 12;

// Height of one "connector block" = two matches + gap between them (aligns with two match rows)
const CONNECTOR_BLOCK_HEIGHT = MATCH_HEIGHT * 2 + GAP_BETWEEN_MATCHES;

function MatchCell({ match, className }: { match: BracketMatch; className?: string }) {
  const hasScore = match.score1 !== undefined && match.score2 !== undefined;
  return (
    <div
      className={cn(
        "rounded border border-border bg-card overflow-hidden text-sm font-['Space_Grotesk']",
        className
      )}
      style={{ minWidth: MATCH_WIDTH }}
    >
      <div
        className="flex items-center justify-between px-2 border-b border-border bg-muted/30"
        style={{ height: OPPONENT_HEIGHT }}
      >
        <span className="truncate flex-1 text-foreground">{match.team1}</span>
        {hasScore && (
          <span className="shrink-0 w-6 text-center text-muted-foreground tabular-nums">
            {match.score1}
          </span>
        )}
      </div>
      <div
        className="flex items-center justify-between px-2"
        style={{ height: OPPONENT_HEIGHT }}
      >
        <span className="truncate flex-1 text-foreground">{match.team2}</span>
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
function BracketConnectorBlock() {
  const w = CONNECTOR_WIDTH;
  const h = CONNECTOR_BLOCK_HEIGHT;
  const half = w / 2;
  const y1 = MATCH_HEIGHT / 2; // center of first match
  const y2 = MATCH_HEIGHT + GAP_BETWEEN_MATCHES + MATCH_HEIGHT / 2; // center of second match
  const yMid = (y1 + y2) / 2;

  return (
    <div
      className="shrink-0 flex items-center text-border"
      style={{ width: w, height: h }}
      aria-hidden
    >
      <svg width={w} height={h} className="overflow-visible" stroke="currentColor" strokeWidth="2" fill="none">
        {/* top match: horizontal from left to middle */}
        <line x1={0} y1={y1} x2={half} y2={y1} />
        {/* vertical from top to center */}
        <line x1={half} y1={y1} x2={half} y2={yMid} />
        {/* center to right (connects to next round match) */}
        <line x1={half} y1={yMid} x2={w} y2={yMid} />
        {/* vertical from center to bottom */}
        <line x1={half} y1={yMid} x2={half} y2={y2} />
        {/* bottom match: horizontal from middle to left */}
        <line x1={half} y1={y2} x2={0} y2={y2} />
      </svg>
    </div>
  );
}

export default function EventBracket({ rounds = defaultBracket }: { rounds?: BracketRound[] }) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-start min-w-max gap-4" style={{ paddingRight: ROUND_GAP }}>
        {rounds.map((round, roundIndex) => {
          const nextRound = rounds[roundIndex + 1];
          const hasConnector = nextRound != null;
          const connectorBlockCount = hasConnector ? nextRound.matches.length : 0;

          return (
            <div key={round.name} className="flex items-start shrink-0 gap-0">
              {/* Round column */}
              <div className="flex flex-col gap-2 shrink-0">
                <div
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-['Space_Grotesk'] mb-1"
                  style={{ marginLeft: 2 }}
                >
                  {round.shortName ?? round.name}
                </div>
                <div className="flex flex-col gap-3">
                  {round.matches.map((match) => (
                    <div key={match.id} className="flex items-center">
                      <MatchCell match={match} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector column between this round and the next */}
              {hasConnector && (
                <div
                  className="flex flex-col shrink-0 pt-6"
                  style={{ gap: GAP_BETWEEN_MATCHES }}
                >
                  {Array.from({ length: connectorBlockCount }).map((_, i) => (
                    <BracketConnectorBlock key={i} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
