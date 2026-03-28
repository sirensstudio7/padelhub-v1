import { useCallback, useEffect, useState } from "react";
import { getAllEvents, type Event } from "@/data/events";

export function useEventsList(): Event[] {
  const [events, setEvents] = useState<Event[]>(getAllEvents);

  const sync = useCallback(() => {
    setEvents(getAllEvents());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("padelhub-events-changed", sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "padelhub_custom_events") sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("padelhub-events-changed", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [sync]);

  return events;
}
