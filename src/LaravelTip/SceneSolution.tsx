import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { makeTransform, scale } from "@remotion/animation-utils";
import { SCENES, Theme, MONO_FONT, SAFE_PAD, WIDTH, stagedSpring } from "./design-system";
import { Column, CodeEditor, DataStream, Particles, Title } from "./shared";

/* ------------------------------------------------------------------ */
/*  Scene 3 — SOLUTION  (frames 300–540)                              */
/* ------------------------------------------------------------------ */

const SOLUTION_COLUMNS = [
  { label: "id" },
  { label: "name" },
  { label: "email" },
];

export const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { start: s } = SCENES.solution;
  const inScene = frame >= s && frame <= 540;
  if (!inScene) return null;

  const colWidth = 108;
  const gap = 16;
  const totalWidth = 3 * colWidth + 2 * gap;
  const dbStartX = (WIDTH - totalWidth) / 2;
  const startY = 330;
  const headerHeight = 38;
  const cellHeight = 17;
  const rowCount = 20;

  /* Snap positions — clean aligned row above the app container. */
  const snapX = [260, 500, 740];
  const snapY = 900;

  /* App container — receives only the three selected columns. */
  const appWidth = 560;
  const appHeight = 340;
  const appX = (WIDTH - appWidth) / 2;
  const appY = 1340;
  const appCenterX = appX + appWidth / 2;

  /* Freeze ~0.2s at the scene start, then everything proceeds. */
  const hold = frame < s + 6;
  const moveStart = s + 10;

  return (
    <>
      <Particles frame={frame} count={40} color={Theme.cyan} opacity={0.25} speed={0.1} />

      {/* DB dims; unused columns fade back. */}
      <div
        style={{
          position: "absolute",
          left: dbStartX,
          top: startY,
          width: totalWidth,
          height: headerHeight + rowCount * cellHeight,
          zIndex: 30,
          opacity: interpolate(frame, [s, s + 20], [1, 0.25]),
          filter: `blur(${interpolate(frame, [s, s + 20], [0, 6])}px)`,
        }}
      >
        {/* Unused columns — dimmed and fading out. */}
        {["password", "remember_token", "created_at"].map((label, i) => {
          const x = dbStartX + (3 + i) * (colWidth + gap);
          return (
            <Column
              key={label}
              frame={frame}
              index={3 + i}
              label={label}
              x={x}
              y={startY}
              width={colWidth}
              headerHeight={headerHeight}
              rowCount={rowCount}
              cellHeight={cellHeight}
              intensity={interpolate(frame, [s, s + 30], [0.6, 0.1])}
              accent={Theme.red}
              unnecessary={true}
              selected={false}
              drift={0}
            />
          );
        })}
      </div>

      {/* Selected columns snap into a clean aligned row. */}
      {SOLUTION_COLUMNS.map((col, i) => {
        const fromX = dbStartX + i * (colWidth + gap);
        const x = stagedSpring({
          frame,
          fps,
          delayFrames: hold ? 9999 : moveStart,
          from: fromX,
          to: snapX[i],
          damping: 200,
          stiffness: 700,
        });
        const show = interpolate(frame, [moveStart, moveStart + 20], [0, 1]);
        return (
          <Column
            key={col.label}
            frame={frame}
            index={i}
            label={col.label}
            x={x}
            y={snapY}
            width={colWidth}
            headerHeight={headerHeight}
            rowCount={rowCount}
            cellHeight={cellHeight}
            intensity={show}
            accent={Theme.cyan}
            unnecessary={false}
            selected={true}
            drift={0}
          />
        );
      })}

      {/* Cyan streams from selected columns straight into the app. */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 45 }}>
        {SOLUTION_COLUMNS.map((col, i) => {
          const fromX = snapX[i] + colWidth / 2;
          const fromY = snapY - 6;
          const show = interpolate(frame, [moveStart, moveStart + 20], [0, 1]);
          return (
            <DataStream
              key={i}
              frame={frame}
              fromX={fromX}
              fromY={fromY}
              toX={appCenterX + (i - 1) * 16}
              toY={appY}
              cpX={fromX}
              cpY={fromY + 220}
              color={Theme.cyan}
              packetCount={5}
              duration={20}
              stagger={8}
              pathOpacity={0.5 * show}
            />
          );
        })}
      </div>

      {/* App container — minimal, clean. */}
      <div
        style={{
          position: "absolute",
          left: appX,
          top: appY,
          width: appWidth,
          height: appHeight,
          zIndex: 40,
          background: "rgba(15, 23, 42, 0.55)",
          border: `1.5px solid ${Theme.border}`,
          borderRadius: 16,
          boxShadow: `0 0 30px ${Theme.cyanSoft}`,
          opacity: interpolate(frame, [moveStart, moveStart + 25], [0, 1]),
          transform: makeTransform([
            scale(interpolate(frame, [moveStart, moveStart + 20], [0.8, 1])),
          ]),
          transformOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 16,
            fontFamily: MONO_FONT,
            fontSize: 13,
            fontWeight: 700,
            color: Theme.cyan,
            letterSpacing: 0.1,
            textTransform: "uppercase",
          }}
        >
          APP CONTAINER
        </div>
      </div>

      {/* Code editor emerges and types the solution. */}
      <CodeEditor
        frame={frame}
        typeStartFrame={moveStart + 10}
        typeEndFrame={moveStart + 110}
        x={WIDTH * 0.08}
        y={1040}
        width={WIDTH - SAFE_PAD * 2}
        highlight={true}
        active={frame >= moveStart}
      />

      <Title
        frame={frame}
        text="SELECT LESS"
        enterFrame={moveStart + 10}
        y={240}
        color={Theme.text}
        damping={150}
        stiffness={700}
      />
    </>
  );
};
