import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Podium from "@/components/Podium";
import { NotificationBellLink } from "@/components/NotificationBellLink";
import LeaderboardRow from "@/components/LeaderboardRow";
import SafeImage from "@/components/SafeImage";
import RevealSection from "@/components/RevealSection";
import { mockLeaderboard } from "@/data/mockLeaderboard";
import { getClubRanking } from "@/data/playerProfile";

const FIRST_PAGE_LIST_SIZE = 7; // 3 podium + 7 list = 10 profile cards on first page
const LIST_PER_PAGE_AFTER_FIRST = 10;

const Index = () => {
  const [page, setPage] = useState(0);
  const [podiumTab, setPodiumTab] = useState<"player" | "club">("player");

  const topThree = mockLeaderboard.filter((e) => e.rank <= 3);
  const rest = mockLeaderboard.filter((e) => e.rank > 3);

  const clubRanking = useMemo(() => getClubRanking(), []);
  const topThreeClubs = clubRanking.slice(0, 3);
  const restClubs = clubRanking.slice(3);

  const totalPages =
    podiumTab === "player"
      ? rest.length <= FIRST_PAGE_LIST_SIZE
        ? 1
        : 1 + Math.ceil((rest.length - FIRST_PAGE_LIST_SIZE) / LIST_PER_PAGE_AFTER_FIRST)
      : restClubs.length <= FIRST_PAGE_LIST_SIZE
        ? 1
        : 1 + Math.ceil((restClubs.length - FIRST_PAGE_LIST_SIZE) / LIST_PER_PAGE_AFTER_FIRST);

  const visibleRestPlayers =
    page === 0
      ? rest.slice(0, FIRST_PAGE_LIST_SIZE)
      : rest.slice(
          FIRST_PAGE_LIST_SIZE + (page - 1) * LIST_PER_PAGE_AFTER_FIRST,
          FIRST_PAGE_LIST_SIZE + (page - 1) * LIST_PER_PAGE_AFTER_FIRST + LIST_PER_PAGE_AFTER_FIRST
        );
  const visibleRestClubs =
    page === 0
      ? restClubs.slice(0, FIRST_PAGE_LIST_SIZE)
      : restClubs.slice(
          FIRST_PAGE_LIST_SIZE + (page - 1) * LIST_PER_PAGE_AFTER_FIRST,
          FIRST_PAGE_LIST_SIZE + (page - 1) * LIST_PER_PAGE_AFTER_FIRST + LIST_PER_PAGE_AFTER_FIRST
        );

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center shrink-0" aria-label="PadelHub home">
            <SafeImage
              src="/logo.png"
              alt="PadelHub"
              className="h-8 w-auto object-contain object-left"
              fallback={
                <span className="h-8 flex items-center text-lg font-bold text-primary font-['Space_Grotesk']">
                  PadelHub
                </span>
              }
            />
          </Link>
          <NotificationBellLink />
        </div>
      </header>

      <div className="max-w-lg mx-auto mt-4">
        <RevealSection>
          <Podium
            topThree={topThree}
            topThreeClubs={topThreeClubs}
            activeTab={podiumTab}
            onTabChange={(tab) => {
              setPodiumTab(tab);
              setPage(0);
            }}
          />
        </RevealSection>

        {totalPages > 1 && (
          <RevealSection className="flex justify-center gap-1 px-4 py-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`min-w-[2rem] py-1.5 px-2 text-sm font-['Space_Grotesk'] font-semibold rounded transition-colors ${
                  page === i
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </RevealSection>
        )}

        <RevealSection stagger staggerDelay={0.05} className="flex flex-col gap-2 px-[16px] pb-8">
          {podiumTab === "player"
            ? visibleRestPlayers.map((entry) => (
                <LeaderboardRow key={entry.id} entry={entry} />
              ))
            : visibleRestClubs.map((club) => (
                <Link
                  key={club.id}
                  to={`/library/${club.id}`}
                  className="flex items-center gap-4 px-4 py-3 border border-border rounded-xl transition-colors hover:bg-[#c5dd00]/50 hover:border-[#c5dd00]/50 bg-card"
                >
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white font-['Space_Grotesk'] shrink-0 border border-border bg-black">
                    {club.rank}
                  </span>
                  <SafeImage
                    src={club.imageUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-border"
                    fallback={
                      <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground font-['Space_Grotesk'] shrink-0">
                        {club.name.charAt(0)}
                      </span>
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-foreground truncate font-['Space_Grotesk']">
                      {club.name}
                    </span>
                    {club.location && (
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {club.location} · {club.memberCount} members
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-primary font-['Space_Grotesk'] shrink-0">
                    {club.totalPoints.toLocaleString()}
                  </span>
                </Link>
              ))}
        </RevealSection>
      </div>
    </div>
  );
};

export default Index;
