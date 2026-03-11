import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import FireworksBackground from "@/components/FireworksBackground";
import { LeaderboardEntry, mockLeaderboard } from "@/data/mockLeaderboard";
import type { ClubRankingEntry } from "@/data/playerProfile";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import SafeImage from "@/components/SafeImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

const PodiumCard = ({
  entry,
  rank,
  heightClass,
  avatarSizeClass,
  widthClass = "w-28",
  nameSizeClass = "text-base",
  pointsSizeClass = "text-sm",
  displayName,
  onClickOverride,
}: {
  entry: LeaderboardEntry;
  rank: number;
  heightClass: string;
  avatarSizeClass: string;
  widthClass?: string;
  nameSizeClass?: string;
  pointsSizeClass?: string;
  displayName?: string;
  onClickOverride?: () => void;
}) => {
  const avatarUrl = entry.avatarUrl ?? `https://i.pravatar.cc/80?u=${entry.id}`;

  const cardContent = (
    <div
      className={`flex flex-col items-center rounded-2xl border border-border bg-card overflow-hidden shadow-sm ${heightClass} ${widthClass} shrink-0`}
    >
      <div className="flex-1 flex flex-col items-center w-full pt-4 pb-3">
        <div className="relative shrink-0">
          <div
            className={`${avatarSizeClass} rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-background shadow`}
          >
            <SafeImage
              src={avatarUrl}
              alt={entry.name}
              className="w-full h-full object-cover"
              fallback={
                <span className="text-muted-foreground font-bold font-['Space_Grotesk'] text-lg">
                  {entry.name.charAt(0)}
                </span>
              }
            />
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 flex items-center justify-center font-bold font-['Space_Grotesk'] shadow ${
              rank === 1
                ? "w-9 h-9 text-sm bg-[#FFD700] border-amber-600 text-amber-900"
                : rank === 2
                  ? "w-6 h-6 text-xs bg-[#C0C0C0] border-gray-500 text-gray-900"
                  : "w-6 h-6 text-xs bg-[#CD7F32] border-amber-800 text-white"
            }`}
            aria-label={`Rank ${rank}`}
          >
            {rank}
          </span>
        </div>
        <div className="mt-auto flex flex-col items-center gap-1.5 text-center">
          <span className={`${nameSizeClass} font-['Space_Grotesk'] font-medium line-clamp-2 px-1 text-foreground`}>
            {displayName ?? entry.name}
          </span>
          <span className={`${pointsSizeClass} font-bold text-primary font-['Space_Grotesk']`}>
            {entry.points.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  const wrapperClass = "flex flex-1 min-w-0 w-full flex-col items-center transition-opacity hover:opacity-90 no-underline text-inherit [color:inherit]";
  if (onClickOverride) {
    return (
      <button
        type="button"
        onClick={onClickOverride}
        className={wrapperClass}
      >
        {cardContent}
      </button>
    );
  }
  return (
    <Link to={`/profile/${entry.id}`} className={wrapperClass}>
      {cardContent}
    </Link>
  );
};

const ClubPodiumCard = ({
  club,
  rank,
  heightClass,
  avatarSizeClass = "w-12 h-12",
  widthClass = "w-full",
  nameSizeClass = "text-sm",
  pointsSizeClass = "text-xs",
}: {
  club: ClubRankingEntry;
  rank: number;
  heightClass: string;
  avatarSizeClass?: string;
  widthClass?: string;
  nameSizeClass?: string;
  pointsSizeClass?: string;
}) => {
  const cardContent = (
    <div
      className={`flex flex-col items-center rounded-2xl border border-border bg-card overflow-hidden shadow-sm ${heightClass} ${widthClass} shrink-0`}
    >
      <div className="flex-1 flex flex-col items-center w-full pt-4 pb-3">
        <div className="relative shrink-0">
          <div className={`${avatarSizeClass} rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-background shadow`}>
            <SafeImage
              src={club.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              fallback={
                <span className="text-muted-foreground font-bold font-['Space_Grotesk'] text-lg">
                  {club.name.charAt(0)}
                </span>
              }
            />
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 flex items-center justify-center font-bold font-['Space_Grotesk'] shadow ${
              rank === 1
                ? "w-9 h-9 text-sm bg-[#FFD700] border-amber-600 text-amber-900"
                : rank === 2
                  ? "w-6 h-6 text-xs bg-[#C0C0C0] border-gray-500 text-gray-900"
                  : "w-6 h-6 text-xs bg-[#CD7F32] border-amber-800 text-white"
            }`}
            aria-label={`Rank ${rank}`}
          >
            {rank}
          </span>
        </div>
        <div className="mt-auto flex flex-col items-center gap-1.5 text-center">
          <span className={`${nameSizeClass} font-['Space_Grotesk'] font-medium line-clamp-2 px-1 text-foreground`}>
            {club.name}
          </span>
          <span className={`${pointsSizeClass} font-bold text-primary font-['Space_Grotesk']`}>
            {club.totalPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Link
      to={`/library/${club.id}`}
      className="flex flex-1 min-w-0 flex-col items-center transition-opacity hover:opacity-90 no-underline text-inherit [color:inherit]"
    >
      {cardContent}
    </Link>
  );
};

interface PodiumProps {
  topThree: LeaderboardEntry[];
  topThreeClubs: ClubRankingEntry[];
  activeTab: "player" | "club";
  onTabChange: (tab: "player" | "club") => void;
}

const TOP_FIVE_PLAYERS = mockLeaderboard.filter((e) => e.rank <= 5);

// HD padel player / court images from Unsplash (w=1200, q=80)
const PADEL_CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1622163642998-1ee2a1d2a5f2?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1595435934249-5d17d4a1d6f2?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1617083274690-970a4b7380f0?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80&fit=crop",
];

const Podium = ({ topThree, topThreeClubs, activeTab, onTabChange }: PodiumProps) => {
  const navigate = useNavigate();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [rank1ModalOpen, setRank1ModalOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const first = topThree.find((e) => e.rank === 1);

  useEffect(() => {
    if (!carouselApi || !rank1ModalOpen) return;
    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselApi, rank1ModalOpen]);
  const second = topThree.find((e) => e.rank === 2);
  const third = topThree.find((e) => e.rank === 3);
  const clubFirst = topThreeClubs[0];
  const clubSecond = topThreeClubs[1];
  const clubThird = topThreeClubs[2];

  const handleContinueToRank1 = () => {
    setRank1ModalOpen(false);
    if (first) navigate(`/profile/${first.id}`);
  };

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const showPlayer = activeTab === "player" && first && second && third;
  const showClub = activeTab === "club" && clubFirst && clubSecond && clubThird;

  if (!showPlayer && !showClub) return null;

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-8 w-full max-w-lg mx-auto">
      {/* Banner: lime bg, subtitle, main title, pill, and podium cards inside */}
      <div ref={bannerRef} className="w-full rounded-2xl bg-[#c5dd00] p-4 text-left overflow-hidden">
        <p className="text-black/70 text-xs sm:text-sm font-['Space_Grotesk'] mb-1">
          Player index
        </p>
        <h2 className="font-bold font-['Space_Grotesk'] text-black tracking-tight leading-tight text-2xl sm:text-3xl">
          <div className="flex items-center justify-start gap-2 flex-wrap">
            <span className="title-line block text-[72px] leading-none">THE</span>
            <span className="title-line block text-left leading-[100%]"><span className="italic">PRIME</span><br /><span className="font-normal">SERIES</span></span>
          </div>
          <div className="flex items-center justify-start gap-2 flex-wrap -mt-4">
            <span className="title-line block text-[72px] leading-none shrink-0 italic">HUB</span>
            <span className="title-line block italic text-[48px] leading-none shrink-0 font-bold">Ranking</span>
          </div>
        </h2>
        <div className="flex flex-wrap rounded-full bg-[#015f4d] p-1 mt-2 w-full box-border border border-[#015f4d] font-['Space_Grotesk'] text-sm">
          <button
            type="button"
            onClick={() => onTabChange("player")}
            className={`flex-1 min-w-0 flex items-center justify-center rounded-full py-2 transition-all duration-150 ease-in-out ${
              activeTab === "player"
                ? "bg-[#c5dd00] font-semibold text-black shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            Player
          </button>
          <button
            type="button"
            onClick={() => onTabChange("club")}
            className={`flex-1 min-w-0 flex items-center justify-center rounded-full py-2 transition-all duration-150 ease-in-out ${
              activeTab === "club"
                ? "bg-[#c5dd00] font-semibold text-black shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            Club
          </button>
        </div>
        <div className="flex items-end justify-center gap-[8px] mt-6 min-h-52">
          {showPlayer ? (
            <>
              <PodiumCard
                entry={second}
                rank={2}
                heightClass="h-40"
                avatarSizeClass="w-12 h-12"
                widthClass="w-full"
                nameSizeClass="text-sm"
                pointsSizeClass="text-xs"
                displayName={firstName(second.name)}
              />
              <FireworksBackground burstFromCenter className="-mt-4 flex-[1.6] min-w-0 flex flex-col items-center rounded-2xl overflow-hidden [&_canvas]:rounded-2xl">
                <div className="relative z-10 w-full min-w-0">
                  <PodiumCard
                    entry={first}
                    rank={1}
                    heightClass="h-52"
                    avatarSizeClass="w-20 h-20"
                    widthClass="w-full"
                    displayName={firstName(first.name)}
                    onClickOverride={() => setRank1ModalOpen(true)}
                  />
                </div>
              </FireworksBackground>
              <PodiumCard
                entry={third}
                rank={3}
                heightClass="h-36"
                avatarSizeClass="w-12 h-12"
                widthClass="w-full"
                nameSizeClass="text-sm"
                pointsSizeClass="text-xs"
                displayName={firstName(third.name)}
              />
            </>
          ) : showClub ? (
            <>
              <ClubPodiumCard club={clubSecond} rank={2} heightClass="h-40" avatarSizeClass="w-12 h-12" nameSizeClass="text-sm" pointsSizeClass="text-xs" />
              <FireworksBackground burstFromCenter className="-mt-4 flex-[1.6] min-w-0 flex flex-col items-center rounded-2xl overflow-hidden [&_canvas]:rounded-2xl">
                <div className="relative z-10 w-full min-w-0">
                  <ClubPodiumCard club={clubFirst} rank={1} heightClass="h-52" avatarSizeClass="w-20 h-20" nameSizeClass="text-base" pointsSizeClass="text-sm" />
                </div>
              </FireworksBackground>
              <ClubPodiumCard club={clubThird} rank={3} heightClass="h-36" avatarSizeClass="w-12 h-12" nameSizeClass="text-sm" pointsSizeClass="text-xs" />
            </>
          ) : null}
        </div>
      </div>
      <Dialog open={rank1ModalOpen} onOpenChange={setRank1ModalOpen}>
        <DialogContent className="font-['Space_Grotesk'] max-w-md w-[calc(100%-32px)] rounded-2xl">
          <div className="w-[calc(100%+48px)] -mx-6 -mt-6 mb-1 overflow-hidden rounded-t-2xl aspect-[4/3] shrink-0">
            <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
              <CarouselContent className="ml-0">
                {TOP_FIVE_PLAYERS.map((player, index) => (
                  <CarouselItem key={player.id} className="pl-0">
                    <SafeImage
                      src={PADEL_CAROUSEL_IMAGES[index] ?? PADEL_CAROUSEL_IMAGES[0]}
                      alt={player.name}
                      className="w-full h-full object-cover aspect-[4/3]"
                      fallback={
                        <div className="w-full h-full aspect-[4/3] bg-muted flex items-center justify-center">
                          <span className="text-4xl font-bold text-muted-foreground font-['Space_Grotesk']">
                            {player.name.charAt(0)}
                          </span>
                        </div>
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <DialogHeader>
            <DialogTitle>See the best player</DialogTitle>
            <DialogDescription>
              You&apos;re about to view the profile of the #1 ranked player. Continue to see their stats, achievements, and more.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <button
              type="button"
              onClick={handleContinueToRank1}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Podium;
