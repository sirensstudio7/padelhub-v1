import { useCallback, useEffect, useState } from "react";
import { ACCOUNT_ROLE_STORAGE_KEY, getStoredSignupAccountRole, type SignupAccountRole } from "@/lib/accountRole";

export function useAccountRole(): SignupAccountRole | null {
  const [role, setRole] = useState<SignupAccountRole | null>(() => getStoredSignupAccountRole());

  const sync = useCallback(() => {
    setRole(getStoredSignupAccountRole());
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACCOUNT_ROLE_STORAGE_KEY || e.key === null) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", sync);
    };
  }, [sync]);

  return role;
}
