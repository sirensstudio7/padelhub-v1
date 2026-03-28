export type RegistrationSuccessNotification = {
  id: string;
  eventId: string;
  eventTitle: string;
  createdAt: string;
  read: boolean;
};

const STORAGE_KEY = "padelhub_registration_notifications";

function readAll(): RegistrationSuccessNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((raw): RegistrationSuccessNotification | null => {
        if (raw == null || typeof raw !== "object") return null;
        const n = raw as Record<string, unknown>;
        if (
          typeof n.id !== "string" ||
          typeof n.eventId !== "string" ||
          typeof n.eventTitle !== "string" ||
          typeof n.createdAt !== "string"
        ) {
          return null;
        }
        return {
          id: n.id,
          eventId: n.eventId,
          eventTitle: n.eventTitle,
          createdAt: n.createdAt,
          read: typeof n.read === "boolean" ? n.read : false,
        };
      })
      .filter((n): n is RegistrationSuccessNotification => n != null);
  } catch {
    return [];
  }
}

function writeAll(rows: RegistrationSuccessNotification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* quota */
  }
  window.dispatchEvent(new CustomEvent("padelhub-registration-notifications-changed"));
}

export function getRegistrationSuccessNotifications(): RegistrationSuccessNotification[] {
  return [...readAll()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUnreadRegistrationSuccessCount(): number {
  return readAll().filter((n) => !n.read).length;
}

/** Call after a successful event registration (public form). */
export function addRegistrationSuccessNotification(eventId: string, eventTitle: string): void {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `rn-${Date.now()}`;
  const row: RegistrationSuccessNotification = {
    id,
    eventId,
    eventTitle: eventTitle.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  writeAll([row, ...readAll()]);
}

export function markAllRegistrationSuccessNotificationsRead(): void {
  const next = readAll().map((n) => ({ ...n, read: true }));
  writeAll(next);
}

export function markRegistrationSuccessNotificationRead(id: string): void {
  const next = readAll().map((n) => (n.id === id ? { ...n, read: true } : n));
  writeAll(next);
}
