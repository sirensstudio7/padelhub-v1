import ClubPageLayout from "@/components/ClubPageLayout";
import ClubRoute from "@/components/ClubRoute";

function ClubTrophyContent() {
  return (
    <ClubPageLayout
      title="Our trophy"
      subtitle="Tournament wins, league titles, and club milestones."
    >
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-12 text-center">
        <p className="text-sm font-medium text-foreground font-['Space_Grotesk']">No trophies yet</p>
        <p className="mt-2 text-xs text-muted-foreground font-['Space_Grotesk'] leading-relaxed max-w-sm mx-auto">
          When your club earns placements or awards, they will show up here.
        </p>
      </div>
    </ClubPageLayout>
  );
}

export default function ClubTrophy() {
  return (
    <ClubRoute>
      <ClubTrophyContent />
    </ClubRoute>
  );
}
