/** Set on signup (local demo) — `"player"` | `"club"`. */
export const ACCOUNT_ROLE_STORAGE_KEY = "padelhub_account_role";

export type SignupAccountRole = "player" | "club";

export function getStoredSignupAccountRole(): SignupAccountRole | null {
  try {
    const v = localStorage.getItem(ACCOUNT_ROLE_STORAGE_KEY);
    if (v === "player" || v === "club") return v;
    return null;
  } catch {
    return null;
  }
}
