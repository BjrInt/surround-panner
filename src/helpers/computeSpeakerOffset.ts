import { Point, SpeakerPositions } from "./types";
import { deg2rad, memoize } from "./utils";

/**
 * Computes the position of the speakers in the room based on their y-axis offset
 *
 * @param frontOffset y-axis offset (in degrees) of the front speakers
 * @param surroundOffset y-axis offset (in degrees) of the surround speakers
 * @returns A speaker position object
 */
export function computeSpeakerOffset(
  frontOffset: number = 30,
  surroundOffset: number = 110
) {
  const radSurround = deg2rad(surroundOffset);
  const radFront = deg2rad(frontOffset);

  const frontLeftPosition: Point = {
    x: 0 - Math.sin(radFront) / 2,
    y: Math.cos(radFront) / 2,
  };

  const frontRightPosition: Point = {
    x: Math.sin(radFront) / 2,
    y: Math.cos(radFront) / 2,
  };

  const surroundLeftPosition: Point = {
    x: 0 - Math.sin(radSurround) / 2,
    y: Math.cos(radSurround) / 2,
  };

  const surroundRightPosition: Point = {
    x: Math.sin(radSurround) / 2,
    y: Math.cos(radSurround) / 2,
  };

  const speakerPositions: SpeakerPositions = {
    center: { x: 0, y: 0.5 },
    frontLeft: frontLeftPosition,
    frontRight: frontRightPosition,
    surroundLeft: surroundLeftPosition,
    surroundRight: surroundRightPosition,
  };

  return speakerPositions;
}

// @note: Trigonomety is expensive, so we memoize the result
export const memoizedComputeSpeakerOffset = memoize(computeSpeakerOffset);
