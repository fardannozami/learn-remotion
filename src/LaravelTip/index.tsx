import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
} from "remotion";
import { loadFont } from "../load-font";
import {
  Camera,
  DURATION_IN_FRAMES,
  FPS,
  Grain,
  SCENES,
  Scanlines,
  Theme,
  Vignette,
} from "./design-system";
import { SceneHook } from "./SceneHook";
import { SceneProblem } from "./SceneProblem";
import { SceneSolution } from "./SceneSolution";
import { ScenePayoff } from "./ScenePayoff";
import { SceneEnding } from "./SceneEnding";

export const calculateLaravelTipMetadata = () => ({
  fps: FPS,
  durationInFrames: DURATION_IN_FRAMES,
});

/* Music bed: fade in over the first 60 frames, hold ~0.15, fade out over the last 90. */
const musicVolume = (frame: number): number => {
  if (frame < 60) {
    return interpolate(frame, [0, 60], [0, 0.15]);
  }
  if (frame > 810) {
    return interpolate(frame, [810, 900], [0.15, 0]);
  }
  return 0.15;
};

export const LaravelTip: React.FC = () => {
  const frame = useCurrentFrame();
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    loadFont().then(() => continueRender(handle));
  }, [continueRender, handle]);

  return (
    <AbsoluteFill style={{ background: Theme.bg }}>
      <Camera frame={frame}>
        <Scanlines />
        <Grain />
        <Vignette />

        <Sequence
          from={SCENES.hook.start}
          durationInFrames={SCENES.hook.end - SCENES.hook.start}
        >
          <SceneHook />
        </Sequence>

        <Sequence
          from={SCENES.problem.start}
          durationInFrames={SCENES.problem.end - SCENES.problem.start}
        >
          <SceneProblem />
        </Sequence>

        <Sequence
          from={SCENES.solution.start}
          durationInFrames={SCENES.solution.end - SCENES.solution.start}
        >
          <SceneSolution />
        </Sequence>

        <Sequence
          from={SCENES.payoff.start}
          durationInFrames={SCENES.payoff.end - SCENES.payoff.start}
        >
          <ScenePayoff />
        </Sequence>

        <Sequence
          from={SCENES.ending.start}
          durationInFrames={SCENES.ending.end - SCENES.ending.start}
        >
          <SceneEnding />
        </Sequence>

        {/* ---------- Audio ---------- */}
        {/* Music bed — low volume, faded in/out. */}
        <Audio
          src={staticFile("audio/music-bed.wav")}
          volume={musicVolume}
          durationInFrames={DURATION_IN_FRAMES}
        />

        {/* Hook SFX */}
        <Audio src={staticFile("audio/impact-deep.wav")} trimBefore={0} volume={0.5} />
        <Audio src={staticFile("audio/data-flow.wav")} trimBefore={8} volume={0.5} />
        <Audio src={staticFile("audio/whoosh.wav")} trimBefore={60} volume={0.5} />
        <Audio src={staticFile("audio/glitch.wav")} trimBefore={108} volume={0.5} />

        {/* Problem SFX */}
        <Audio src={staticFile("audio/impact-deep.wav")} trimBefore={120} volume={0.5} />
        <Audio src={staticFile("audio/typing.wav")} trimBefore={124} volume={0.5} />
        <Audio src={staticFile("audio/whoosh.wav")} trimBefore={150} volume={0.5} />
        <Audio src={staticFile("audio/whoosh.wav")} trimBefore={210} volume={0.5} />
        <Audio src={staticFile("audio/data-flow.wav")} trimBefore={270} volume={0.5} />
        <Audio src={staticFile("audio/impact-deep.wav")} trimBefore={288} volume={0.6} />

        {/* Solution SFX */}
        <Audio src={staticFile("audio/glitch.wav")} trimBefore={300} volume={0.5} />
        <Audio src={staticFile("audio/whoosh.wav")} trimBefore={306} volume={0.5} />
        <Audio src={staticFile("audio/typing.wav")} trimBefore={320} volume={0.5} />
        <Audio src={staticFile("audio/riser.wav")} trimBefore={430} volume={0.5} />
        <Audio src={staticFile("audio/click.wav")} trimBefore={420} volume={0.4} />
        <Audio src={staticFile("audio/click.wav")} trimBefore={470} volume={0.4} />
        <Audio src={staticFile("audio/click.wav")} trimBefore={500} volume={0.4} />
        <Audio src={staticFile("audio/confirm.wav")} trimBefore={520} volume={0.5} />

        {/* Payoff SFX */}
        <Audio src={staticFile("audio/whoosh-reverse.wav")} trimBefore={540} volume={0.5} />
        <Audio src={staticFile("audio/dissolve.wav")} trimBefore={570} volume={0.5} />
        <Audio src={staticFile("audio/confirm.wav")} trimBefore={660} volume={0.5} />

        {/* Ending SFX */}
        <Audio src={staticFile("audio/impact-deep.wav")} trimBefore={750} volume={0.5} />
        <Audio src={staticFile("audio/whoosh.wav")} trimBefore={756} volume={0.5} />
        <Audio src={staticFile("audio/dissolve.wav")} trimBefore={800} volume={0.5} />
      </Camera>
    </AbsoluteFill>
  );
};
