import { useParams, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Bookmark01Icon,
  Share01Icon,
  PlayIcon,
  HeadphonesIcon,
} from "@hugeicons/core-free-icons";
import { getMatchDetail } from "@/data/mockMatches";
import RevealSection from "@/components/RevealSection";
import NotFound from "./NotFound";

const MatchDetail = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const match = matchId ? getMatchDetail(matchId) : null;

  if (!match) {
    return <NotFound />;
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      {/* Header: back left, share right */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 -ml-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Share"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <HugeiconsIcon icon={Share01Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        <RevealSection>
        {match.isLive && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 text-white px-3 py-1.5 mb-3">
            <HugeiconsIcon icon={HeadphonesIcon} size={18} color="currentColor" strokeWidth={1.5} />
            <span className="text-sm font-semibold font-['Space_Grotesk']">LIVE</span>
          </div>
        )}

        <h1 className="text-2xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight">
          {match.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-['Space_Grotesk']">
          {match.subtitle}
        </p>

        <div className="flex items-center justify-between gap-4 mt-6">
          <div className="flex-1 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center text-lg font-bold text-foreground font-['Space_Grotesk'] shrink-0">
              {match.player1Name.split(" ")[0].charAt(0)}
            </div>
          </div>
          <div className="text-center shrink-0">
            <span className="text-3xl font-bold text-foreground font-['Space_Grotesk']">
              {match.setScore}
            </span>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center text-lg font-bold text-foreground font-['Space_Grotesk'] shrink-0">
              {match.player2Name.split(" ")[0].charAt(0)}
            </div>
          </div>
        </div>

        {/* Current set label */}
        <p className="text-sm font-bold text-red-600 text-center mt-2 font-['Space_Grotesk']">
          {match.currentSet}rd set
        </p>

        {/* Point score boxes: 40 | 30 */}
        <div className="flex justify-center gap-2 mt-2">
          <div className="w-14 h-10 rounded border border-border bg-card flex items-center justify-center text-sm font-semibold text-foreground font-['Space_Grotesk']">
            {match.pointScoreLeft}
          </div>
          <div className="w-14 h-10 rounded border border-border bg-card flex items-center justify-center text-sm font-semibold text-foreground font-['Space_Grotesk']">
            {match.pointScoreRight}
          </div>
        </div>

        {/* Game count boxes: 1 | 2 */}
        <div className="flex justify-center gap-2 mt-2">
          <div className="w-14 h-8 rounded border border-border bg-card flex items-center justify-center text-xs font-semibold text-foreground font-['Space_Grotesk']">
            {match.gameCountLeft}
          </div>
          <div className="w-14 h-8 rounded border border-border bg-card flex items-center justify-center text-xs font-semibold text-foreground font-['Space_Grotesk']">
            {match.gameCountRight}
          </div>
        </div>

        {/* Player info cards: overlapping lower */}
        <div className="flex justify-center gap-2 mt-4 -mx-2">
          <div className="flex-1 max-w-[160px] rounded-xl border border-border bg-card p-3 shadow-sm">
            <p className="text-xs text-muted-foreground font-['Space_Grotesk']">Team 1</p>
            <p className="text-sm font-semibold text-foreground font-['Space_Grotesk'] truncate mt-0.5">
              {match.player1Name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 font-['Space_Grotesk']">
              {match.player1Rank}
            </p>
          </div>
          <div className="flex-1 max-w-[160px] rounded-xl border border-border bg-card p-3 shadow-sm">
            <p className="text-xs text-muted-foreground font-['Space_Grotesk']">Team 2</p>
            <p className="text-sm font-semibold text-foreground font-['Space_Grotesk'] truncate mt-0.5">
              {match.player2Name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 font-['Space_Grotesk']">
              {match.player2Rank}
            </p>
          </div>
        </div>

        {/* Action row: bookmark, LIVE, BET, share */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button type="button" aria-label="Bookmark" className="p-2 text-muted-foreground hover:text-foreground">
            <HugeiconsIcon icon={Bookmark01Icon} size={22} color="currentColor" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold font-['Space_Grotesk']"
          >
            LIVE
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-semibold font-['Space_Grotesk']"
          >
            BET
          </button>
          <button type="button" aria-label="Share" className="p-2 text-muted-foreground hover:text-foreground">
            <HugeiconsIcon icon={Share01Icon} size={22} color="currentColor" strokeWidth={1.5} />
          </button>
        </div>

        {/* Set scores table: same layout as reference - col 1 = "1", then set scores, then point score */}
        <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm font-['Space_Grotesk'] border-collapse">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left font-medium p-3 w-8"></th>
                {match.setScores.map((s) => (
                  <th key={s.set} className="text-center font-medium p-3">
                    {s.set}
                  </th>
                ))}
                <th className="text-center font-medium p-3">Pt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 font-medium text-foreground truncate max-w-[120px]">
                  {match.player1Name}
                </td>
                {match.setScores.map((s) => (
                  <td key={s.set} className="text-center font-semibold text-foreground p-3">
                    {s.p1}
                  </td>
                ))}
                <td className="text-center font-semibold text-foreground p-3">
                  {match.pointScoreLeft}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground truncate max-w-[120px]">
                  {match.player2Name}
                </td>
                {match.setScores.map((s) => (
                  <td key={s.set} className="text-center font-semibold text-foreground p-3">
                    {s.p2}
                  </td>
                ))}
                <td className="text-center font-semibold text-foreground p-3">
                  {match.pointScoreRight}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground font-['Space_Grotesk']">
          <span>Duration: {match.duration}</span>
          <div className="flex gap-2">
            {match.setDurations.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
        </div>

        {/* Audio commentary card */}
        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-muted shrink-0 flex items-center justify-center text-sm font-bold text-foreground">
                M
              </div>
              <span className="text-sm font-medium text-foreground font-['Space_Grotesk'] truncate">
                {match.commentatorName} &gt;
              </span>
            </div>
            <button type="button" aria-label="Share" className="p-1.5 text-muted-foreground shrink-0">
              <HugeiconsIcon icon={Share01Icon} size={18} color="currentColor" strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              aria-label="Play"
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0"
            >
              <HugeiconsIcon icon={PlayIcon} size={20} color="currentColor" strokeWidth={1.5} />
            </button>
            <div className="flex-1 h-8 rounded bg-muted/60 flex items-center px-2">
              <div className="h-1.5 w-full max-w-[80%] rounded-full bg-primary/40" />
            </div>
            <span className="text-xs font-semibold text-red-600 font-['Space_Grotesk'] shrink-0">
              {match.audioDuration}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border">
            <button type="button" aria-label="Bookmark" className="p-1.5 text-muted-foreground">
              <HugeiconsIcon icon={Bookmark01Icon} size={18} color="currentColor" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded bg-red-600 text-white text-xs font-semibold font-['Space_Grotesk']"
            >
              LIVE
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded border border-border text-foreground text-xs font-semibold font-['Space_Grotesk']"
            >
              1X2
            </button>
            <button type="button" aria-label="Share" className="p-1.5 text-muted-foreground">
              <HugeiconsIcon icon={Share01Icon} size={18} color="currentColor" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        </RevealSection>
      </div>
    </div>
  );
};

export default MatchDetail;
