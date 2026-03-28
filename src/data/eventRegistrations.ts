import { mockLeaderboard } from "@/data/mockLeaderboard";

export type RegistrationStatus = "pending" | "approved" | "rejected";

export interface EventRegistration {
  id: string;
  /** Auto-generated display label for the registrant */
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: "m" | "f";
  tshirtSize?: string;
  /** ISO timestamp */
  registeredAt: string;
  /** Missing on legacy rows — treated as approved. New sign-ups start as pending. */
  status?: RegistrationStatus;
}

/** Legacy rows without `status` count as approved so existing data keeps working. */
export function normalizeRegistrationStatus(r: EventRegistration): RegistrationStatus {
  const s = r.status;
  if (s === "pending" || s === "approved" || s === "rejected") return s;
  return "approved";
}

export function getApprovedRegistrationsForEvent(eventId: string): EventRegistration[] {
  return getRegistrationsForEvent(eventId).filter((r) => normalizeRegistrationStatus(r) === "approved");
}

/** Pending + approved (rejected frees a slot for a new application). */
export function getRegistrationSlotsUsed(eventId: string): number {
  return getRegistrationsForEvent(eventId).filter((r) => {
    const s = normalizeRegistrationStatus(r);
    return s === "pending" || s === "approved";
  }).length;
}

function randomInt(max: number): number {
  if (max <= 0) return 0;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % max;
  }
  return Math.floor(Math.random() * max);
}

/** Random player-style full name (same tone as profile cards, e.g. “Sarah Wilson”). Read-only on the form. */
export function generateRegistrationDisplayName(): string {
  const i = randomInt(mockLeaderboard.length);
  return mockLeaderboard[i]?.name ?? "Guest Player";
}

const STORAGE_KEY = "padelhub_event_registrations";

function readAll(): Record<string, EventRegistration[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, EventRegistration[]>;
  } catch {
    return {};
  }
}

export function getRegistrationsForEvent(eventId: string): EventRegistration[] {
  const list = readAll()[eventId];
  if (!Array.isArray(list)) return [];
  return list.filter(
    (r): r is EventRegistration =>
      r != null &&
      typeof r === "object" &&
      typeof r.id === "string" &&
      typeof r.name === "string" &&
      typeof r.registeredAt === "string" &&
      (r.status === undefined ||
        r.status === "pending" ||
        r.status === "approved" ||
        r.status === "rejected")
  );
}

export function setRegistrationStatus(
  eventId: string,
  registrationId: string,
  status: RegistrationStatus
): void {
  const rows = getRegistrationsForEvent(eventId);
  const idx = rows.findIndex((r) => r.id === registrationId);
  if (idx === -1) return;
  const next = [...rows];
  next[idx] = { ...next[idx]!, status };
  setRegistrationsForEvent(eventId, next);
}

export function setRegistrationsForEvent(eventId: string, rows: EventRegistration[]): void {
  const all = readAll();
  all[eventId] = rows;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new CustomEvent("padelhub-event-registrations-changed"));
}

/** Append one registration (public form or legacy callers). */
export function addRegistrationForEvent(
  eventId: string,
  partial: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    gender?: "m" | "f";
    tshirtSize?: string;
  }
): EventRegistration {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `reg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const row: EventRegistration = {
    id,
    name: partial.name.trim(),
    email: partial.email?.trim() || undefined,
    phone: partial.phone?.trim() || undefined,
    address: partial.address?.trim() || undefined,
    gender: partial.gender,
    tshirtSize: partial.tshirtSize?.trim() || undefined,
    registeredAt: new Date().toISOString(),
    status: "pending",
  };
  const next = [...getRegistrationsForEvent(eventId), row];
  setRegistrationsForEvent(eventId, next);
  return row;
}
