import React from "react";
import { interpolate } from "remotion";
import {
  makeTransform,
  scale,
  translateX,
} from "@remotion/animation-utils";
import { Theme, seededRandom, WIDTH, HEIGHT } from "./design-system";

/* ------------------------------------------------------------------ */
/*  Glitch — RGB-split slices, driven by frame (no keyframes)         */
/* ------------------------------------------------------------------ */

export interface GlitchProps {
  readonly frame: number;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly intensity?: number; // 0..1
  readonly children: React.ReactNode;
}

/* Chromatic-aberration slice glitch active within [startFrame, endFrame]. */
export const Glitch = ({
  frame,
  startFrame,
  endFrame,
  intensity = 1,
  children,
}: GlitchProps) => {
  const active =
    frame >= startFrame && frame <= endFrame
      ? interpolate(frame, [startFrame, endFrame], [0, 1])
      : 0;
  if (active <= 0) {
    return <>{children}</>;
  }

  const sliceCount = 14;
  const slices: Array<React.ReactNode> = [];
  const offsetBase = Math.sin((frame / 30) * 12) * 20 * intensity;

  for (let i = 0; i < sliceCount; i += 1) {
    const y0 = (i / sliceCount) * 100;
    const y1 = ((i + 1) / sliceCount) * 100;
    const jitter = seededRandom(i, frame) * 2 - 1;
    const offsetR = (offsetBase + jitter * 12) * active;
    const offsetB = (-offsetBase + jitter * 8) * active;

    slices.push(
      <div
        key={`r-${i}`}
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `polygon(0 ${y0}%, 100% ${y0}%, 100% ${y1}%, 0 ${y1}%)`,
          background: "rgba(255, 60, 60, 0.35)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          zIndex: 100,
          transform: translateX(offsetR),
        }}
      />,
    );
    slices.push(
      <div
        key={`b-${i}`}
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `polygon(0 ${y0}%, 100% ${y0}%, 100% ${y1}%, 0 ${y1}%)`,
          background: "rgba(60, 120, 255, 0.35)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          zIndex: 100,
          transform: translateX(offsetB),
        }}
      />,
    );
  }

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT }}>
      {children}
      {slices}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Wipe — a sliding cover used between scenes                        */
/* ------------------------------------------------------------------ */

export interface WipeProps {
  readonly frame: number;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly direction?: "left" | "right" | "up" | "down";
  readonly children: React.ReactNode;
}

/* Covers the screen during [startFrame, endFrame], then reveals children. */
export const Wipe = ({
  frame,
  startFrame,
  endFrame,
  direction = "right",
  children,
}: WipeProps) => {
  const progress =
    frame < startFrame
      ? 1
      : frame > endFrame
        ? 0
        : interpolate(frame, [startFrame, endFrame], [1, 0]);

  if (progress <= 0 && frame > endFrame) {
    return <>{children}</>;
  }

  let coverStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: Theme.bgDeep,
    pointerEvents: "none",
    zIndex: 90,
    transformOrigin: "0% 0%",
  };

  if (direction === "right" || direction === "left") {
    coverStyle = {
      ...coverStyle,
      width: `${progress * 100}%`,
      height: "100%",
      transform: makeTransform([
        scale(1),
        translateX(direction === "right" ? (1 - progress) * -WIDTH : 0),
      ]),
    };
  } else {
    coverStyle = {
      ...coverStyle,
      width: "100%",
      height: `${progress * 100}%`,
      transform: makeTransform([scale(1)]),
    };
  }

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, overflow: "hidden" }}>
      <div style={coverStyle} />
      {progress <= 0.05 ? children : null}
    </div>
  );
};
