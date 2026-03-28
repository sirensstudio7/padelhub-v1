import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Shuffle, Users } from "lucide-react";
import { getEventById, formatEventDate, formatEventTime } from "@/data/events";
import {
  normalizeRegistrationStatus,
  setRegistrationStatus,
  type EventRegistration,
} from "@/data/eventRegistrations";
import { setTournamentBracketDraw } from "@/data/tournamentBracketDraw";
import { getTournamentBracketFromEvent } from "@/lib/eventTournamentBracket";
import {
  applyRandomFirstRound,
  getTournamentBracketDisplayRounds,
  pickTeamLabelsForBracketSlots,
} from "@/lib/bracketRandomDraw";
import { applyMatchResult, canRecordMatchResult } from "@/lib/bracketMatchResult";
import { useEventRegistrations } from "@/hooks/useEventRegistrations";
import { useTournamentBracketDraw } from "@/hooks/useTournamentBracketDraw";
import { toast } from "@/components/ui/sonner";
import BracketMatchScoreDialog from "@/components/admin/BracketMatchScoreDialog";
import SafeImage from "@/components/SafeImage";
import EventBracket from "@/components/EventBracket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NotFound from "./NotFound";

function RegisteredPlayersPanel({
  eventId,
  registrations,
}: {
  eventId: string;
  registrations: EventRegistration[];
}) {
  if (registrations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/15 px-4 py-10 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
          <Users className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <p className="mt-3 text-sm font-medium font-['Space_Grotesk'] text-foreground">No registrations yet</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground font-['Space_Grotesk'] leading-relaxed">
          Public sign-ups will show here.
        </p>
      </div>
    );
  }

  const thClass =
    "h-9 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground font-['Space_Grotesk']";
  const tdClass = "px-3 py-2 text-xs font-['Space_Grotesk'] align-top";

  const statusLabel = (s: ReturnType<typeof normalizeRegistrationStatus>) => {
    if (s === "approved") return "Approved";
    if (s === "rejected") return "Rejected";
    return "Pending";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-muted/40 hover:bg-muted/40">
            <TableHead className={thClass}>Name</TableHead>
            <TableHead className={thClass}>Email</TableHead>
            <TableHead className={thClass}>Phone</TableHead>
            <TableHead className={`${thClass} w-[72px]`}>Gender</TableHead>
            <TableHead className={`${thClass} w-[72px]`}>T-shirt</TableHead>
            <TableHead className={thClass}>Address</TableHead>
            <TableHead className={`${thClass} w-[88px]`}>Status</TableHead>
            <TableHead className={`${thClass} min-w-[160px]`}>Actions</TableHead>
            <TableHead className={`${thClass} min-w-[140px] whitespace-nowrap`}>Registered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((r) => {
            const registered = new Date(r.registeredAt);
            const genderShort =
              r.gender === "m" ? "M" : r.gender === "f" ? "F" : "—";
            const status = normalizeRegistrationStatus(r);

            return (
              <TableRow key={r.id} className="font-['Space_Grotesk']">
                <TableCell className={`${tdClass} max-w-[160px] font-medium text-foreground`}>
                  <span className="line-clamp-2">{r.name}</span>
                </TableCell>
                <TableCell className={`${tdClass} max-w-[180px] text-muted-foreground`}>
                  {r.email ? <span className="line-clamp-2 break-all">{r.email}</span> : "—"}
                </TableCell>
                <TableCell className={`${tdClass} tabular-nums text-foreground`}>{r.phone ?? "—"}</TableCell>
                <TableCell className={tdClass}>
                  <span className="inline-flex min-w-[1.5rem] justify-center rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground">
                    {genderShort}
                  </span>
                </TableCell>
                <TableCell className={tdClass}>{r.tshirtSize ?? "—"}</TableCell>
                <TableCell className={`${tdClass} max-w-[220px] text-muted-foreground`}>
                  {r.address ? (
                    <span className="line-clamp-3 break-words">{r.address}</span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className={tdClass}>
                  <span
                    className={
                      status === "approved"
                        ? "text-primary font-semibold"
                        : status === "rejected"
                          ? "text-destructive font-medium"
                          : "text-amber-600 dark:text-amber-500 font-medium"
                    }
                  >
                    {statusLabel(status)}
                  </span>
                </TableCell>
                <TableCell className={`${tdClass} max-w-[200px]`}>
                  <div className="flex flex-wrap gap-1.5">
                    {status === "pending" ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="default"
                          className="h-7 px-2 text-[10px] font-['Space_Grotesk']"
                          onClick={() => {
                            setRegistrationStatus(eventId, r.id, "approved");
                            toast.success("Player approved");
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[10px] font-['Space_Grotesk']"
                          onClick={() => {
                            setRegistrationStatus(eventId, r.id, "rejected");
                            toast.success("Registration rejected");
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                    {status === "approved" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[10px] font-['Space_Grotesk']"
                        onClick={() => {
                          setRegistrationStatus(eventId, r.id, "rejected");
                          toast.success("Moved to rejected");
                        }}
                      >
                        Revoke
                      </Button>
                    ) : null}
                    {status === "rejected" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-7 px-2 text-[10px] font-['Space_Grotesk']"
                        onClick={() => {
                          setRegistrationStatus(eventId, r.id, "approved");
                          toast.success("Player approved");
                        }}
                      >
                        Approve
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className={`${tdClass} whitespace-nowrap tabular-nums text-muted-foreground`}>
                  <time dateTime={r.registeredAt}>
                    {registered.toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const AdminEventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = eventId ? getEventById(eventId) : null;
  const registrations = useEventRegistrations(eventId);
  const [scoreTarget, setScoreTarget] = useState<{ roundIndex: number; matchIndex: number } | null>(null);

  const approvedRegistrations = useMemo(
    () => registrations.filter((r) => normalizeRegistrationStatus(r) === "approved"),
    [registrations]
  );
  const pendingCount = useMemo(
    () => registrations.filter((r) => normalizeRegistrationStatus(r) === "pending").length,
    [registrations]
  );

  const tournamentBracket = useMemo(() => getTournamentBracketFromEvent(event), [event]);
  const bracketTemplateRounds = tournamentBracket?.rounds ?? null;
  const storedBracketDraw = useTournamentBracketDraw(eventId, bracketTemplateRounds);
  const displayBracketRounds = useMemo(() => {
    if (!tournamentBracket) return undefined;
    return getTournamentBracketDisplayRounds(
      tournamentBracket.rounds,
      storedBracketDraw,
      approvedRegistrations,
      tournamentBracket.slots
    );
  }, [tournamentBracket, storedBracketDraw, approvedRegistrations]);

  const canRollMatchups =
    !!eventId &&
    !!tournamentBracket &&
    approvedRegistrations.length >= tournamentBracket.entered;

  const handleRollMatchups = () => {
    if (!eventId || !tournamentBracket) return;
    const labels = pickTeamLabelsForBracketSlots(approvedRegistrations, tournamentBracket.slots);
    const next = applyRandomFirstRound(tournamentBracket.rounds, labels);
    setTournamentBracketDraw(eventId, next);
    toast.success("First-round matchups drawn", {
      description: "Players are randomly assigned to bracket slots. The public event page will show the same draw.",
    });
  };

  const scoreMatch =
    scoreTarget && displayBracketRounds
      ? (displayBracketRounds[scoreTarget.roundIndex]?.matches[scoreTarget.matchIndex] ?? null)
      : null;
  const scoreFinalRound = Boolean(
    scoreTarget && displayBracketRounds && scoreTarget.roundIndex === displayBracketRounds.length - 1
  );

  const handleMatchScoreSave = (payload: {
    score1: number;
    score2: number;
    tieBreaker?: "team1" | "team2";
  }) => {
    if (!eventId || !displayBracketRounds || !scoreTarget) return;
    try {
      const next = applyMatchResult(
        displayBracketRounds,
        scoreTarget.roundIndex,
        scoreTarget.matchIndex,
        payload.score1,
        payload.score2,
        payload.tieBreaker
      );
      setTournamentBracketDraw(eventId, next);
      toast.success("Match result saved");
      setScoreTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save result");
    }
  };

  if (!event) return <NotFound />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <Button variant="ghost" className="w-fit gap-2 px-0 font-['Space_Grotesk'] text-muted-foreground hover:text-foreground" asChild>
          <Link to="/admin/events/new">
            <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            Back to events
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {event.imageUrl ? (
          <div className="aspect-[21/9] max-h-36 w-full overflow-hidden bg-muted sm:max-h-40">
            <SafeImage
              src={event.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              fallback={null}
            />
          </div>
        ) : null}
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 gap-y-1">
            {event.type ? (
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary font-['Space_Grotesk']">
                {event.type}
              </span>
            ) : null}
            <span className="text-[11px] tabular-nums text-muted-foreground font-['Space_Grotesk']">
              {approvedRegistrations.length} approved
              {pendingCount > 0 ? ` · ${pendingCount} pending approval` : ""}
              {registrations.length > approvedRegistrations.length + pendingCount
                ? ` · ${registrations.length - approvedRegistrations.length - pendingCount} rejected`
                : ""}
            </span>
          </div>
          <h2 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight font-['Space_Grotesk'] text-foreground sm:text-xl">
            {event.title}
          </h2>

          <div className="mt-3 grid gap-2 text-sm text-muted-foreground font-['Space_Grotesk'] sm:grid-cols-2 sm:gap-x-6">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
              <span className="min-w-0 truncate">
                {formatEventDate(event.date)}
                {event.time ? ` · ${formatEventTime(event.time)}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-0 sm:col-span-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
              <span className="min-w-0 truncate">
                {event.venue}, {event.location}
              </span>
            </div>
            {event.type === "tournament" && event.teamsCount ? (
              <div className="flex items-center gap-2 sm:col-span-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Teams</span>
                <span className="tabular-nums text-foreground">{event.teamsCount}</span>
              </div>
            ) : null}
          </div>

          {event.type === "tournament" ? (
            <div className="mt-5">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid h-9 w-full grid-cols-3 gap-0.5 rounded-lg sm:max-w-md">
                  <TabsTrigger value="details" className="text-xs font-medium">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="bracket" className="text-xs font-medium">
                    Bracket
                  </TabsTrigger>
                  <TabsTrigger value="players" className="text-xs font-medium">
                    Players
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-3">
                  {event.description ? (
                    <p className="text-sm leading-relaxed text-muted-foreground font-['Space_Grotesk']">
                      {event.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground font-['Space_Grotesk']">No details yet.</p>
                  )}
                </TabsContent>
                <TabsContent value="bracket" className="mt-3">
                  {tournamentBracket ? (
                    <>
                      <p className="mb-3 text-xs leading-relaxed text-muted-foreground font-['Space_Grotesk']">
                        Single elimination for up to {tournamentBracket.slots} team slots (from “{event.teamsCount}”
                        {tournamentBracket.slots > tournamentBracket.entered
                          ? ` — padded to ${tournamentBracket.slots} for a full bracket`
                          : ""}
                        ). Only approved players fill the bracket (sign-up order, BYE for gaps). Approve players on
                        the Players tab first. Roll matchups randomizes the first round.
                      </p>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="gap-2 font-['Space_Grotesk']"
                          disabled={!canRollMatchups}
                          onClick={handleRollMatchups}
                        >
                          <Shuffle className="h-4 w-4 shrink-0" strokeWidth={2} />
                          Roll matchups
                        </Button>
                        {!canRollMatchups ? (
                          <span className="text-[11px] text-muted-foreground font-['Space_Grotesk']">
                            Need {tournamentBracket.entered} approved player
                            {tournamentBracket.entered === 1 ? "" : "s"} (each counts as one team slot).
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground font-['Space_Grotesk']">
                            Randomly assigns registered players to first-round pairings (extras become BYE if the
                            bracket is padded).
                          </span>
                        )}
                      </div>
                      <EventBracket
                        rounds={displayBracketRounds}
                        scoreActionSlot={({ roundIndex, matchIndex, match }) => (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-6 min-w-[2.75rem] px-1.5 text-[10px] font-semibold shadow-sm font-['Space_Grotesk']"
                            disabled={!canRecordMatchResult(match)}
                            onClick={() => setScoreTarget({ roundIndex, matchIndex })}
                          >
                            Score
                          </Button>
                        )}
                      />
                      <BracketMatchScoreDialog
                        open={scoreTarget != null}
                        onOpenChange={(open) => {
                          if (!open) setScoreTarget(null);
                        }}
                        match={scoreMatch}
                        isFinalRound={scoreFinalRound}
                        onSave={handleMatchScoreSave}
                      />
                    </>
                  ) : (
                    <EventBracket />
                  )}
                </TabsContent>
                <TabsContent value="players" className="mt-3">
                  <RegisteredPlayersPanel eventId={event.id} registrations={registrations} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="mt-5">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid h-9 w-full max-w-xs grid-cols-2 gap-0.5 rounded-lg">
                  <TabsTrigger value="details" className="text-xs font-medium">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="players" className="text-xs font-medium">
                    Players
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-3">
                  {event.description ? (
                    <p className="text-sm leading-relaxed text-muted-foreground font-['Space_Grotesk']">
                      {event.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground font-['Space_Grotesk']">No details yet.</p>
                  )}
                </TabsContent>
                <TabsContent value="players" className="mt-3">
                  <RegisteredPlayersPanel eventId={event.id} registrations={registrations} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventDetail;
