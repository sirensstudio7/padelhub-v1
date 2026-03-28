/**
 * Demo-only member logins (replace with real auth).
 * Passwords are intentionally simple for local / staging use.
 */
export const DEMO_MEMBER_ACCOUNTS: readonly { email: string; password: string }[] = [
  { email: "hi@padel.com", password: "testing" },
  { email: "player@padel.com", password: "demo123" },
  { email: "coach@padelhub.test", password: "padel-demo" },
  { email: "member@example.com", password: "welcome1" },
  { email: "rio@padelhub.local", password: "play2026" },
];

export function validateDemoMemberLogin(email: string, password: string): boolean {
  const e = email.trim().toLowerCase();
  return DEMO_MEMBER_ACCOUNTS.some(
    (a) => a.email.toLowerCase() === e && a.password === password
  );
}
