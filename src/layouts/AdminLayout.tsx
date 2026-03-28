import { useEffect } from "react";

const DEFAULT_VIEWPORT = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
const ADMIN_VIEWPORT = "width=device-width, initial-scale=1";

/**
 * Desktop-oriented shell for admin: wide max width, subtle chrome, and a normal viewport
 * (pinch-zoom allowed) instead of the member PWA viewport.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const prev = meta?.getAttribute("content") ?? DEFAULT_VIEWPORT;
    meta?.setAttribute("content", ADMIN_VIEWPORT);
    document.documentElement.classList.add("admin-route");
    return () => {
      meta?.setAttribute("content", prev);
      document.documentElement.classList.remove("admin-route");
    };
  }, []);

  return <div className="min-h-screen w-full bg-muted/30 text-foreground">{children}</div>;
}
