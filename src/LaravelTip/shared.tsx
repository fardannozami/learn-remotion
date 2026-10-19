import React from "react";
import { interpolate } from "remotion";
import {
  makeTransform,
  scale,
  translateX,
  translateY,
} from "@remotion/animation-utils";
import { fitText } from "@remotion/layout-utils";
import {
  DISPLAY_FONT,
  FPS,
  MONO_FONT,
  SAFE_PAD,
  Theme,
  quadBezier,
  seededRandom,
  WIDTH,
  HEIGHT,
  fitDisplay,
  stagedSpring,
} from "./design-system";

/* ------------------------------------------------------------------ */
/*  Big kinetic title                                                 */
/* ------------------------------------------------------------------ */

export interface TitleProps {
  readonly frame: number;
  readonly text: string;
  readonly enterFrame: number;
  readonly y?: number;
  readonly color?: string;
  readonly fontSize?: number;
  readonly damping?: number;
  readonly stiffness?: number;
  readonly delayFrames?: number;
}

/* Slams in with a spring, fits within safe horizontal margins. */
export const Title = ({
  frame,
  text,
  enterFrame,
  y = HEIGHT * 0.18,
  color = Theme.text,
  fontSize,
  damping = 180,
  stiffness = 700,
  delayFrames = 0,
}: TitleProps) => {
  const safeWidth = WIDTH - SAFE_PAD * 2;
  const size = fontSize ?? fitDisplay({ text, withinWidth: safeWidth });
  const scaleVal = stagedSpring({
    frame,
    fps: FPS,
    delayFrames,
    from: 0.5,
    to: 1,
    damping,
    stiffness,
  });
  const opacity = interpolate(frame, [enterFrame, enterFrame + 6], [0, 1]);
  const blur = interpolate(frame, [enterFrame, enterFrame + 8], [24, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_PAD,
        right: SAFE_PAD,
        top: y,
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 60,
        opacity,
        filter: `blur(${blur}px)`,
        transform: makeTransform([scale(scaleVal)]),
        transformOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          fontSize: size,
          lineHeight: 1,
          fontFamily: DISPLAY_FONT,
          fontWeight: 900,
          color,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Code editor — real text, monospace, never cropped                 */
/* ------------------------------------------------------------------ */

export const CODE = "$users = User::all(['id', 'name', 'email']);";
/* `['id', 'name', 'email']` begins after `$users = User::all(` (21 chars). */
export const CODE_HIGHLIGHT_START = 21;
export const CODE_HIGHLIGHT_END = 44;

export interface CodeEditorProps {
  readonly frame: number;
  readonly typeStartFrame: number;
  readonly typeEndFrame: number;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly highlight?: boolean;
  readonly active?: boolean; // editor visible/faded in
}

/* Typewriter reveal + optional cyan highlight of the selected columns. */
export const CodeEditor = ({
  frame,
  typeStartFrame,
  typeEndFrame,
  x = WIDTH * 0.5,
  y = HEIGHT * 0.5,
  width = WIDTH - SAFE_PAD * 2,
  highlight = false,
  active = true,
}: CodeEditorProps) => {
  const progress = interpolate(frame, [typeStartFrame, typeEndFrame], [0, 1]);
  const typedLength = Math.floor(progress * CODE.length);
  const clamped = Math.max(0, Math.min(CODE.length, typedLength));
  const visible = CODE.slice(0, clamped);

  const show = interpolate(frame, [typeStartFrame - 10, typeStartFrame], [0, 1]);
  const editorOpacity = active ? show : 0;

  const cursorBlink = Math.sin((frame / 30) * 4) > 0;

  const prefix = visible.slice(0, CODE_HIGHLIGHT_START);
  const highlightStart = CODE_HIGHLIGHT_START;
  const highlightEnd = CODE_HIGHLIGHT_END;
  let highlighted = "";
  let suffix = "";
  if (clamped > highlightStart) {
    const hEnd = Math.min(clamped, highlightEnd);
    highlighted = visible.slice(highlightStart, hEnd);
    suffix = visible.slice(hEnd);
  } else {
    suffix = visible.slice(highlightStart);
  }

  const fitSize = fitText({
    text: CODE,
    withinWidth: width - 40,
    fontFamily: MONO_FONT,
    fontWeight: 500,
    validateFontIsLoaded: false,
  }).fontSize;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        pointerEvents: "none",
        zIndex: 55,
        opacity: editorOpacity,
        transform: makeTransform([
          scale(interpolate(frame, [typeStartFrame - 15, typeStartFrame], [0.85, 1])),
          translateY(interpolate(frame, [typeStartFrame - 15, typeStartFrame], [30, 0])),
        ]),
        transformOrigin: "0% 0%",
      }}
    >
      {/* Editor pane glass */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.7)",
          border: `1px solid ${Theme.border}`,
          borderRadius: 14,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)`,
          backdropFilter: "blur(12px)",
          padding: 18,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: 18,
          boxSizing: "border-box",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontSize: fitSize,
            lineHeight: 1.5,
            fontFamily: MONO_FONT,
            fontWeight: 600,
            color: Theme.text,
            whiteSpace: "pre",
            wordWrap: "break-word",
          }}
        >
          <span style={{ color: Theme.textMuted }}>{prefix}</span>
          {highlight && highlighted ? (
            <span
              style={{
                color: Theme.cyan,
                background: "rgba(34, 211, 238, 0.15)",
                padding: "0 2px",
                borderRadius: 3,
                boxShadow: `0 0 14px ${Theme.cyanSoft}`,
              }}
            >
              {highlighted}
            </span>
          ) : (
            <span>{highlighted}</span>
          )}
          <span style={{ color: Theme.textMuted }}>{suffix}</span>
          {clamped === CODE.length && cursorBlink && (
            <span style={{ color: Theme.cyan, marginLeft: 2 }}>▋</span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Database column                                                   */
/* ------------------------------------------------------------------ */

export interface ColumnProps {
  readonly frame: number;
  readonly index: number;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly headerHeight: number;
  readonly rowCount: number;
  readonly cellHeight: number;
  /** How "active" the column is (0..1) — drives illumination */
  readonly intensity: number;
  /** Accent color when lit */
  readonly accent: string;
  /** Whether this is an unnecessary column (red/orange emphasis) */
  readonly unnecessary?: boolean;
  /** Whether this is a selected column (cyan emphasis) */
  readonly selected?: boolean;
  /** Extra horizontal drift for streaming feel */
  readonly drift?: number;
}

const cellLit = (frame: number, colIndex: number, rowIndex: number): boolean => {
  const offset = seededRandom(colIndex * 13 + rowIndex * 7 + colIndex, 5) * 40;
  const speed = 0.15 + seededRandom(colIndex, rowIndex) * 0.1;
  return Math.sin((frame - offset) * speed) > 0.62;
};

export const Column = ({
  frame,
  index,
  label,
  x,
  y,
  width,
  headerHeight,
  rowCount,
  cellHeight,
  intensity,
  accent,
  unnecessary = false,
  selected = false,
  drift = 0,
}: ColumnProps) => {
  const baseColor = accent;
  const glowColor = unnecessary ? Theme.redSoft : selected ? Theme.cyanSoft : "transparent";

  const headerOpacity = interpolate(intensity, [0, 1], [0.35, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: headerHeight + rowCount * cellHeight,
        pointerEvents: "none",
        zIndex: 40,
        transform: translateX(drift),
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height: headerHeight,
          background: "rgba(30, 41, 59, 0.6)",
          borderBottom: `1px solid ${Theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: baseColor,
          fontSize: 13,
          fontFamily: MONO_FONT,
          fontWeight: 700,
          letterSpacing: 0.05,
          textTransform: "uppercase",
          opacity: headerOpacity,
          boxShadow: glowColor ? `0 0 18px ${glowColor}` : "none",
        }}
      >
        {label}
      </div>

      {/* Cells */}
      {Array.from({ length: rowCount }).map((_, row) => {
        const lit = cellLit(frame, index, row);
        const cellY = headerHeight + row * cellHeight + 2;

        return (
          <div
            key={row}
            style={{
              position: "absolute",
              left: 2,
              top: cellY,
              width: width - 4,
              height: cellHeight - 4,
              background: lit ? baseColor : "rgba(255,255,255,0.03)",
              borderRadius: 4,
              border: lit ? `1px solid ${baseColor}` : "none",
              boxShadow: lit ? `0 0 14px ${glowColor || baseColor}` : "none",
              opacity: lit ? 1 : 0.45,
              transition: "none",
            }}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Data stream on a curved SVG path                                  */
/* ------------------------------------------------------------------ */

export interface DataStreamProps {
  readonly frame: number;
  readonly fromX: number;
  readonly fromY: number;
  readonly toX: number;
  readonly toY: number;
  readonly cpX: number;
  readonly cpY: number;
  readonly color: string;
  readonly packetCount: number;
  readonly duration: number;
  readonly stagger: number;
  readonly pathOpacity?: number;
}

/* Renders a quadratic bezier path plus packets moving along it. */
export const DataStream = ({
  frame,
  fromX,
  fromY,
  toX,
  toY,
  cpX,
  cpY,
  color,
  packetCount,
  duration,
  stagger,
  pathOpacity = 0.35,
}: DataStreamProps) => {
  const pathD = `M${fromX},${fromY} Q${cpX},${cpY} ${toX},${toY}`;
  const packets: Array<React.ReactNode> = [];

  for (let i = 0; i < packetCount; i += 1) {
    const start = i * stagger;
    const tFrame = frame - start;
    const t = ((tFrame % duration) + duration) % duration;
    if (t > duration) continue;
    const p = t / duration;
    const { x, y } = quadBezier(
      { x: fromX, y: fromY },
      { x: cpX, y: cpY },
      { x: toX, y: toY },
      p,
    );
    const alpha = p < 0.05 || p > 0.95 ? p * 20 : 1;
    packets.push(
      <circle
        key={i}
        cx={x}
        cy={y}
        r={3.5}
        fill={color}
        style={{
          opacity: alpha,
          filter: `drop-shadow(0 0 8px ${color})`,
        }}
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
        zIndex: 45,
        overflow: "visible",
      }}
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={pathOpacity}
        strokeDasharray="20 10"
        style={{
          strokeDashoffset: interpolate(frame, [0, 60], [-60, 0]),
        }}
      />
      {packets}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  Deterministic particle field                                      */
/* ------------------------------------------------------------------ */

export interface ParticlesProps {
  readonly frame: number;
  readonly count?: number;
  readonly x?: number;
  readonly y?: number;
  readonly w?: number;
  readonly h?: number;
  readonly color?: string;
  readonly opacity?: number;
  readonly speed?: number;
  readonly fade?: number; // 0..1 multiplier
}

/* Scattering of faint particles that drift deterministically. */
export const Particles = ({
  frame,
  count = 60,
  x = 0,
  y = 0,
  w = WIDTH,
  h = HEIGHT,
  color = Theme.cyan,
  opacity = 0.35,
  speed = 0.15,
  fade = 1,
}: ParticlesProps) => {
  const dots: Array<React.ReactNode> = [];
  for (let i = 0; i < count; i += 1) {
    const baseX = seededRandom(i, 11) * w;
    const baseY = seededRandom(i, 22) * h;
    const r = seededRandom(i, 33) * 2 + 1;
    const driftX = Math.sin((frame / 30) * speed + i) * 20;
    const driftY = Math.cos((frame / 30) * speed * 0.6 + i * 1.3) * 15;
    const alpha = (seededRandom(i, 44) * 0.5 + 0.25) * opacity * fade;
    dots.push(
      <circle
        key={i}
        cx={x + baseX + driftX}
        cy={y + baseY + driftY}
        r={r}
        fill={color}
        style={{ opacity: alpha, filter: "blur(1px)" }}
      />,
    );
  }
  return (
    <svg
      width={w}
      height={h}
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 35,
      }}
    >
      {dots}
    </svg>
  );
};
