import { useParams, useNavigate, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, SentIcon, MoreVerticalCircle01Icon, Location01Icon, HeadphonesIcon } from "@hugeicons/core-free-icons";
import { getClubById } from "@/data/mockClubs";
import { getMembersByClubName } from "@/data/playerProfile";
import SafeImage from "@/components/SafeImage";
import RevealSection from "@/components/RevealSection";
import { getMatchesForClub } from "@/data/mockMatches";
import LeaderboardRow from "@/components/LeaderboardRow";
import NotFound from "./NotFound";

const MEMBERS_PREVIEW_COUNT = 5;

const ClubDetail = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const club = clubId ? getClubById(clubId) : null;
  const members = club ? getMembersByClubName(club.name) : [];
  const matches = clubId ? getMatchesForClub(clubId) : [];
  const visibleMembers = members.slice(0, MEMBERS_PREVIEW_COUNT);
  const clubPoints = members.reduce((sum, entry) => sum + entry.points, 0);

  if (!club) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 -ml-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-semibold text-foreground font-['Space_Grotesk'] flex-1 text-center">
            Club
          </h1>
          <div className="flex items-center gap-0 shrink-0">
            <button
              type="button"
              aria-label="Share"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <HugeiconsIcon icon={SentIcon} size={24} color="currentColor" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="More options"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={24} color="currentColor" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        <RevealSection>
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="aspect-[3/2] bg-muted relative">
            <SafeImage
              src={club.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                  <span className="text-4xl font-bold text-muted-foreground font-['Space_Grotesk']">
                    {club.name.charAt(0)}
                  </span>
                </div>
              }
            />
          </div>
          <div className="p-4 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight">
              {club.name}
            </h1>
            <div className="flex items-start justify-between gap-4 flex-wrap w-full">
              {club.location && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground font-['Space_Grotesk']">Location</span>
                  <span className="text-lg font-bold text-foreground font-['Space_Grotesk']">
                    {club.location}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground font-['Space_Grotesk']">Members</span>
                <span className="text-lg font-bold text-foreground font-['Space_Grotesk']">
                  {club.memberCount}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground font-['Space_Grotesk']">Club points</span>
                <span className="text-lg font-bold text-foreground font-['Space_Grotesk']">
                  {clubPoints.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          </div>
        </RevealSection>

        <RevealSection>
        <section>
          <h2 className="text-lg font-semibold text-foreground font-['Space_Grotesk'] mb-3">
            Club details
          </h2>
          <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
            {club.description && (
              <p className="text-sm text-muted-foreground font-['Space_Grotesk']">
                {club.description}
              </p>
            )}
            {club.courts != null && (
              <p className="text-sm text-muted-foreground font-['Space_Grotesk']">
                Courts: {club.courts}
              </p>
            )}
            {club.location && (
              <p className="text-sm text-muted-foreground font-['Space_Grotesk']">
                Location: {club.location}
              </p>
            )}
            {!club.description && club.courts == null && (
              <p className="text-sm text-muted-foreground font-['Space_Grotesk']">
                {club.memberCount} members · {club.location ?? "—"}
              </p>
            )}
          </div>
        </section>
        </RevealSection>

        <RevealSection>
        <section>
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-lg font-semibold text-foreground font-['Space_Grotesk']">
              Club members
            </h2>
            {members.length > 0 && (
              <Link
                to={`/library/${clubId}/members`}
                className="text-sm font-medium text-primary font-['Space_Grotesk'] hover:underline shrink-0"
              >
                See all
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {members.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground font-['Space_Grotesk']">
                No members to show.
              </div>
            ) : (
              visibleMembers.map((entry) => (
                <LeaderboardRow key={entry.id} entry={entry} />
              ))
            )}
          </div>
        </section>

        {/* Club match */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground font-['Space_Grotesk'] mb-3">
            Club match
          </h2>
          <div className="flex flex-col gap-3">
            {matches.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground font-['Space_Grotesk']">
                No matches to show.
              </div>
            ) : (
              matches.map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}`}
                  className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1.5 no-underline text-inherit [color:inherit] hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {match.isLive && (
                      <span className="inline-flex items-center gap-1 rounded bg-red-600 text-white px-2 py-0.5 text-xs font-semibold font-['Space_Grotesk']">
                        <HugeiconsIcon icon={HeadphonesIcon} size={14} color="currentColor" strokeWidth={1.5} />
                        LIVE
                      </span>
                    )}
                    <span className="text-sm font-medium text-foreground font-['Space_Grotesk']">
                      {match.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-['Space_Grotesk']">
                    {match.subtitle}
                  </p>
                  <p className="text-xs text-muted-foreground font-['Space_Grotesk']">
                    {match.player1Name} vs {match.player2Name} · {match.setScore}
                  </p>
                </Link>
              ))
            )}
          </div>
        </section>
        </RevealSection>
      </div>
    </div>
  );
};

export default ClubDetail;
