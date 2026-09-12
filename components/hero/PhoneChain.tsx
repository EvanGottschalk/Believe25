"use client";

import { useEffect, useRef } from "react";
import { useAnimationFrame, useMotionValueEvent, useSpring } from "framer-motion";
import { SWING_SPRING } from "@/config/motion";
import { useReducedMotionSafe } from "@/lib/hooks";
import { CONTENT } from "@/config/content";

/**
 * The hero's phone chain, drawn entirely in SVG so it needs no photography and
 * stays crisp at any size.
 *
 * The chain physically swings: pointer position (and device tilt, where the
 * browser offers it without a permission prompt) sets a target angle, a spring
 * smooths it, and a slow sine adds an idle sway so it's never completely still.
 * This is the one interaction on the site that is load-bearing rather than
 * decorative — it demonstrates the product's benefit in the first second.
 */

const VIEW = { w: 420, h: 620 };
const ANCHOR = { x: 148, y: 392 };
const LOOP = { rx: 58, ry: 86 };
const BEAD_COUNT = 28;
const MAX_ANGLE = 15;

type Bead = { x: number; y: number; r: number; fill: string; stroke: string };

/** Beads spaced around an ellipse whose top touches the anchor point. */
function buildBeads(): Bead[] {
  const palette = [
    { fill: "url(#beadPearl)", stroke: "#E4D3DD", r: 8.5 },
    { fill: "url(#beadPink)", stroke: "#C9628F", r: 7.5 },
    { fill: "url(#beadLilac)", stroke: "#9A7FB8", r: 8 },
    { fill: "url(#beadPink)", stroke: "#C9628F", r: 6.5 },
    { fill: "url(#beadCrystal)", stroke: "#B9C8E6", r: 7 },
  ];

  const cx = ANCHOR.x;
  const cy = ANCHOR.y + LOOP.ry;

  return Array.from({ length: BEAD_COUNT }, (_, i) => {
    // Start at -90deg so bead 0 sits at the anchor.
    const t = (i / BEAD_COUNT) * Math.PI * 2 - Math.PI / 2;
    const swatch = palette[i % palette.length];
    return {
      x: cx + LOOP.rx * Math.cos(t),
      y: cy + LOOP.ry * Math.sin(t),
      r: swatch.r,
      fill: swatch.fill,
      stroke: swatch.stroke,
    };
  });
}

const BEADS = buildBeads();
/** Lowest point of the loop — where the charm hangs. */
const CHARM = { x: ANCHOR.x, y: ANCHOR.y + LOOP.ry * 2 };

export function PhoneChain({ className }: { className?: string }) {
  const reduced = useReducedMotionSafe();
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const pointerTarget = useRef(0);
  /** Gate for the per-frame loop: off-screen or backgrounded costs nothing. */
  const active = useRef(true);
  const angle = useSpring(0, SWING_SPRING);

  // Write the rotation straight to the SVG transform attribute. Doing it here
  // rather than through style keeps transform-origin behaviour identical
  // across browsers, which CSS transforms on SVG do not.
  useMotionValueEvent(angle, "change", (v) => {
    groupRef.current?.setAttribute(
      "transform",
      `rotate(${v.toFixed(3)} ${ANCHOR.x} ${ANCHOR.y})`,
    );
  });

  // Stop animating entirely once the hero scrolls away or the tab is hidden.
  // A permanently-running rAF loop is a real battery and jank cost on a page
  // this visually busy, and nothing below the fold needs it.
  useEffect(() => {
    if (reduced) return;
    const node = svgRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        active.current = entry.isIntersecting && !document.hidden;
      },
      { threshold: 0 },
    );
    observer.observe(node);

    const onVisibility = () => {
      if (document.hidden) active.current = false;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!active.current) return;
      const ratio = (e.clientX / window.innerWidth) * 2 - 1; // -1 … 1
      pointerTarget.current = ratio * MAX_ANGLE;
    };

    // Progressive enhancement: works where the browser exposes orientation
    // without a permission prompt, and silently does nothing where it doesn't.
    // We deliberately never call requestPermission() — an unprompted modal on
    // page load would be worse than no tilt.
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null) return;
      const clamped = Math.max(-45, Math.min(45, e.gamma));
      pointerTarget.current = (clamped / 45) * MAX_ANGLE;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("deviceorientation", onOrientation);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, [reduced]);

  useAnimationFrame((t) => {
    if (reduced || !active.current) return;
    // Idle sway keeps it alive before the visitor moves anything.
    const idle = Math.sin(t / 1100) * 3.2;
    angle.set(pointerTarget.current + idle);
  });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className={className}
      role="img"
      aria-label={CONTENT.hero.chainAlt}
    >
      <defs>
        <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A2148" />
          <stop offset="100%" stopColor="#2B1836" />
        </linearGradient>
        <linearGradient id="phoneScreen" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#F4C6DE" />
          <stop offset="45%" stopColor="#E3D4F0" />
          <stop offset="100%" stopColor="#CBD9F5" />
        </linearGradient>
        <radialGradient id="beadPearl" cx="0.35" cy="0.3">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EFDCE7" />
        </radialGradient>
        <radialGradient id="beadPink" cx="0.35" cy="0.3">
          <stop offset="0%" stopColor="#FBDCEB" />
          <stop offset="100%" stopColor="#D973A8" />
        </radialGradient>
        <radialGradient id="beadLilac" cx="0.35" cy="0.3">
          <stop offset="0%" stopColor="#F0E6FA" />
          <stop offset="100%" stopColor="#A97FC9" />
        </radialGradient>
        <radialGradient id="beadCrystal" cx="0.35" cy="0.3">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD9F5" />
        </radialGradient>
        <linearGradient id="goldCharm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8CE76" />
          <stop offset="55%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#9C7A1A" />
        </linearGradient>
      </defs>

      {/* Phone */}
      <g>
        <rect
          x="112"
          y="46"
          width="196"
          height="352"
          rx="30"
          fill="url(#phoneBody)"
        />
        <rect
          x="121"
          y="55"
          width="178"
          height="334"
          rx="23"
          fill="url(#phoneScreen)"
        />
        <rect x="186" y="64" width="48" height="7" rx="3.5" fill="#2B1836" opacity="0.35" />
        {/* Tether pad the chain fastens to */}
        <rect x="132" y="380" width="32" height="16" rx="8" fill="#2B1836" opacity="0.75" />
      </g>

      {/* Chain — everything inside rotates about the anchor */}
      <g ref={groupRef} transform={`rotate(0 ${ANCHOR.x} ${ANCHOR.y})`}>
        {/* Cord behind the beads */}
        <ellipse
          cx={ANCHOR.x}
          cy={ANCHOR.y + LOOP.ry}
          rx={LOOP.rx}
          ry={LOOP.ry}
          fill="none"
          stroke="#C9A227"
          strokeWidth="1.6"
          opacity="0.55"
        />

        {BEADS.map((bead, i) => (
          <circle
            key={i}
            cx={bead.x}
            cy={bead.y}
            r={bead.r}
            fill={bead.fill}
            stroke={bead.stroke}
            strokeWidth="0.8"
          />
        ))}

        {/* Crown charm at the base of the loop */}
        <g transform={`translate(${CHARM.x} ${CHARM.y + 6})`}>
          <path
            d="M-13 8 L-15 -6 L-7 0 L0 -10 L7 0 L15 -6 L13 8 Z"
            fill="url(#goldCharm)"
            stroke="#8A6A14"
            strokeWidth="0.7"
            strokeLinejoin="round"
          />
          <circle cx="0" cy="-1" r="2.2" fill="#F4C6DE" />
          <circle cx="-7.5" cy="3" r="1.6" fill="#E3D4F0" />
          <circle cx="7.5" cy="3" r="1.6" fill="#E3D4F0" />
        </g>
      </g>
    </svg>
  );
}
