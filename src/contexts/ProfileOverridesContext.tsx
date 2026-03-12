import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const STORAGE_KEY = "padelhub_profile_overrides";

export type ProfileOverrides = {
  avatarUrl?: string | null;
  name?: string | null;
  position?: "left" | "right" | null;
  location?: string | null;
  clubJoined?: string | null;
  clubLogoUrl?: string | null;
};

const loadOverrides = (): ProfileOverrides => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      avatarUrl: parsed.avatarUrl as string | null | undefined,
      name: parsed.name as string | null | undefined,
      position: parsed.position as "left" | "right" | null | undefined,
      location: parsed.location as string | null | undefined,
      clubJoined: parsed.clubJoined as string | null | undefined,
      clubLogoUrl: parsed.clubLogoUrl as string | null | undefined,
    };
  } catch {
    return {};
  }
};

const saveOverrides = (o: ProfileOverrides) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
  } catch {}
};

type ContextValue = {
  overrides: ProfileOverrides;
  setOverrides: (updates: Partial<ProfileOverrides>) => void;
  clearOverrides: () => void;
};

const ProfileOverridesContext = createContext<ContextValue | null>(null);

export const ProfileOverridesProvider = ({ children }: { children: ReactNode }) => {
  const [overrides, setOverridesState] = useState<ProfileOverrides>(loadOverrides);

  const setOverrides = useCallback((updates: Partial<ProfileOverrides>) => {
    setOverridesState((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(updates)) {
        (next as Record<string, unknown>)[k] = v === undefined ? prev[k as keyof ProfileOverrides] : v;
      }
      saveOverrides(next);
      return next;
    });
  }, []);

  const clearOverrides = useCallback(() => {
    setOverridesState({});
    saveOverrides({});
  }, []);

  return (
    <ProfileOverridesContext.Provider value={{ overrides, setOverrides, clearOverrides }}>
      {children}
    </ProfileOverridesContext.Provider>
  );
};

export const useProfileOverrides = (): ContextValue => {
  const ctx = useContext(ProfileOverridesContext);
  if (!ctx) throw new Error("useProfileOverrides must be used within ProfileOverridesProvider");
  return ctx;
};
