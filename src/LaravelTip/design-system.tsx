import React from "react";
import {
  interpolate,
  spring,
} from "remotion";
import {
  makeTransform,
  scale,
  translateX,
  translateY,
} from "@remotion/animation-utils";
import { fitText } from "@remotion/layout-utils";

/* ------------------------------------------------------------------ */
/*  Constants & theme                                                 */
/* ------------------------------------------------------------------ */

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 900;
export const SAFE_PAD = 90;

/* Premium cinematic developer palette */
export const Theme = {
  bg: "#07090e", // near-black charcoal
  bgDeep: "#04060a",
  panel: "#0f172a",
  panelLit: "#12223a",
  border: "#1e293b",
  borderLit: "#334155",
  text: "#ffffff",
  textMuted: "#94a3b8",
  cyan: "#22d3ee",
  cyanSoft: "rgba(34, 211, 238, 0.35)",
  cyanGlow: "rgba(34, 211, 238, 0.5)",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  red: "#ef4444",
  redSoft: "rgba(239, 68, 68, 0.35)",
  orange: "#f97316",
  orangeSoft: "rgba(249, 115, 22, 0.35)",
} as const;

/* ------------------------------------------------------------------ */
/*  Scenes frame ranges                                               */
/* ------------------------------------------------------------------ */

export const SCENES = {
  hook: { start: 0, end: 120 },
  problem: { start: 120, end: 300 },
  solution: { start: 300, end: 540 },
  payoff: { start: 540, end: 750 },
  ending: { start: 750, end: 900 },
} as const;

export type SceneKey = keyof typeof SCENES;

/* ------------------------------------------------------------------ */
/*  Deterministic helpers                                             */
/* ------------------------------------------------------------------ */

/* Deterministic pseudo-random in [0,1) from an index + optional seed.
   Never Math.random at render time. */
export const seededRandom = (i: number, seed = 0): number => {
  const x = Math.sin(i * 12.9898 + seed * 7.123) * 43758.5453;
  return x - Math.floor(x);
};

/* Quadratic bezier point for SVG data-packet paths. */
export const quadBezier = (
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number,
): { x: number; y: number } => {
  const c = 1 - t;
  const cx = c * c * p0.x + 2 * c * t * p1.x + t * t * p2.x;
  const cy = c * c * p0.y + 2 * c * t * p1.y + t * t * p2.y;
  return { x: cx, y: cy };
};

/* ------------------------------------------------------------------ */
/*  Camera wrapper                                                    */
/* ------------------------------------------------------------------ */

export interface CameraProps {
  readonly frame: number;
  readonly children: React.ReactNode;
}

/* Cinematic slow push-in (scale up slightly over time). */
export const Camera = ({ frame, children }: CameraProps) => {
  const scaleOut = interpolate(frame, [0, DURATION_IN_FRAMES], [1, 1.06]);
  const driftY = interpolate(frame, [0, DURATION_IN_FRAMES], [0, -18]);
  const driftX = Math.sin((frame / FPS) * 0.4) * 4;

  const transform = makeTransform([
    scale(scaleOut),
    translateX(driftX),
    translateY(driftY),
  ]);

  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        transform,
        transformOrigin: "50% 50%",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Overlays: scanlines, grain, vignette                              */
/* ------------------------------------------------------------------ */

export const Scanlines: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)",
      mixBlendMode: "multiply",
      opacity: 0.55,
      zIndex: 50,
    }}
  />
);

/* Deterministic noise SVG — positions derived from index math, not random. */
export const Grain: React.FC = () => {
  const dots: Array<React.ReactNode> = [];
  const count = 120;
  for (let i = 0; i < count; i += 1) {
    const rx = seededRandom(i, 1) * 100;
    const ry = seededRandom(i, 2) * 100;
    const r = seededRandom(i, 3) * 2 + 0.5;
    const opacity = seededRandom(i, 4) * 0.04 + 0.01;
    dots.push(
      <circle
        key={i}
        cx={rx}
        cy={ry}
        r={r}
        fill="white"
        fillOpacity={opacity}
        style={{ filter: "blur(0.6px)" }}
      />,
    );
  }
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 49,
        mixBlendMode: "overlay",
        opacity: 0.35,
      }}
    >
      {dots}
    </svg>
  );
};

/* Subtle radial vignette. */
export const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "radial-gradient(circle at center, transparent 40%, #020305 90%)",
      zIndex: 51,
    }}
  />
);

/* ------------------------------------------------------------------ */
/*  Common typography helpers                                         */
/* ------------------------------------------------------------------ */

export const DISPLAY_FONT = "TheBoldFont, system-ui, -apple-system, sans-serif";
export const MONO_FONT =
  'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace';

/* Fit bold display text within safe width and return font size. */
export const fitDisplay = ({
  text,
  withinWidth,
}: {
  readonly text: string;
  readonly withinWidth: number;
}): number => {
  const { fontSize } = fitText({
    text,
    withinWidth,
    fontFamily: DISPLAY_FONT,
    fontWeight: 900,
    validateFontIsLoaded: false,
  });
  return fontSize;
};

/* ------------------------------------------------------------------ */
/*  Staged spring helper                                              */
/* ------------------------------------------------------------------ */

/**
 * Returns a spring value that starts at `from` after `delayFrames` and
 * settles to `to`. Useful for orchestrated entrances.
 */
export const stagedSpring = ({
  frame,
  fps,
  delayFrames,
  from = 0,
  to = 1,
  damping = 220,
  stiffness = 600,
}: {
  readonly frame: number;
  readonly fps: number;
  readonly delayFrames: number;
  readonly from?: number;
  readonly to?: number;
  readonly damping?: number;
  readonly stiffness?: number;
}): number => {
  const activeFrame = Math.max(0, frame - delayFrames);
  return spring({
    frame: activeFrame,
    fps,
    config: { damping, stiffness },
    from,
    to,
    durationInFrames: 45,
  });
};
