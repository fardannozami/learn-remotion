import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { makeTransform, scale } from "@remotion/animation-utils";
import { SCENES, Theme, WIDTH } from "./design-system";
import { Column, Particles, Title } from "./shared";
import { Glitch } from "./transitions";

/* ------------------------------------------------------------------ */
/*  Scene 1 — HOOK  (frames 0–120)                                    */
/* ------------------------------------------------------------------ */

const COLUMNS = [
  { label: "id" },
  { label: "name" },
  { label: "email" },
  { label: "password" },
  { label: "remember_token" },
  { label: "created_at" },
];

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { start: s0, end: e0 } = SCENES.hook;
  const inScene = frame >= s0 && frame <= e0;
  if (!inScene) return null;

  /* Database appears with dramatic scale-up (frames 0–45). */
  const dbScale = spring({
    frame,
    fps,
    config: { damping: 160, stiffness: 500 },
    from: 0.25,
    to: 1,
    durationInFrames: 45,
  });
  const dbOpacity = interpolate(frame, [0, 12], [0, 1]);

  /* Cell illumination intensity ramps up then holds. */
  const intensity = interpolate(frame, [20, 60], [0, 1], {
    easing: Easing.ease,
  });

  /* A few columns flash red — password + remember_token (indexes 3, 4). */
  const flash = Math.sin((frame / 30) * 10) > 0.5;

  const colCount = COLUMNS.length;
  const colWidth = 104;
  const gap = 14;
  const totalWidth = colCount * colWidth + (colCount - 1) * gap;
  const startX = (WIDTH - totalWidth) / 2;
  const startY = 620;
  const headerHeight = 32;
  const cellHeight = 13;
  const rowCount = 44;

  const dbBlur = interpolate(frame, [0, 25], [8, 0], { easing: Easing.ease });

  return (
    <>
      <Particles frame={frame} count={70} color={Theme.cyan} opacity={0.25} speed={0.1} />

      {/* Database panel — dramatic scale-up entrance. */}
      <div
        style={{
          position: "absolute",
          left: startX,
          top: startY,
          width: totalWidth,
          height: headerHeight + rowCount * cellHeight,
          zIndex: 30,
          opacity: dbOpacity,
          transform: makeTransform([scale(dbScale)]),
          transformOrigin: "50% 50%",
          filter: `blur(${dbBlur}px)`,
        }}
      >
        {COLUMNS.map((col, i) => (
          <Column
            key={i}
            frame={frame}
            index={i}
            label={col.label}
            x={startX + i * (colWidth + gap)}
            y={0}
            width={colWidth}
            headerHeight={headerHeight}
            rowCount={rowCount}
            cellHeight={cellHeight}
            intensity={intensity}
            accent={i === 3 || i === 4 ? Theme.red : Theme.cyan}
            unnecessary={i === 3 || i === 4}
            selected={false}
            drift={Math.sin((frame / 30) * 2 + i) * 3}
          />
        ))}
      </div>

      {/* Red flash emphasis on the two unnecessary columns. */}
      {flash && frame > 40 && (
        <div
          style={{
            position: "absolute",
            left: startX + 3 * (colWidth + gap) - 6,
            top: startY - 6,
            width: colWidth * 2 + gap + 12,
            height: headerHeight + rowCount * cellHeight + 12,
            border: `2px solid ${Theme.red}`,
            borderRadius: 10,
            opacity: 0.5,
            boxShadow: `0 0 30px ${Theme.redSoft}`,
            zIndex: 35,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Hook title slams in with a spring. */}
      <Title
        frame={frame}
        text="STILL USING ALL()?"
        enterFrame={30}
        y={260}
        color={Theme.text}
        damping={140}
        stiffness={800}
      />

      {/* Quick glitch transition at the end of the hook. */}
      <Glitch frame={frame} startFrame={105} endFrame={120} intensity={1}>
        <div style={{ position: "absolute", inset: 0, background: Theme.bg }} />
      </Glitch>
    </>
  );
};
