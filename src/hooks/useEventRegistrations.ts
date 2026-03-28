import { useCallback, useEffect, useState } from "react";
import { getRegistrationsForEvent, type EventRegistration } from "@/data/eventRegistrations";

export function useEventRegistrations(eventId: string | undefined): EventRegistration[] {
  const [rows, setRows] = useState<EventRegistration[]>(() =>
    eventId ? getRegistrationsForEvent(eventId) : []
  );

  const sync = useCallback(() => {
    if (!eventId) {
      setRows([]);
      return;
    }
    setRows(getRegistrationsForEvent(eventId));
  }, [eventId]);

  useEffect(() => {
    sync();
    window.addEventListener("padelhub-event-registrations-changed", sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "padelhub_event_registrations") sync();
    };
    window.addEventListener("storage", onStorage);
    const onFocus = () => sync();
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("padelhub-event-registrations-changed", sync);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [sync]);

  return rows;
}
