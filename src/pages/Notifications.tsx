import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Tick02Icon, HeartAddIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_COUNTS,
  type Notification,
  type NotificationType,
} from "@/data/mockNotifications";

const FILTERS: { key: "viewAll" | "events" | "followers" | "invites"; label: string; count: number }[] = [
  { key: "viewAll", label: "View all", count: NOTIFICATION_COUNTS.viewAll },
  { key: "events", label: "Events", count: NOTIFICATION_COUNTS.events },
  { key: "followers", label: "Followers", count: NOTIFICATION_COUNTS.followers },
  { key: "invites", label: "Invites", count: NOTIFICATION_COUNTS.invites },
];

const getActionText = (n: Notification): string => {
  switch (n.type) {
    case "follow":
      return "followed you";
    case "comment":
      return "commented on your post";
    case "like":
      return "liked your post";
    case "invite":
      return n.inviteTarget ? `invited you to ${n.inviteTarget}` : "invited you";
    case "event":
      return n.eventTitle ?? "new event";
    default:
      return "";
  }
};

const filterByTab = (notifications: Notification[], activeFilter: string): Notification[] => {
  if (activeFilter === "viewAll") return notifications;
  const typeMap: Record<string, NotificationType> = {
    events: "event",
    followers: "follow",
    invites: "invite",
  };
  const type = typeMap[activeFilter];
  return type ? notifications.filter((n) => n.type === type) : notifications;
};

const Notifications = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"viewAll" | "events" | "followers" | "invites">("viewAll");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const filtered = filterByTab(notifications, activeFilter);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-[100dvh] bg-muted/40 pb-16">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 -ml-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-semibold text-foreground font-['Space_Grotesk']">
            Notifications
          </h1>
          <div className="w-10 shrink-0" aria-hidden />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* White card container - matches reference */}
        <div className="rounded-2xl shadow-sm overflow-hidden">
          <div className="p-0">
            {/* Header: title + Mark all as read */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight">
                Your notifications
              </h2>
              <button
                type="button"
                onClick={markAllRead}
                className="shrink-0 text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded font-['Space_Grotesk'] flex items-center gap-1.5"
              >
                <HugeiconsIcon icon={Tick02Icon} size={16} color="currentColor" strokeWidth={2} />
                Mark all as read
              </button>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {FILTERS.map(({ key, label, count }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilter(key)}
                  className={`px-3 py-2 rounded-xl text-sm font-['Space_Grotesk'] transition-colors ${
                    activeFilter === key
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label} {count}
                </button>
              ))}
            </div>

            {/* Notification list */}
            <div className="flex flex-col divide-y divide-border">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground font-['Space_Grotesk']">
                  No notifications in this tab.
                </p>
              ) : (
                filtered.map((n) => (
                  <div
                    key={n.id}
                    className="py-4 flex gap-3 items-start hover:bg-muted/50 transition-colors -mx-2 px-2 rounded-lg cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10 rounded-full overflow-hidden border border-border">
                        <AvatarImage src={n.avatarUrl} alt={n.username} className="object-cover" />
                        <AvatarFallback className="bg-secondary text-foreground text-sm font-semibold font-['Space_Grotesk']">
                          {n.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {n.type === "like" && (
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                          aria-hidden
                        >
                          <HugeiconsIcon icon={HeartAddIcon} size={12} color="white" strokeWidth={2} />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-['Space_Grotesk']">
                        <span className="font-medium">@{n.username}</span>{" "}
                        <span className="text-muted-foreground">{getActionText(n)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-['Space_Grotesk']">
                        {n.timestamp}
                      </p>
                      {n.type === "comment" && n.commentText && (
                        <p className="mt-2 text-sm text-muted-foreground font-['Space_Grotesk'] pl-2 border-l-2 border-muted">
                          {n.commentText}
                        </p>
                      )}
                      {n.type === "invite" && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-lg font-['Space_Grotesk']"
                          >
                            Decline
                          </Button>
                          <Button type="button" size="sm" className="rounded-lg font-['Space_Grotesk']">
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 flex items-start gap-2">
                      <span className="text-xs text-muted-foreground font-['Space_Grotesk'] whitespace-nowrap">
                        {n.timeAgo}
                      </span>
                      {n.unread && (
                        <span
                          className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"
                          aria-label="Unread"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
