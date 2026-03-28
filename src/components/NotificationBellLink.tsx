import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { useUnreadRegistrationSuccessCount } from "@/hooks/useUnreadRegistrationSuccessCount";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function NotificationBellLink({ className }: Props) {
  const unread = useUnreadRegistrationSuccessCount();

  return (
    <Link
      to="/notifications"
      aria-label={
        unread > 0 ? `Notifications, ${unread} unread registration${unread > 1 ? "s" : ""}` : "Notifications"
      }
      className={cn(
        "relative inline-flex p-2 rounded-full text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
        className
      )}
    >
      <HugeiconsIcon icon={Notification01Icon} size={24} color="currentColor" strokeWidth={1.5} />
      {unread > 0 ? (
        <span
          className="absolute right-1 top-1 flex h-2.5 min-w-[10px] rounded-full bg-primary ring-2 ring-background"
          aria-hidden
        />
      ) : null}
    </Link>
  );
}
