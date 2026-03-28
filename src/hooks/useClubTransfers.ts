import { useCallback, useEffect, useState } from "react";
import { listClubTransfers, type ClubTransferRequest } from "@/data/clubTransfers";

export function useClubTransfers(): ClubTransferRequest[] {
  const [rows, setRows] = useState<ClubTransferRequest[]>(() => listClubTransfers());

  const sync = useCallback(() => {
    setRows(listClubTransfers());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("padelhub-club-transfers-changed", sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "padelhub_club_transfer_requests") sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("padelhub-club-transfers-changed", sync);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", sync);
    };
  }, [sync]);

  return rows;
}
