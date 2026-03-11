import { useLocation } from "react-router-dom";
import RevealSection from "@/components/RevealSection";

const Placeholder = () => {
  const location = useLocation();
  const segment = location.pathname.slice(1).toLowerCase();
  const pageName =
    segment === "ranks"
      ? "UPCOMING EVENTS"
      : (segment || "home").toUpperCase();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pb-16">
      <RevealSection className="text-center">
        <h1 className="text-2xl font-bold tracking-widest text-muted-foreground">
          {pageName}
        </h1>
      </RevealSection>
    </div>
  );
};

export default Placeholder;
