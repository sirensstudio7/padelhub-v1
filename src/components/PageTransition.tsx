import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

const DURATION = 0.35;
const EASE = "power2.out";

type PageTransitionProps = {
  children: ReactNode;
};

/**
 * Wraps page content and runs a smooth enter animation (fade + slide up)
 * when the page mounts. Use once per route so transitions between pages feel smooth.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: DURATION, ease: EASE, overwrite: true }
    );
  }, []);

  return <div ref={rootRef}>{children}</div>;
};

export default PageTransition;
