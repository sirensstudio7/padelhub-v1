import { useEffect, useState } from "react";
import type { BracketMatch } from "@/components/EventBracket";
import {
  canRecordMatchResult,
  isByeLabel,
  isWalkoverByeMatch,
} from "@/lib/bracketMatchResult";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: BracketMatch | null;
  isFinalRound: boolean;
  onSave: (payload: {
    score1: number;
    score2: number;
    tieBreaker?: "team1" | "team2";
  }) => void;
};

export default function BracketMatchScoreDialog({
  open,
  onOpenChange,
  match,
  isFinalRound,
  onSave,
}: Props) {
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");

  useEffect(() => {
    if (!match || !open) return;
    setS1(match.score1 !== undefined ? String(match.score1) : "");
    setS2(match.score2 !== undefined ? String(match.score2) : "");
  }, [match, open]);

  if (!match) return null;

  const playable = canRecordMatchResult(match);
  const walkover = isWalkoverByeMatch(match);
  const advancingName = walkover
    ? isByeLabel(match.team1)
      ? match.team2.trim()
      : match.team1.trim()
    : "";

  const handleWalkover = () => {
    onSave({ score1: 0, score2: 0 });
    onOpenChange(false);
  };

  const handleTieBreaker = (side: "team1" | "team2") => {
    const n1 = Number.parseInt(s1, 10);
    const n2 = Number.parseInt(s2, 10);
    if (!Number.isFinite(n1) || !Number.isFinite(n2)) return;
    onSave({ score1: n1, score2: n2, tieBreaker: side });
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n1 = Number.parseInt(s1, 10);
    const n2 = Number.parseInt(s2, 10);
    if (!Number.isFinite(n1) || !Number.isFinite(n2) || n1 < 0 || n2 < 0) return;
    if (n1 === n2) return;
    onSave({ score1: n1, score2: n2 });
    onOpenChange(false);
  };

  const n1p = Number.parseInt(s1, 10);
  const n2p = Number.parseInt(s2, 10);
  const isTie =
    Number.isFinite(n1p) && Number.isFinite(n2p) && n1p === n2p && !walkover;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-['Space_Grotesk'] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Match result</DialogTitle>
          <DialogDescription className="text-left">
            {isFinalRound
              ? "Record the score for the final."
              : "Winner advances to the next round."}
          </DialogDescription>
        </DialogHeader>

        {!playable ? (
          <>
            <p className="text-sm text-muted-foreground">
              Both sides must be set (not TBD) before you can record a result.
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : walkover ? (
          <>
            <p className="text-sm text-muted-foreground">
              Walkover: <span className="font-medium text-foreground">{advancingName}</span> advances past BYE.
            </p>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" className="rounded-xl" onClick={handleWalkover}>
                Record walkover
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="br-s1" className="line-clamp-2 text-xs">
                  {match.team1}
                </Label>
                <Input
                  id="br-s1"
                  inputMode="numeric"
                  className="rounded-xl"
                  value={s1}
                  onChange={(e) => setS1(e.target.value.replace(/\D/g, ""))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="br-s2" className="line-clamp-2 text-xs">
                  {match.team2}
                </Label>
                <Input
                  id="br-s2"
                  inputMode="numeric"
                  className="rounded-xl"
                  value={s2}
                  onChange={(e) => setS2(e.target.value.replace(/\D/g, ""))}
                  placeholder="0"
                />
              </div>
            </div>
            {isTie ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Tie score — pick who advances:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-[2.5rem] flex-1 rounded-xl text-xs leading-tight"
                    onClick={() => handleTieBreaker("team1")}
                  >
                    {match.team1} advances
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-[2.5rem] flex-1 rounded-xl text-xs leading-tight"
                    onClick={() => handleTieBreaker("team2")}
                  >
                    {match.team2} advances
                  </Button>
                </div>
              </div>
            ) : null}
            <DialogFooter className="gap-2 sm:justify-end">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={isTie}>
                Save result
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
