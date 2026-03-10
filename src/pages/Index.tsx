import { useState } from "react";
import Podium from "@/components/Podium";
import LeaderboardRow from "@/components/LeaderboardRow";
import { mockLeaderboard } from "@/data/mockLeaderboard";

const filters = ["Daily", "Monthly", "All Time"] as const;

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All Time");

  const topThree = mockLeaderboard.filter((e) => e.rank <= 3);
  const rest = mockLeaderboard.filter((e) => e.rank > 3);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold tracking-widest text-foreground text-center">
            LEADERBOARD
          </h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Filter Tabs */}
        <div className="flex border-b border-border">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-3 text-xs font-['Space_Grotesk'] font-semibold tracking-wider transition-colors ${
                activeFilter === filter
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Podium */}
        <Podium topThree={topThree} />

        {/* Ranked List */}
        <div className="flex flex-col gap-px px-4 pb-4">
          {rest.map((entry) => (
            <LeaderboardRow key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
