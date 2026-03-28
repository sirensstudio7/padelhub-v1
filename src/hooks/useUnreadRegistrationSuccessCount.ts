import { useCallback, useEffect, useState } from "react";
import { getUnreadRegistrationSuccessCount } from "@/data/registrationNotifications";

export function useUnreadRegistrationSuccessCount(): number {
  const [count, setCount] = useState(() => getUnreadRegistrationSuccessCount());
  const sync = useCallback(() => setCount(getUnreadRegistrationSuccessCount()), []);

  useEffect(() => {
    sync();
    window.addEventListener("padelhub-registration-notifications-changed", sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "padelhub_registration_notifications") sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("padelhub-registration-notifications-changed", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [sync]);

  return count;
}
