import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SCENES, Theme, SAFE_PAD, WIDTH } from "./design-system";
import { Column, CodeEditor, Particles, Title } from "./shared";

/* ------------------------------------------------------------------ */
/*  Scene 5 — ENDING  (frames 750–900)                                */
/* ------------------------------------------------------------------ */

export const SceneEnding: React.FC = () => {
  const frame = useCurrentFrame();

  const { start: s } = SCENES.ending;
  const inScene = frame >= s && frame <= 900;
  if (!inScene) return null;

  /* Confident push-in to the final frame. */
  const pushScale = interpolate(frame, [s, 900], [1, 1.05]);

  /* Background particles fade out. */
  const particleFade = interpolate(frame, [s, s + 120], [1, 0]);

  const editorX = SAFE_PAD;
  const editorY = 980;
  const editorWidth = WIDTH - SAFE_PAD * 2;

  /* Code re-types then holds fully. */
  const codeActive = frame >= s;
  const codeDone = frame >= s + 60;

  /* Cyan light travels across the code line near the end. */
  const sweepX = interpolate(frame, [s + 50, 900], [-WIDTH, WIDTH]);

  return (
    <>
      <Particles
        frame={frame}
        count={50}
        color={Theme.cyan}
        opacity={0.2}
        speed={0.1}
        fade={particleFade}
      />

      {/* Selected columns float beside the code. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 560,
          width: WIDTH,
          height: 300,
          pointerEvents: "none",
          zIndex: 30,
        }}
      >
        {["id", "name", "email"].map((label, i) => {
          const floatY = Math.sin((frame / 30) * 2 + i) * 12;
          return (
            <Column
              key={label}
              frame={frame}
              index={i}
              label={label}
              x={250 + i * 260}
              y={floatY}
              width={100}
              headerHeight={28}
              rowCount={10}
              cellHeight={10}
              intensity={1}
              accent={Theme.cyan}
              unnecessary={false}
              selected={true}
              drift={0}
            />
          );
        })}
      </div>

      {/* Code editor returns center — types then holds. */}
      <CodeEditor
        frame={frame}
        typeStartFrame={s}
        typeEndFrame={s + 60}
        x={editorX}
        y={editorY}
        width={editorWidth}
        highlight={true}
        active={codeActive}
      />

      {/* Cyan light sweep across the code line. */}
      {codeDone && (
        <div
          style={{
            position: "absolute",
            left: editorX,
            top: editorY + 70,
            width: editorWidth,
            height: 3,
            zIndex: 5,
            pointerEvents: "none",
            background: `linear-gradient(to right, transparent, ${Theme.cyan}, transparent)`,
            opacity: interpolate(frame, [s + 50, s + 70], [0, 1]),
            transform: `translateX(${sweepX}px)`,
          }}
        />
      )}

      <Title
        frame={frame}
        text="FETCH SMARTER."
        enterFrame={s + 10}
        y={300}
        color={Theme.text}
        damping={130}
        stiffness={750}
      />

      <div
        style={{
          position: "absolute",
          left: SAFE_PAD,
          right: SAFE_PAD,
          top: 470,
          textAlign: "center",
          zIndex: 60,
          pointerEvents: "none",
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 16,
          fontWeight: 700,
          color: Theme.textMuted,
          letterSpacing: 0.15,
          textTransform: "uppercase",
          opacity: interpolate(frame, [s + 20, s + 40], [0, 1]),
        }}
      >
        LARAVEL TIP #01
      </div>

      {/* Local push-in applied to foreground content. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${pushScale})`,
          transformOrigin: "50% 50%",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />
    </>
  );
};
