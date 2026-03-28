import { Link } from "react-router-dom";
import { NotificationBellLink } from "@/components/NotificationBellLink";
import SafeImage from "@/components/SafeImage";

export default function ClubPageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/club/players" className="flex items-center shrink-0" aria-label="Club home">
            <SafeImage
              src="/logo.png"
              alt="PadelHub"
              className="h-8 w-auto object-contain object-left"
              fallback={
                <span className="h-8 flex items-center text-lg font-bold text-primary font-['Space_Grotesk']">
                  PadelHub
                </span>
              }
            />
          </Link>
          <NotificationBellLink />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground font-['Space_Grotesk'] leading-relaxed">{subtitle}</p>
        ) : null}
      </div>
      <div className="max-w-lg mx-auto px-4">{children}</div>
    </div>
  );
}
