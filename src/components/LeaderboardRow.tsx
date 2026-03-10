import { LeaderboardEntry } from "@/data/mockLeaderboard";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

const LeaderboardRow = ({ entry }: LeaderboardRowProps) => {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 border border-border ${
        entry.isCurrentUser ? "bg-primary/10 border-primary/30" : "bg-card"
      }`}
    >
      <span className="w-8 text-center text-sm font-bold text-muted-foreground font-['Space_Grotesk']">
        {entry.rank}
      </span>
      <div className="w-10 h-10 bg-secondary flex items-center justify-center shrink-0">
        <span className="text-xs text-muted-foreground font-['Space_Grotesk'] font-medium">
          {entry.name.charAt(0)}
        </span>
      </div>
      <span className="flex-1 text-sm text-foreground font-medium truncate">
        {entry.name}
        {entry.isCurrentUser && (
          <span className="ml-2 text-xs text-primary font-['Space_Grotesk']">YOU</span>
        )}
      </span>
      <span className="text-sm font-bold text-primary font-['Space_Grotesk']">
        {entry.points.toLocaleString()}
      </span>
    </div>
  );
};

export default LeaderboardRow;
