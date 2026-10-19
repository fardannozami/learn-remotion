import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import {
  LaravelTip,
  calculateLaravelTipMetadata,
} from "./LaravelTip";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
      <Composition
        id="LaravelTip"
        component={LaravelTip}
        calculateMetadata={calculateLaravelTipMetadata}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={900}
      />
    </>
  );
};
