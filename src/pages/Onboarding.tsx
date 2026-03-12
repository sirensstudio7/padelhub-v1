import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1920&q=80&auto=format&fit=crop`;

const PAGES = [
  { title: "Your Padel Journey\nBegins Here", image: UNSPLASH("1770230901556-4e1c0bacfb09") },
  { title: "Clubs &\nLeaderboards", image: UNSPLASH("1743456110628-6508997cf730") },
  { title: "Ready to\nPlay", image: UNSPLASH("1686721134997-a43d7de8de1a") },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { isLoggedIn, completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const isLast = step === PAGES.length - 1;
  const page = PAGES[step];

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
      navigate("/", { replace: true });
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Top section: vibrant color + curved bottom edge */}
      <div className="relative flex-[0_0_58%] min-h-[55vh] flex flex-col items-center justify-center pt-[env(safe-area-inset-top)] pt-12 pb-0 px-4 overflow-hidden">
        {/* HD padel background image inside the shape */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${page.image})`,
            mask: "radial-gradient(60% 70px at bottom, #0000 calc(100% - 2px), #000)",
            WebkitMask: "radial-gradient(60% 70px at bottom, #0000 calc(100% - 2px), #000)",
          }}
          aria-hidden
        />
      </div>

      {/* Bottom section: white */}
      <div className="flex-1 flex flex-col items-center px-6 pt-6 pb-8 max-w-lg mx-auto w-full">
        {/* Step indicator */}
        <span className="text-sm font-medium text-primary/80 font-['Space_Grotesk'] mb-3">
          Step {String(step + 1).padStart(2, "0")}
        </span>

        {/* Main heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-['Space_Grotesk'] text-center leading-tight max-w-[320px] mb-8 whitespace-pre-line">
          {page.title}
        </h1>

        {/* Circular Next / Get started button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label={isLast ? "Get started" : "Next"}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={28} strokeWidth={2} />
        </button>

        {/* Vertical bar page indicators (clickable) */}
        <div className="flex items-center justify-center gap-2 mt-10" role="tablist" aria-label="Onboarding steps">
          {PAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-label={`Go to step ${i + 1}`}
              aria-selected={i === step}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                i === step
                  ? "w-1.5 h-6 bg-primary"
                  : "w-1.5 h-4 bg-muted-foreground/25 hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
