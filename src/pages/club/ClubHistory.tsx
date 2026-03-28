import ClubPageLayout from "@/components/ClubPageLayout";
import ClubRoute from "@/components/ClubRoute";

function ClubHistoryContent() {
  return (
    <ClubPageLayout
      title="History"
      subtitle="A timeline of matches, events, and notable moments for your club."
    >
      <div className="space-y-3">
        {[
          { t: "Mar 2026", d: "Club profile created on PadelHub." },
          { t: "Coming soon", d: "Match results and event history will appear here." },
        ].map((row) => (
          <div
            key={row.t}
            className="rounded-xl border border-border bg-card px-4 py-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-primary font-['Space_Grotesk'] shrink-0">
              {row.t}
            </span>
            <p className="text-sm text-foreground font-['Space_Grotesk'] leading-relaxed">{row.d}</p>
          </div>
        ))}
      </div>
    </ClubPageLayout>
  );
}

export default function ClubHistory() {
  return (
    <ClubRoute>
      <ClubHistoryContent />
    </ClubRoute>
  );
}
