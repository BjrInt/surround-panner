export type Point = {
  x: number;
  y: number;
};

export type SpeakerPositionKeys =
  | "center"
  | "frontLeft"
  | "frontRight"
  | "surroundLeft"
  | "surroundRight";

export type SpeakerVolumes = Record<SpeakerPositionKeys, number>;

export type SpeakerPositions = Record<SpeakerPositionKeys, Point>;

export type Vec2D = {
  norm: number;
  angle: number;
};
