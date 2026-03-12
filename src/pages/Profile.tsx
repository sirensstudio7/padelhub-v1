import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  SentIcon,
  MoreVerticalCircle01Icon,
  Award01Icon,
  GemIcon,
  Location01Icon,
  InstagramIcon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { getPlayerProfile, getCurrentUserId } from "@/data/playerProfile";
import { getClubByName } from "@/data/mockClubs";
import { useProfileOverrides } from "@/contexts/ProfileOverridesContext";
import { useAuth } from "@/contexts/AuthContext";
import SafeImage from "@/components/SafeImage";
import RevealSection from "@/components/RevealSection";
import NotFound from "./NotFound";

const LEVEL_REWARDS = [
  { level: 1, multiplier: 2 },
  { level: 2, multiplier: 4 },
  { level: 3, multiplier: 6 },
  { level: 4, multiplier: 8 },
  { level: 5, multiplier: 10 },
  { level: 6, multiplier: 1 },
];

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { overrides, setOverrides } = useProfileOverrides();
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPosition, setEditPosition] = useState<"left" | "right">("left");
  const [editLocation, setEditLocation] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const avatarFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) {
      const currentId = getCurrentUserId();
      if (currentId) navigate(`/profile/${currentId}`, { replace: true });
    }
  }, [userId, navigate]);

  const effectiveUserId = userId ?? getCurrentUserId();
  const baseProfile = effectiveUserId ? getPlayerProfile(effectiveUserId) : null;
  const isSelf = effectiveUserId === getCurrentUserId();

  const profile = baseProfile
    ? {
        ...baseProfile,
        name: overrides.name !== undefined && overrides.name !== null ? overrides.name : baseProfile.name,
        avatarUrl: overrides.avatarUrl !== undefined ? overrides.avatarUrl ?? baseProfile.avatarUrl : baseProfile.avatarUrl,
        position: overrides.position !== undefined && overrides.position !== null ? overrides.position : baseProfile.position,
        location: overrides.location !== undefined && overrides.location !== null ? overrides.location : baseProfile.location,
        clubJoined: overrides.clubJoined !== undefined ? overrides.clubJoined ?? baseProfile.clubJoined : baseProfile.clubJoined,
        clubLogoUrl: overrides.clubLogoUrl !== undefined ? overrides.clubLogoUrl ?? baseProfile.clubLogoUrl : baseProfile.clubLogoUrl,
      }
    : null;

  const openEdit = () => {
    setEditName(profile!.name);
    setEditPosition(profile!.position ?? "left");
    setEditLocation(profile!.location ?? "");
    setEditAvatarUrl(profile!.avatarUrl ?? "");
    setEditOpen(true);
  };

  const saveEdit = () => {
    setOverrides({
      name: editName || undefined,
      position: editPosition,
      location: editLocation || undefined,
      avatarUrl: editAvatarUrl || undefined,
    });
    setEditOpen(false);
  };

  const onAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (!profile) {
    return <NotFound />;
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      {/* Header: back left, Profile center, settings right */}
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
          <h1 className="text-xl font-semibold text-foreground font-['Space_Grotesk'] flex-1 text-center">
            Profile
          </h1>
          <div className="flex items-center gap-0 shrink-0">
            <button
              type="button"
              aria-label="Share"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <HugeiconsIcon icon={SentIcon} size={24} color="currentColor" strokeWidth={1.5} />
            </button>
            {isSelf ? (
              <button
                type="button"
                aria-label="Edit profile"
                onClick={openEdit}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <HugeiconsIcon icon={Edit02Icon} size={24} color="currentColor" strokeWidth={1.5} />
              </button>
            ) : (
              <button
                type="button"
                aria-label="More options"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <HugeiconsIcon icon={MoreVerticalCircle01Icon} size={24} color="currentColor" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        <RevealSection>
        <div className="rounded-xl border border-border bg-[#232323] p-4 flex flex-col gap-6 text-white">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 shrink-0 rounded-full overflow-hidden border-2 border-white/30 bg-white/10">
              {profile.avatarUrl && (
                <AvatarImage src={profile.avatarUrl} alt={profile.name} className="object-cover" />
              )}
            <AvatarFallback className="bg-white/20 text-white text-2xl font-bold font-['Space_Grotesk']">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 pt-0.5">
            <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] truncate">
              {profile.name}
            </h2>
            <div className="flex items-center gap-2 mt-[4px] text-white/70">
              <span className="text-xs font-['Space_Grotesk'] shrink-0">Position</span>
              <span className="text-sm font-medium tracking-wide capitalize">
                {profile.position ? `${profile.position} side` : "—"}
              </span>
            </div>
            {/* Tier: low bronze, bronze, silver, gold, platinum — circle + text with tier color */}
            {(() => {
              const tiers = ["low bronze", "bronze", "silver", "gold", "platinum"] as const;
              const tierColors = ["#6B4423", "#CD7F32", "#C0C0C0", "#DAA520", "#E5E4E2"];
              const idx = Math.min(profile.level, 5) - 1;
              const tier = tiers[idx] ?? "low bronze";
              const color = tierColors[idx] ?? tierColors[0];
              return (
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-white capitalize font-['Space_Grotesk']">
                    {tier}
                  </span>
                </div>
              );
            })()}
          </div>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap w-full">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-white/70 font-['Space_Grotesk']">Rank</span>
              <span className="text-2xl font-bold text-white font-['Space_Grotesk']">
                #{profile.rank}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-white/70 font-['Space_Grotesk']">Winning</span>
              <div className="flex items-start gap-2">
                <HugeiconsIcon icon={Award01Icon} size={24} color="currentColor" strokeWidth={1.5} className="shrink-0 mt-0.5 text-amber-400" aria-hidden />
                <div>
                  <span className="block text-lg font-bold text-white font-['Space_Grotesk']">
                    {profile.top3Finishes}
                  </span>
                </div>
              </div>
            </div>
            {profile.clubJoined != null && (() => {
              const club = getClubByName(profile.clubJoined!);
              const clubId = club?.id;
              const chip = (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 pl-1 pr-3 py-1 text-sm font-medium text-white font-['Space_Grotesk'] w-fit">
                  <SafeImage
                    src={profile.clubLogoUrl}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                    fallback={
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
                        {profile.clubJoined.charAt(0)}
                      </span>
                    }
                  />
                  <span className="truncate max-w-[140px]">{profile.clubJoined}</span>
                </span>
              );
              return (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-white/70 font-['Space_Grotesk']">Club Joined</span>
                  {clubId ? (
                    <Link to={`/library/${clubId}`} className="w-fit no-underline [color:inherit] hover:opacity-90 transition-opacity">
                      {chip}
                    </Link>
                  ) : (
                    chip
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        </RevealSection>

        <RevealSection>
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="w-full h-auto p-0 bg-transparent border-b border-border rounded-none gap-0">
            <TabsTrigger
              value="stats"
              className="flex-1 rounded-none border-b-2 border-transparent bg-transparent py-3 text-muted-foreground font-['Space_Grotesk'] font-medium data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex-1 rounded-none border-b-2 border-transparent bg-transparent py-3 text-muted-foreground font-['Space_Grotesk'] font-medium data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            >
              Achievements
            </TabsTrigger>
            <TabsTrigger
              value="match"
              className="flex-1 rounded-none border-b-2 border-transparent bg-transparent py-3 text-muted-foreground font-['Space_Grotesk'] font-medium data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            >
              Match
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between min-h-[120px]">
                <span className="text-xs text-muted-foreground font-['Space_Grotesk']">Rank</span>
                <span className="text-3xl font-bold text-foreground font-['Space_Grotesk'] mt-1">#{profile.rank}</span>
              </div>
              <div className="rounded-2xl border border-border bg-primary p-5 flex flex-col justify-between min-h-[120px]">
                <span className="text-xs text-primary-foreground/80 font-['Space_Grotesk']">Points</span>
                <span className="text-xl font-bold text-primary-foreground font-['Space_Grotesk'] mt-1">
                  {profile.points.toLocaleString()}
                </span>
              </div>
              {profile.location != null && (
                <div className="col-span-2 rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={Location01Icon} size={20} color="currentColor" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-['Space_Grotesk']">Location</p>
                    <p className="text-sm font-semibold text-foreground font-['Space_Grotesk'] truncate">{profile.location}</p>
                  </div>
                </div>
              )}
              {profile.tiktok != null && (
                <a
                  href={`https://tiktok.com/${profile.tiktok.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 min-h-[72px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    <SafeImage
                      src="/reclub.png"
                      alt="Reclub"
                      className="w-6 h-6 object-contain"
                      fallback={<span className="text-sm font-bold text-muted-foreground">R</span>}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-['Space_Grotesk']">Reclub</p>
                    <p className="text-sm font-semibold text-foreground font-['Space_Grotesk'] truncate">{profile.tiktok}</p>
                  </div>
                </a>
              )}
              {profile.instagram != null && (
                <a
                  href={`https://instagram.com/${profile.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 min-h-[72px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={InstagramIcon} size={20} color="currentColor" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-['Space_Grotesk']">Instagram</p>
                    <p className="text-sm font-semibold text-foreground font-['Space_Grotesk'] truncate">{profile.instagram}</p>
                  </div>
                </a>
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-4">
            {/* Single horizontal row: large Level card first, then 6 smaller gems - matches reference */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1">
              <div className="shrink-0 w-28 flex flex-col items-center justify-center gap-1 p-4 rounded-2xl bg-primary text-primary-foreground">
                <span className="text-sm font-medium">Level {profile.level}</span>
                <div className="flex items-center gap-1">
                  <HugeiconsIcon icon={GemIcon} size={20} color="currentColor" strokeWidth={1.5} />
                  <span className="text-lg font-bold">x{profile.levelMultiplier}</span>
                </div>
              </div>
              {LEVEL_REWARDS.map(({ level, multiplier }) => (
                <div
                  key={level}
                  className={`shrink-0 w-16 flex flex-col items-center justify-center gap-0.5 py-3 px-2 rounded-xl border-2 ${
                    level === profile.level
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  <span className="text-xs font-medium">L{level}</span>
                  <span className="text-sm font-bold">x{multiplier}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Cards To Unlock ({profile.cardsToUnlock})
            </p>
          </TabsContent>

          <TabsContent value="match" className="mt-4">
            <div className="flex flex-col gap-3">
              {[
                { id: "1", date: "Today", opponent: "Jessica K. & David C.", score: "6-4, 6-3", won: true },
                { id: "2", date: "Yesterday", opponent: "Alexander M. & Sarah W.", score: "4-6, 6-4, 4-6", won: false },
                { id: "3", date: "Mar 8", opponent: "Elena R. & James P.", score: "6-2, 6-1", won: true },
              ].map((m) => (
                <Link
                  key={m.id}
                  to={`/match/${m.id}`}
                  className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 no-underline text-inherit [color:inherit] hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground font-['Space_Grotesk'] truncate">
                      vs {m.opponent}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.date} · {m.score}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full font-['Space_Grotesk'] ${
                      m.won ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {m.won ? "Won" : "Lost"}
                  </span>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        </RevealSection>

        {isSelf && (
          <div className="pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl font-['Space_Grotesk'] text-muted-foreground border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              Log out
            </Button>
          </div>
        )}
      </div>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85dvh] overflow-y-auto font-['Space_Grotesk']">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24 rounded-full overflow-hidden border-2 border-border">
                  {editAvatarUrl ? (
                    <img src={editAvatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback className="text-2xl bg-muted text-foreground">
                      {editName.charAt(0) || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  ref={avatarFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Upload profile photo"
                  onChange={onAvatarFileChange}
                />
              </div>
              <div className="flex gap-2 w-full max-w-xs">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl"
                  onClick={() => avatarFileRef.current?.click()}
                >
                  Upload photo
                </Button>
              </div>
              <div className="w-full max-w-xs space-y-1.5">
                <Label className="text-muted-foreground">Or photo URL</Label>
                <Input
                  placeholder="https://..."
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <select
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value as "left" | "right")}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="left">Left side</option>
                <option value="right">Right side</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="City or region"
                className="rounded-xl"
              />
            </div>
          </div>
          <SheetFooter className="mt-4">
            <Button type="button" onClick={saveEdit} className="rounded-xl w-full sm:w-auto">
              Save changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Profile;
