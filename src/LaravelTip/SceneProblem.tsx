import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  makeTransform,
  scale,
  translateX,
  translateY,
} from "@remotion/animation-utils";
import { SCENES, Theme, MONO_FONT, WIDTH, stagedSpring } from "./design-system";
import { Column, DataStream, Title } from "./shared";

/* ------------------------------------------------------------------ */
/*  Scene 2 — PROBLEM  (frames 120–300)                               */
/* ------------------------------------------------------------------ */

const PROBLEM_COLUMNS = [
  { label: "id", color: Theme.cyan },
  { label: "name", color: Theme.cyan },
  { label: "email", color: Theme.cyan },
  { label: "password", color: Theme.red },
  { label: "remember_token", color: Theme.orange },
  { label: "created_at", color: Theme.orange },
];

export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { start: s } = SCENES.problem;
  const inScene = frame >= s && frame <= 300;
  if (!inScene) return null;

  /* Camera shake on the heaviest burst (frames ~150–260). */
  const shakeActive = frame >= 150 && frame <= 260;
  const t = (frame - s) / 180;
  const shakeX = shakeActive ? Math.sin((frame / 30) * 28) * 10 * t : 0;
  const shakeY = shakeActive ? Math.cos((frame / 30) * 22) * 7 * t : 0;

  const colCount = PROBLEM_COLUMNS.length;
  const colWidth = 108;
  const gap = 16;
  const totalWidth = colCount * colWidth + (colCount - 1) * gap;
  const startX = (WIDTH - totalWidth) / 2;
  const startY = 330;
  const headerHeight = 38;
  const cellHeight = 17;
  const rowCount = 20;

  /* App container — glowing target below the database. */
  const appWidth = 520;
  const appHeight = 460;
  const appX = (WIDTH - appWidth) / 2;
  const appY = 1320;
  const appCenterX = appX + appWidth / 2;

  return (
    <>
      {/* Shake wrapper for the heaviest burst. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: makeTransform([
            translateX(shakeX),
            translateY(shakeY),
          ]),
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        {/* Database table — columns slide in staggered. */}
        {PROBLEM_COLUMNS.map((col, i) => {
          const finalX = startX + i * (colWidth + gap);
          const x = stagedSpring({
            frame,
            fps,
            delayFrames: i * 7,
            from: finalX + 180,
            to: finalX,
            damping: 180,
            stiffness: 550,
          });
          const unnecessary = i >= 3;
          return (
            <Column
              key={i}
              frame={frame}
              index={i}
              label={col.label}
              x={x}
              y={startY}
              width={colWidth}
              headerHeight={headerHeight}
              rowCount={rowCount}
              cellHeight={cellHeight}
              intensity={interpolate(frame, [s + i * 4, s + 80 + i * 4], [0, 1])}
              accent={col.color}
              unnecessary={unnecessary}
              selected={false}
              drift={0}
            />
          );
        })}
      </div>

      {/* Data streams from every column into the app container. */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 45 }}>
        {PROBLEM_COLUMNS.map((col, i) => {
          const fromX = startX + i * (colWidth + gap) + colWidth / 2;
          const fromY = startY + headerHeight + rowCount * cellHeight + 6;
          const unnecessary = i >= 3;
          const color = unnecessary ? col.color : Theme.cyan;
          return (
            <DataStream
              key={i}
              frame={frame}
              fromX={fromX}
              fromY={fromY}
              toX={appCenterX + (i - 2.5) * 14}
              toY={appY}
              cpX={fromX + 60}
              cpY={fromY + 360}
              color={color}
              packetCount={7}
              duration={22}
              stagger={5}
              pathOpacity={unnecessary ? 0.45 : 0.25}
            />
          );
        })}
      </div>

      {/* Glowing application container — overloaded with every column. */}
      <div
        style={{
          position: "absolute",
          left: appX,
          top: appY,
          width: appWidth,
          height: appHeight,
          zIndex: 40,
          background: "rgba(15, 23, 42, 0.65)",
          border: `2px solid ${Theme.borderLit}`,
          borderRadius: 18,
          boxShadow: `0 0 40px ${Theme.redSoft}, inset 0 0 20px rgba(255,255,255,0.02)`,
          opacity: interpolate(frame, [s, s + 30], [0, 1]),
          transform: makeTransform([
            scale(interpolate(frame, [s, s + 25], [0.85, 1])),
          ]),
          transformOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 18,
            fontFamily: MONO_FONT,
            fontSize: 13,
            fontWeight: 700,
            color: Theme.textMuted,
            letterSpacing: 0.1,
            textTransform: "uppercase",
          }}
        >
          APP CONTAINER
        </div>
        {/* Incoming-data dots inside the app container. */}
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 60,
            right: 30,
            bottom: 30,
            overflow: "hidden",
            opacity: 0.6,
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => {
            const rx = (i % 6) * 70 + 10;
            const ry = Math.floor(i / 6) * 42 + 10;
            const lit = Math.sin((frame / 30) * 3 + i) > 0.55;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: rx,
                  top: ry,
                  width: 52,
                  height: 9,
                  borderRadius: 4,
                  background: lit
                    ? PROBLEM_COLUMNS[i % PROBLEM_COLUMNS.length].color
                    : "rgba(255,255,255,0.06)",
                  opacity: lit ? 1 : 0.35,
                  boxShadow: lit
                    ? `0 0 10px ${PROBLEM_COLUMNS[i % PROBLEM_COLUMNS.length].color}`
                    : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      <Title
        frame={frame}
        text="ALL COLUMNS"
        enterFrame={s + 10}
        y={200}
        color={Theme.text}
        damping={150}
        stiffness={700}
      />
    </>
  );
};
