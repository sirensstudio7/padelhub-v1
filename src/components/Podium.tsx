import { LeaderboardEntry } from "@/data/mockLeaderboard";

const GeometricAvatar = ({ rank, size = "md" }: { rank: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const shapes: Record<number, string> = {
    1: "clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    2: "clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    3: "clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-secondary flex items-center justify-center`}
      style={{ clipPath: rank === 1 ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" : rank === 2 ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" : "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
    >
      <span className="text-muted-foreground font-bold font-['Space_Grotesk']">{rank}</span>
    </div>
  );
};

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

const Podium = ({ topThree }: PodiumProps) => {
  const [first, second, third] = [
    topThree.find((e) => e.rank === 1),
    topThree.find((e) => e.rank === 2),
    topThree.find((e) => e.rank === 3),
  ];

  if (!first || !second || !third) return null;

  return (
    <div className="flex items-end justify-center gap-4 px-4 py-8">
      {/* 2nd place */}
      <div className="flex flex-col items-center gap-2 pb-0">
        <GeometricAvatar rank={2} size="md" />
        <span className="text-sm text-foreground font-['Space_Grotesk'] font-medium">{second.name}</span>
        <span className="text-sm font-bold text-primary font-['Space_Grotesk']">{second.points.toLocaleString()}</span>
        <div className="w-24 h-20 bg-card flex items-center justify-center border border-border">
          <span className="text-2xl font-bold text-muted-foreground font-['Space_Grotesk']">2</span>
        </div>
      </div>

      {/* 1st place */}
      <div className="flex flex-col items-center gap-2 -mt-8">
        <GeometricAvatar rank={1} size="lg" />
        <span className="text-sm text-foreground font-['Space_Grotesk'] font-medium">{first.name}</span>
        <span className="text-base font-bold text-primary font-['Space_Grotesk']">{first.points.toLocaleString()}</span>
        <div className="w-28 h-28 bg-card flex items-center justify-center border border-border">
          <span className="text-3xl font-bold text-primary font-['Space_Grotesk']">1</span>
        </div>
      </div>

      {/* 3rd place */}
      <div className="flex flex-col items-center gap-2 pb-0">
        <GeometricAvatar rank={3} size="md" />
        <span className="text-sm text-foreground font-['Space_Grotesk'] font-medium">{third.name}</span>
        <span className="text-sm font-bold text-primary font-['Space_Grotesk']">{third.points.toLocaleString()}</span>
        <div className="w-24 h-16 bg-card flex items-center justify-center border border-border">
          <span className="text-2xl font-bold text-muted-foreground font-['Space_Grotesk']">3</span>
        </div>
      </div>
    </div>
  );
};

export default Podium;
