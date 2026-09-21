"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const TICK_MS = 80;
const BASE_TICKS = 4;
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

// Flickers each letter through a few random characters before it settles,
// left to right, once the text scrolls into view - like an airport or
// station split-flap board resolving on a destination.
export default function DestinationBoard({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const chars = useMemo(() => text.split(""), [text]);
  const settleAt = useMemo(() => chars.map((_, i) => BASE_TICKS + i), [chars]);
  const maxTick = BASE_TICKS + chars.length;

  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  const [phase, setPhase] = useState<"idle" | "animating" | "done">("idle");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            io.unobserve(entry.target);
            setPhase("animating");
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "animating") return;
    if (tick >= maxTick) {
      setPhase("done");
      return;
    }
    const id = setTimeout(() => setTick((v) => v + 1), TICK_MS);
    return () => clearTimeout(id);
  }, [phase, tick, maxTick]);

  return (
    <span ref={wrapRef} className={className}>
      <span aria-hidden="true">
        {chars.map((c, i) => {
          if (c === " ") return <span key={i}>&nbsp;</span>;
          const settled = phase !== "animating" || tick >= settleAt[i];
          const shown = settled ? c : randomChar();
          return (
            <span key={i} className="hi-flap-cell">
              <span key={settled ? "settled" : tick} className={settled ? "" : "hi-flap-turn"}>
                {shown}
              </span>
            </span>
          );
        })}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
