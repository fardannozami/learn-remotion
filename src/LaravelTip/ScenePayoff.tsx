import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  makeTransform,
  scale,
  translateX,
} from "@remotion/animation-utils";
import { SCENES, Theme, WIDTH, HEIGHT } from "./design-system";
import { Column, DataStream, Particles, Title } from "./shared";

/* ------------------------------------------------------------------ */
/*  Scene 4 — PAYOFF  (frames 540–750)                                */
/* ------------------------------------------------------------------ */

export const ScenePayoff: React.FC = () => {
  const frame = useCurrentFrame();

  const { start: s } = SCENES.payoff;
  const inScene = frame >= s && frame <= 750;
  if (!inScene) return null;

  /* BEFORE compresses left; AFTER expands into focus. */
  const beforeScale = interpolate(frame, [s, s + 70], [1, 0.72]);
  const beforeTx = interpolate(frame, [s, s + 70], [0, -110]);
  const afterScale = interpolate(frame, [s, s + 70], [0.8, 1.06]);
  const afterTx = interpolate(frame, [s, s + 70], [0, 100]);

  /* Unneeded columns dissolve into particles mid-scene. */
  const dissolveOpacity = interpolate(frame, [s + 40, s + 140], [0, 1]);
  const dissolveFade = interpolate(frame, [s + 140, s + 200], [1, 0]);

  const labelCols = ["id", "name", "email", "password", "remember_token", "created_at"];

  return (
    <>
      <Particles frame={frame} count={40} color={Theme.cyan} opacity={0.15} speed={0.1} />

      {/* Center divider. */}
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 1,
          top: 0,
          width: 2,
          height: HEIGHT,
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* ---------- BEFORE ---------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: WIDTH / 2,
          height: HEIGHT,
          transform: makeTransform([scale(beforeScale), translateX(beforeTx)]),
          transformOrigin: "0% 0%",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 150,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 14,
            fontWeight: 800,
            color: Theme.red,
            textTransform: "uppercase",
            letterSpacing: 0.15,
            opacity: 0.9,
          }}
        >
          BEFORE
        </div>

        {/* Compressed chaotic database. */}
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 260,
            width: 430,
            zIndex: 25,
          }}
        >
          {labelCols.map((label, i) => {
            const unnecessary = i >= 3;
            return (
              <Column
                key={label}
                frame={frame}
                index={i}
                label={label}
                x={50 + i * 82}
                y={0}
                width={70}
                headerHeight={30}
                rowCount={14}
                cellHeight={12}
                intensity={unnecessary ? interpolate(frame, [s, s + 100], [1, 0.05]) : 1}
                accent={unnecessary ? Theme.red : Theme.cyan}
                unnecessary={unnecessary}
                selected={false}
                drift={Math.sin((frame / 30) * 4 + i) * 6}
              />
            );
          })}
        </div>

        {/* Chaotic red/orange streams into a crowded app container. */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 30 }}>
          {labelCols.map((label, i) => {
            const unnecessary = i >= 3;
            const color = unnecessary ? (i % 2 === 0 ? Theme.red : Theme.orange) : Theme.cyan;
            const fromX = 50 + i * 82 + 35;
            const fromY = 260 + 30 + 14 * 12 + 6;
            return (
              <DataStream
                key={i}
                frame={frame}
                fromX={fromX}
                fromY={fromY}
                toX={180 + (i % 3) * 60}
                toY={1280}
                cpX={fromX + (unnecessary ? 70 : -40)}
                cpY={fromY + 450}
                color={color}
                packetCount={6}
                duration={16}
                stagger={4}
                pathOpacity={0.5}
              />
            );
          })}
        </div>

        {/* Crowded app container. */}
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 1260,
            width: 340,
            height: 300,
            zIndex: 28,
            background: "rgba(15, 23, 42, 0.5)",
            border: `2px solid ${Theme.red}`,
            borderRadius: 14,
            boxShadow: `0 0 45px ${Theme.redSoft}`,
            opacity: 0.95,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 16,
              top: 14,
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 12,
              fontWeight: 700,
              color: Theme.red,
              textTransform: "uppercase",
              letterSpacing: 0.1,
            }}
          >
            APP CONTAINER
          </div>
          <div
            style={{
              position: "absolute",
              left: 24,
              top: 50,
              right: 24,
              bottom: 24,
              overflow: "hidden",
            }}
          >
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: (i % 6) * 52 + 6,
                  top: Math.floor(i / 6) * 34 + 6,
                  width: 44,
                  height: 7,
                  borderRadius: 3,
                  background: i % 3 === 0 ? Theme.red : i % 3 === 1 ? Theme.orange : Theme.cyan,
                  opacity: 0.9,
                  boxShadow: `0 0 8px ${Theme.redSoft}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---------- AFTER ---------- */}
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2,
          top: 0,
          width: WIDTH / 2,
          height: HEIGHT,
          transform: makeTransform([scale(afterScale), translateX(afterTx)]),
          transformOrigin: "0% 0%",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 150,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 14,
            fontWeight: 800,
            color: Theme.cyan,
            textTransform: "uppercase",
            letterSpacing: 0.15,
            opacity: 0.95,
          }}
        >
          AFTER
        </div>

        {/* Clean selected columns. */}
        <div
          style={{
            position: "absolute",
            left: 600,
            top: 260,
            width: 360,
            zIndex: 25,
          }}
        >
          {["id", "name", "email"].map((label, i) => (
            <Column
              key={label}
              frame={frame}
              index={i}
              label={label}
              x={600 + i * 116}
              y={0}
              width={96}
              headerHeight={30}
              rowCount={14}
              cellHeight={12}
              intensity={1}
              accent={Theme.cyan}
              unnecessary={false}
              selected={true}
              drift={0}
            />
          ))}
        </div>

        {/* Clean cyan streams into a minimal app container. */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 30 }}>
          {["id", "name", "email"].map((label, i) => (
            <DataStream
              key={i}
              frame={frame}
              fromX={600 + i * 116 + 48}
              fromY={260 + 30 + 14 * 12 + 6}
              toX={740 + i * 10}
              toY={1280}
              cpX={600 + i * 116 + 48}
              cpY={260 + 30 + 14 * 12 + 6 + 200}
              color={Theme.cyan}
              packetCount={4}
              duration={24}
              stagger={10}
              pathOpacity={0.45}
            />
          ))}
        </div>

        {/* Minimal app container. */}
        <div
          style={{
            position: "absolute",
            left: 600,
            top: 1260,
            width: 340,
            height: 300,
            zIndex: 28,
            background: "rgba(15, 23, 42, 0.45)",
            border: `1.5px solid ${Theme.cyan}`,
            borderRadius: 14,
            boxShadow: `0 0 30px ${Theme.cyanSoft}`,
            opacity: interpolate(frame, [s, s + 40], [0, 1]),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 16,
              top: 14,
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 12,
              fontWeight: 700,
              color: Theme.cyan,
              textTransform: "uppercase",
              letterSpacing: 0.1,
            }}
          >
            APP CONTAINER
          </div>
          <div
            style={{
              position: "absolute",
              left: 24,
              top: 50,
              right: 24,
              bottom: 24,
              overflow: "hidden",
            }}
          >
            {["id", "name", "email"].map((label, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 24 + i * 90,
                  top: 90,
                  width: 70,
                  height: 7,
                  borderRadius: 3,
                  background: Theme.cyan,
                  opacity: 0.9,
                  boxShadow: `0 0 10px ${Theme.cyanSoft}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dissolve particles for unneeded columns (left side). */}
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 200,
          width: 460,
          height: 420,
          opacity: dissolveOpacity * dissolveFade,
          pointerEvents: "none",
          zIndex: 32,
        }}
      >
        <Particles
          frame={frame}
          count={90}
          color={Theme.orange}
          opacity={0.5}
          speed={0.25}
          fade={dissolveOpacity * dissolveFade}
        />
      </div>

      <Title
        frame={frame}
        text="ONLY WHAT YOU NEED"
        enterFrame={s + 10}
        y={190}
        color={Theme.text}
        damping={140}
        stiffness={750}
      />
    </>
  );
};
