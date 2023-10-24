import { Point, SpeakerPositions, SpeakerVolumes } from "./types";

// @note: Use an object for options so it's expandable (e.g: add a unit vector)
export type computeSpeakerLevelsOptions = {
  referenceLevel?: number;
};

const defaultOptions = {
  referenceLevel: 90,
};

/**
 * Computes the volumes for a standard 5.1 speaker setup (without subwoofer)
 *
 * @param listenersPosition Position of the listener in the room
 * @param speakerPositions Positions of the speakers in the room
 * @param options Reference level in dB
 * @returns A speaker volume object
 */
export function computeSpeakerLevels(
  listenersPosition: Point,
  speakerPositions: SpeakerPositions,
  options: computeSpeakerLevelsOptions = defaultOptions
): SpeakerVolumes {
  // @todo
  const levels: SpeakerVolumes = {
    center: Math.random() * 100,
    frontLeft: Math.random() * 100,
    frontRight: Math.random() * 100,
    surroundLeft: Math.random() * 100,
    surroundRight: Math.random() * 100,
  };

  return levels;
}
