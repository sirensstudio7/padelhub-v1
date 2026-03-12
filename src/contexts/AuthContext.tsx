import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const AUTH_KEY = "padelhub_logged_in";
const ONBOARDING_KEY = "padelhub_onboarding_done";

type AuthContextValue = {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const getStoredAuth = (): boolean => {
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
};

const getStoredOnboardingDone = (): boolean => {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(getStoredAuth);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(getStoredOnboardingDone);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem(AUTH_KEY, "true");
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true);
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, hasCompletedOnboarding, login, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
