import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  /** Stagger animation for direct children (e.g. list items). Default false. */
  stagger?: boolean;
  /** Stagger delay between children in seconds. Used when stagger is true. */
  staggerDelay?: number;
  /** Start state: opacity and y. Default: { opacity: 0, y: 24 }. */
  from?: gsap.TweenVars;
  /** End state. Default: { opacity: 1, y: 0 }. */
  to?: gsap.TweenVars;
  /** ScrollTrigger start. Default: "top 88%" (when top of element hits 88% down viewport). */
  start?: string;
  /** Animation duration in seconds. Default 0.5. */
  duration?: number;
};

const defaultFrom = { opacity: 0, y: 24 };
const defaultTo = { opacity: 1, y: 0 };

/**
 * Wraps content and reveals it with GSAP ScrollTrigger when the section
 * scrolls into view. Use on sections/blocks across all pages for consistent reveal animation.
 */
const RevealSection = ({
  children,
  className,
  stagger = false,
  staggerDelay = 0.08,
  from = defaultFrom,
  to = defaultTo,
  start = "top 88%",
  duration = 0.5,
}: RevealSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (stagger) {
        const children = el.querySelectorAll(":scope > *");
        gsap.fromTo(
          children,
          { ...from },
          {
            ...to,
            duration,
            stagger: staggerDelay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: "play none none none",
            },
          }
        );
      } else {
        gsap.fromTo(
          el,
          { ...from },
          {
            ...to,
            duration,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [stagger, staggerDelay, start, duration, from, to]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

export default RevealSection;
