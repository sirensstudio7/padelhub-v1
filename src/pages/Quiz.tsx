import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, Search01Icon, FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { mockLeaderboard } from "@/data/mockLeaderboard";
import { getPlayerProfile } from "@/data/playerProfile";
import LeaderboardRow from "@/components/LeaderboardRow";
import SafeImage from "@/components/SafeImage";
import RevealSection from "@/components/RevealSection";

const locationsFromPlayers = (): string[] => {
  const set = new Set<string>();
  mockLeaderboard.forEach((e) => {
    const profile = getPlayerProfile(e.id);
    if (profile?.location && profile.location !== "—") set.add(profile.location);
  });
  return Array.from(set).sort();
};

const Quiz = () => {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const locations = useMemo(() => locationsFromPlayers(), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [filterOpen]);

  const filteredPlayers = useMemo(() => {
    return mockLeaderboard.filter((entry) => {
      const profile = getPlayerProfile(entry.id);
      const location = profile?.location ?? "";
      const matchesSearch =
        !search.trim() ||
        entry.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        (location && location.toLowerCase().includes(search.toLowerCase().trim()));
      const matchesLocation = !locationFilter || location === locationFilter;
      return matchesSearch && matchesLocation;
    });
  }, [search, locationFilter]);

  return (
    <div className="min-h-[100dvh] bg-background pb-16">
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center shrink-0" aria-label="PadelHub home">
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
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="p-2 rounded-full text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors rounded-full"
          >
            <HugeiconsIcon icon={Notification01Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto mt-4">
        <div className="px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground font-['Space_Grotesk'] whitespace-nowrap">
            Player index
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and find players</p>
        </div>

        <div className="px-4 pb-4 flex flex-row gap-3 items-stretch">
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={20} color="currentColor" strokeWidth={1.5} />
            </span>
            <input
              type="search"
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-['Space_Grotesk']"
              aria-label="Search players"
            />
          </div>
          <div className="relative shrink-0" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              aria-label="Filter by location"
              aria-expanded={filterOpen}
              aria-haspopup="listbox"
              className="w-[42px] h-[42px] rounded-xl border border-border bg-white flex items-center justify-center text-foreground hover:bg-muted/50 hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
            >
              <HugeiconsIcon icon={FilterHorizontalIcon} size={22} color="currentColor" strokeWidth={1.5} />
            </button>
            {filterOpen && (
              <div
                role="listbox"
                aria-label="Location options"
                className="absolute right-0 top-full mt-2 min-w-[180px] py-1.5 rounded-xl bg-card border border-border shadow-lg shadow-black/5 z-50"
              >
                <button
                  role="option"
                  aria-selected={!locationFilter}
                  onClick={() => {
                    setLocationFilter("");
                    setFilterOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground font-['Space_Grotesk'] hover:bg-muted/60 focus:bg-muted/60 focus:outline-none transition-colors first:rounded-t-[11px]"
                >
                  All locations
                </button>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    role="option"
                    aria-selected={locationFilter === loc}
                    onClick={() => {
                      setLocationFilter(loc);
                      setFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground font-['Space_Grotesk'] hover:bg-muted/60 focus:bg-muted/60 focus:outline-none transition-colors last:rounded-b-[11px]"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <RevealSection stagger staggerDelay={0.05} className="flex flex-col gap-2 px-4 pb-8">
          {filteredPlayers.map((entry) => (
            <LeaderboardRow key={entry.id} entry={entry} />
          ))}
        </RevealSection>
      </div>
    </div>
  );
};

export default Quiz;
