export type NotificationType = "follow" | "comment" | "like" | "invite" | "event";

export type Notification = {
  id: string;
  type: NotificationType;
  username: string;
  avatarUrl?: string;
  /** For comment: the comment text. */
  commentText?: string;
  /** For invite: the club or place name. */
  inviteTarget?: string;
  /** For event: short event description. */
  eventTitle?: string;
  /** e.g. "Thursday 4:20pm" */
  timestamp: string;
  /** e.g. "2 hours ago" */
  timeAgo: string;
  unread: boolean;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "follow",
    username: "frankiesullivan",
    timestamp: "Thursday 4:20pm",
    timeAgo: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    type: "event",
    username: "padelhub",
    eventTitle: "Club night at Central — 7pm",
    timestamp: "Thursday 3:12pm",
    timeAgo: "3 hours ago",
    unread: true,
  },
  {
    id: "3",
    type: "like",
    username: "eleanor_mac",
    timestamp: "Thursday 2:45pm",
    timeAgo: "4 hours ago",
    unread: false,
  },
  {
    id: "4",
    type: "invite",
    username: "ollie_diggs",
    inviteTarget: "Sisyphus Dashboard",
    timestamp: "Thursday 1:30pm",
    timeAgo: "5 hours ago",
    unread: false,
  },
  {
    id: "5",
    type: "follow",
    username: "david_chen",
    timestamp: "Wednesday 6:00pm",
    timeAgo: "1 day ago",
    unread: false,
  },
];

export const NOTIFICATION_COUNTS = {
  viewAll: MOCK_NOTIFICATIONS.length,
  events: MOCK_NOTIFICATIONS.filter((n) => n.type === "event").length,
  followers: MOCK_NOTIFICATIONS.filter((n) => n.type === "follow").length,
  invites: MOCK_NOTIFICATIONS.filter((n) => n.type === "invite").length,
};
