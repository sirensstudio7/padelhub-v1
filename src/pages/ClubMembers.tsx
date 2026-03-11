import { useParams, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { getClubById } from "@/data/mockClubs";
import { getMembersByClubName } from "@/data/playerProfile";
import LeaderboardRow from "@/components/LeaderboardRow";
import RevealSection from "@/components/RevealSection";
import NotFound from "./NotFound";

const ClubMembers = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const club = clubId ? getClubById(clubId) : null;
  const members = club ? getMembersByClubName(club.name) : [];

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
            Club members
          </h1>
          <div className="w-10 shrink-0" aria-hidden />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <RevealSection>
          <p className="text-sm text-muted-foreground font-['Space_Grotesk'] mb-4">
            {club.name} · {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </RevealSection>
        <RevealSection stagger staggerDelay={0.05} className="flex flex-col gap-2">
          {members.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground font-['Space_Grotesk']">
              No members to show.
            </div>
          ) : (
            members.map((entry) => (
              <LeaderboardRow key={entry.id} entry={entry} />
            ))
          )}
        </RevealSection>
      </div>
    </div>
  );
};

export default ClubMembers;
