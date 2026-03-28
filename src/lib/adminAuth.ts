const ADMIN_SESSION_KEY = "padelhub_admin_session";

/**
 * Default demo admin (change in production via `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`).
 */
export const DUMMY_ADMIN_ACCOUNT = {
  email: "admin@padelhub.com",
  password: "admin-demo-2025",
} as const;

function expectedAdminEmail(): string {
  const fromEnv = import.meta.env.VITE_ADMIN_EMAIL;
  return typeof fromEnv === "string" && fromEnv.trim().length > 0
    ? fromEnv.trim().toLowerCase()
    : DUMMY_ADMIN_ACCOUNT.email.toLowerCase();
}

function expectedAdminPassword(): string {
  const fromEnv = import.meta.env.VITE_ADMIN_PASSWORD;
  return typeof fromEnv === "string" && fromEnv.length > 0 ? fromEnv : DUMMY_ADMIN_ACCOUNT.password;
}

export function validateAdminCredentials(email: string, password: string): boolean {
  const e = email.trim().toLowerCase();
  return e === expectedAdminEmail() && password === expectedAdminPassword();
}

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(value: boolean): void {
  try {
    if (value) sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    else sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {}
}
