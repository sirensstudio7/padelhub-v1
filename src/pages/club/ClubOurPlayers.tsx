import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown, ListFilter, Search } from "lucide-react";
import ClubTransferPlayerDialog from "@/components/club/ClubTransferPlayerDialog";
import ClubPageLayout from "@/components/ClubPageLayout";
import ClubRoute from "@/components/ClubRoute";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import {
  clubsMatch,
  getIncomingPendingForClub,
  hasPendingOutgoingTransfer,
  isPlayerTransferredOut,
  setTransferRequestStatus,
} from "@/data/clubTransfers";
import { mockLeaderboard, type LeaderboardEntry, type PadelPosition } from "@/data/mockLeaderboard";
import { useProfileOverrides } from "@/contexts/ProfileOverridesContext";
import { useClubTransfers } from "@/hooks/useClubTransfers";
import SafeImage from "@/components/SafeImage";

function displayClubName(name: string): string {
  return name.replace(/\r?\n/g, " ").trim();
}

type SideFilter = "all" | PadelPosition;
type TrendFilter = "all" | "up" | "down" | "steady";

function ClubOurPlayersContent() {
  const { overrides } = useProfileOverrides();
  const clubLabel = overrides.name?.trim() || "Your club";
  const transfers = useClubTransfers();
  const [query, setQuery] = useState("");
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("all");
  const [transferPlayer, setTransferPlayer] = useState<LeaderboardEntry | null>(null);

  const roster = useMemo(
    () => mockLeaderboard.filter((p) => !isPlayerTransferredOut(p.id, clubLabel)),
    [clubLabel, transfers]
  );

  const incomingPending = useMemo(() => getIncomingPendingForClub(clubLabel), [clubLabel, transfers]);

  const outgoingPending = useMemo(
    () => transfers.filter((t) => t.status === "pending" && clubsMatch(t.fromClubName, clubLabel)),
    [transfers, clubLabel]
  );

  const filteredPlayers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roster.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (sideFilter !== "all" && p.position !== sideFilter) return false;
      if (trendFilter === "up" && p.rankChange !== "up") return false;
      if (trendFilter === "down" && p.rankChange !== "down") return false;
      if (trendFilter === "steady" && p.rankChange != null) return false;
      return true;
    });
  }, [roster, query, sideFilter, trendFilter]);

  const hasActiveFilters =
    query.trim().length > 0 || sideFilter !== "all" || trendFilter !== "all";

  const rosterFiltersActive = sideFilter !== "all" || trendFilter !== "all";

  return (
    <ClubPageLayout
      title="Our players"
      subtitle={`Players associated with ${clubLabel}. You can request transfers to another club — the receiving club owner approves or rejects. Demo data is stored on this device.`}
    >
      {incomingPending.length > 0 ? (
        <div className="mb-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground font-['Space_Grotesk']">
            Transfer requests · your approval
          </p>
          {incomingPending.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-card font-['Space_Grotesk']"
            >
              <p className="text-sm font-semibold text-foreground">{t.playerName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Release from {displayClubName(t.fromClubName)} — your club ({displayClubName(clubLabel)}) is the
                destination.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => {
                    setTransferRequestStatus(t.id, "approved");
                    toast.success(`${t.playerName} transfer approved`);
                  }}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    setTransferRequestStatus(t.id, "rejected");
                    toast(`${t.playerName} transfer rejected`);
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {outgoingPending.length > 0 ? (
        <div className="mb-4 rounded-2xl border border-dashed border-border bg-muted/15 px-3 py-3 font-['Space_Grotesk']">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Awaiting other club
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-foreground/90">
            {outgoingPending.map((t) => (
              <li key={t.id}>
                <span className="font-medium">{t.playerName}</span>
                <span className="text-muted-foreground"> → {displayClubName(t.toClubName)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground font-['Space_Grotesk']">Find players</p>
            <p className="mt-0.5 max-w-md text-[11px] leading-relaxed text-muted-foreground font-['Space_Grotesk']">
              Search by name, then narrow by side or rank trend.
            </p>
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSideFilter("all");
                setTrendFilter("all");
              }}
              className="shrink-0 text-xs font-medium text-primary font-['Space_Grotesk'] underline-offset-4 hover:underline"
            >
              Reset filters
            </button>
          ) : null}
        </div>

        <div>
          <Label htmlFor="club-players-search" className="text-xs font-medium text-foreground font-['Space_Grotesk']">
            Name
          </Label>
          <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={2}
                aria-hidden
              />
              <Input
                id="club-players-search"
                type="search"
                placeholder="Type to filter…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 w-full rounded-xl border-border bg-background pl-10 font-['Space_Grotesk'] text-sm"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  aria-label="Open roster filters"
                  className="h-11 shrink-0 gap-2 rounded-xl border-border bg-background px-3 font-['Space_Grotesk'] text-sm font-medium sm:min-w-[7.5rem]"
                >
                  <ListFilter className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden />
                  <span>Filters</span>
                  {rosterFiltersActive ? (
                    <span className="flex h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  ) : null}
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-60" strokeWidth={2} aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 font-['Space_Grotesk']">
                <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Court side
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={sideFilter}
                  onValueChange={(v) => setSideFilter(v as SideFilter)}
                >
                  <DropdownMenuRadioItem value="all">All sides</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="left">Left only</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="right">Right only</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Rank trend
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={trendFilter}
                  onValueChange={(v) => setTrendFilter(v as TrendFilter)}
                >
                  <DropdownMenuRadioItem value="all">Any trend</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="up">Moving up</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="down">Moving down</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="steady">No change</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {hasActiveFilters ? (
          <p className="text-[11px] tabular-nums text-muted-foreground font-['Space_Grotesk']">
            Showing <span className="font-semibold text-foreground">{filteredPlayers.length}</span> of{" "}
            <span className="font-semibold text-foreground">{roster.length}</span> players
          </p>
        ) : null}
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-14 text-center">
          <p className="text-sm font-medium text-foreground font-['Space_Grotesk']">No players match</p>
          <p className="mt-2 text-xs text-muted-foreground font-['Space_Grotesk']">
            Try another name or adjust the filters.
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {filteredPlayers.map((p) => {
          const pendingOut = hasPendingOutgoingTransfer(p.id, clubLabel);
          return (
            <div
              key={p.id}
              className="flex h-full min-h-[232px] flex-col overflow-hidden rounded-3xl bg-white shadow-none ring-1 ring-border/50 transition-all duration-200 dark:bg-card sm:min-h-[252px]"
            >
              <Link
                to={`/profile/${p.id}`}
                aria-label={`${p.name}, rank ${p.rank}`}
                className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-3xl px-3.5 pb-2 pt-5 no-underline text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 sm:pt-6"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-semibold tabular-nums tracking-wide text-muted-foreground font-['Space_Grotesk']">
                    #{p.rank}
                  </span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>

                <div className="mt-3 flex flex-1 flex-col items-center text-center">
                  <div className="relative shrink-0">
                    <SafeImage
                      src={p.avatarUrl}
                      alt=""
                      className="h-16 w-16 rounded-full object-cover bg-muted/80 shadow-inner ring-2 ring-background sm:h-[4.25rem] sm:w-[4.25rem]"
                      fallback={
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary font-['Space_Grotesk'] ring-2 ring-background sm:h-[4.25rem] sm:w-[4.25rem] sm:text-xl">
                          {p.name.charAt(0)}
                        </span>
                      }
                    />
                  </div>

                  <div className="mt-3 min-w-0 w-full">
                    <h2 className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-tight text-foreground font-['Space_Grotesk'] sm:text-sm">
                      {p.name}
                    </h2>
                    {p.isCurrentUser ? (
                      <span className="mt-1 inline-block rounded-full bg-primary/12 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary font-['Space_Grotesk']">
                        You
                      </span>
                    ) : null}
                    {pendingOut ? (
                      <span className="mt-1.5 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500 font-['Space_Grotesk']">
                        Transfer pending
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1.5 flex w-full flex-col items-center gap-2 sm:mt-2">
                    <div className="flex w-full items-center justify-center gap-2 text-[11px] font-['Space_Grotesk']">
                      {p.position ? (
                        <>
                          <span className="rounded-full bg-background/80 px-2 py-0.5 font-medium capitalize text-muted-foreground ring-1 ring-border/60">
                            {p.position}
                          </span>
                          <span className="text-muted-foreground/50" aria-hidden>
                            ·
                          </span>
                        </>
                      ) : null}
                      <span className="tabular-nums font-semibold text-foreground/90">{p.points.toLocaleString()}</span>
                      <span className="text-muted-foreground">pts</span>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1" aria-hidden />
                </div>
              </Link>
              <div className="px-2 pb-3 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 w-full rounded-xl text-[11px] font-medium font-['Space_Grotesk']"
                  disabled={pendingOut}
                  onClick={() => setTransferPlayer(p)}
                >
                  Transfer player
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      )}
      <p className="mt-4 text-xs text-muted-foreground font-['Space_Grotesk'] leading-relaxed">
        Demo list — incoming approvals match when your club name (from signup profile) matches the destination club name
        in the request (e.g. sign up as &quot;Padel Hub Society&quot; to approve transfers sent to that club).
      </p>

      <ClubTransferPlayerDialog
        open={transferPlayer != null}
        onOpenChange={(open) => {
          if (!open) setTransferPlayer(null);
        }}
        player={transferPlayer ? { id: transferPlayer.id, name: transferPlayer.name } : null}
        fromClubName={clubLabel}
      />
    </ClubPageLayout>
  );
}

export default function ClubOurPlayers() {
  return (
    <ClubRoute>
      <ClubOurPlayersContent />
    </ClubRoute>
  );
}
