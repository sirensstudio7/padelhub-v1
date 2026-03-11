import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardEntry } from "@/data/mockLeaderboard";

const TriangleUp = () => (
  <svg className="h-4 w-4 shrink-0 text-[#015f4d]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 4l8 16H4L12 4z" />
  </svg>
);
const TriangleDown = () => (
  <svg className="h-4 w-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 20l8-16H4l8 16z" />
  </svg>
);

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

const LeaderboardRow = ({ entry }: LeaderboardRowProps) => {
  return (
    <Link
      to={`/profile/${entry.id}`}
      className={`flex items-center gap-4 px-4 py-3 border border-border rounded-xl transition-colors hover:bg-[#c5dd00]/50 hover:border-[#c5dd00]/50 ${
        entry.isCurrentUser ? "bg-primary/10 border-primary/30" : "bg-card"
      }`}
    >
      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white font-['Space_Grotesk'] shrink-0 border border-border bg-black">
        {entry.rank}
      </span>
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={entry.avatarUrl} alt={entry.name} />
        <AvatarFallback className="bg-secondary text-muted-foreground text-xs font-['Space_Grotesk'] font-medium">
          {entry.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <span className="block text-sm text-foreground font-medium truncate">
          {entry.name}
          {entry.isCurrentUser && (
            <span className="ml-2 text-xs text-primary font-['Space_Grotesk']">YOU</span>
          )}
        </span>
        {entry.position && (
          <span className="block text-xs text-muted-foreground mt-0.5 capitalize">
            {entry.position} side
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-sm font-bold text-primary font-['Space_Grotesk']">
          {entry.points.toLocaleString()}
        </span>
        {entry.rankChange === "up" && <TriangleUp />}
        {entry.rankChange === "down" && <TriangleDown />}
      </div>
    </Link>
  );
};

export default LeaderboardRow;
