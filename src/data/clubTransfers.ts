const STORAGE_KEY = "padelhub_club_transfer_requests";

export type ClubTransferRequestStatus = "pending" | "approved" | "rejected";

export interface ClubTransferRequest {
  id: string;
  playerId: string;
  playerName: string;
  /** Club that is releasing the player (initiator). */
  fromClubName: string;
  /** Receiving club — its owner must approve in this demo. */
  toClubName: string;
  status: ClubTransferRequestStatus;
  createdAt: string;
  resolvedAt?: string;
}

/** Compare club names loosely (trim, case, newlines / spaces). */
export function normClubLabel(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ");
}

export function clubsMatch(a: string, b: string): boolean {
  return normClubLabel(a) === normClubLabel(b);
}

function readAll(): ClubTransferRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is ClubTransferRequest =>
        r != null &&
        typeof r === "object" &&
        typeof (r as ClubTransferRequest).id === "string" &&
        typeof (r as ClubTransferRequest).playerId === "string" &&
        typeof (r as ClubTransferRequest).playerName === "string" &&
        typeof (r as ClubTransferRequest).fromClubName === "string" &&
        typeof (r as ClubTransferRequest).toClubName === "string" &&
        ((r as ClubTransferRequest).status === "pending" ||
          (r as ClubTransferRequest).status === "approved" ||
          (r as ClubTransferRequest).status === "rejected") &&
        typeof (r as ClubTransferRequest).createdAt === "string"
    );
  } catch {
    return [];
  }
}

function writeAll(rows: ClubTransferRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new CustomEvent("padelhub-club-transfers-changed"));
}

export function listClubTransfers(): ClubTransferRequest[] {
  return readAll();
}

export function createTransferRequest(p: {
  playerId: string;
  playerName: string;
  fromClubName: string;
  toClubName: string;
}): ClubTransferRequest | null {
  const from = p.fromClubName.trim();
  const to = p.toClubName.trim();
  if (!from || !to || clubsMatch(from, to)) return null;

  const rows = readAll();
  const dup = rows.some(
    (r) =>
      r.status === "pending" &&
      r.playerId === p.playerId &&
      clubsMatch(r.fromClubName, from)
  );
  if (dup) return null;

  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `xfer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const row: ClubTransferRequest = {
    id,
    playerId: p.playerId,
    playerName: p.playerName.trim(),
    fromClubName: from,
    toClubName: to,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  writeAll([...rows, row]);
  return row;
}

export function setTransferRequestStatus(id: string, status: "approved" | "rejected"): void {
  const rows = readAll();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return;
  const cur = rows[idx]!;
  if (cur.status !== "pending") return;
  const next = [...rows];
  next[idx] = {
    ...cur,
    status,
    resolvedAt: new Date().toISOString(),
  };
  writeAll(next);
}

export function getIncomingPendingForClub(clubName: string): ClubTransferRequest[] {
  return readAll().filter((r) => r.status === "pending" && clubsMatch(r.toClubName, clubName));
}

export function getOutgoingForClub(clubName: string): ClubTransferRequest[] {
  return readAll().filter((r) => clubsMatch(r.fromClubName, clubName));
}

export function hasPendingOutgoingTransfer(playerId: string, fromClubName: string): boolean {
  return readAll().some(
    (r) => r.status === "pending" && r.playerId === playerId && clubsMatch(r.fromClubName, fromClubName)
  );
}

export function isPlayerTransferredOut(playerId: string, fromClubName: string): boolean {
  return readAll().some(
    (r) =>
      r.status === "approved" && r.playerId === playerId && clubsMatch(r.fromClubName, fromClubName)
  );
}
