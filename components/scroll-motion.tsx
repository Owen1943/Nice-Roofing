"use client";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const subscribe = () => () => {};
function useMotionReady() {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const reduced = useReducedMotion();
  return hydrated && reduced === false;
}

/** Server markup stays visible. Enhance only after hydration; focus always reveals. */
export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useMotionReady();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"],
  );
  return (
    <motion.div
      ref={ref}
      className="scroll-reveal"
      style={enabled ? { clipPath } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function HeroVisual({
  image,
  children,
}: {
  image: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useMotionReady();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.09]);
  return (
    <div ref={ref} className="hero-visual">
      <motion.div
        className="hero-media"
        style={enabled ? { y, scale } : undefined}
      >
        {image}
      </motion.div>
      {children}
    </div>
  );
}
