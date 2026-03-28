import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransferRequest, clubsMatch } from "@/data/clubTransfers";
import { mockClubs } from "@/data/mockClubs";
import { toast } from "@/components/ui/sonner";

function displayClubName(name: string): string {
  return name.replace(/\r?\n/g, " ").trim();
}

export default function ClubTransferPlayerDialog({
  open,
  onOpenChange,
  player,
  fromClubName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: { id: string; name: string } | null;
  fromClubName: string;
}) {
  const [toClubId, setToClubId] = useState<string>("");

  useEffect(() => {
    if (!open) setToClubId("");
  }, [open]);

  const destinations = mockClubs.filter((c) => !clubsMatch(c.name, fromClubName));

  const handleSubmit = () => {
    if (!player) return;
    const dest = mockClubs.find((c) => c.id === toClubId);
    if (!dest) {
      toast.error("Choose a destination club");
      return;
    }
    const created = createTransferRequest({
      playerId: player.id,
      playerName: player.name,
      fromClubName,
      toClubName: dest.name,
    });
    if (!created) {
      toast.error("Could not create request (duplicate pending or invalid clubs)");
      return;
    }
    toast.success(`Transfer request sent to ${displayClubName(dest.name)}`);
    setToClubId("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-['Space_Grotesk'] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer player</DialogTitle>
          <DialogDescription>
            The receiving club&apos;s owner will need to approve before the move is final. This is stored on this device
            for the demo.
          </DialogDescription>
        </DialogHeader>
        {player ? (
          <div className="space-y-4 py-1">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{player.name}</span>
              <span className="text-muted-foreground"> · from {displayClubName(fromClubName)}</span>
            </p>
            <div className="space-y-2">
              <Label htmlFor="transfer-dest">Receiving club</Label>
              <Select value={toClubId} onValueChange={setToClubId}>
                <SelectTrigger id="transfer-dest" className="rounded-xl">
                  <SelectValue placeholder="Select club…" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {displayClubName(c.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="rounded-xl" onClick={handleSubmit} disabled={!toClubId}>
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
