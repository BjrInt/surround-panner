import { Point } from "./types";

type MinMax = { min: number; max: number };
export const minMax = (a: number, b: number): MinMax => {
  if (a > b) return { min: b, max: a };
  return { min: a, max: b };
};

export const normalizedPosition = (x: number): number => (x - 0.5) * 2;

export const internalPosition = (x: number): number => x / 2 + 0.5;

export const getAbsoluteDistance = (a: Point, b: Point): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx ** 2 + dy ** 2);
};

export const isInCircle = (
  point: Point,
  center: Point = { x: 0.5, y: 0.5 },
  radius: number = 0.5
): boolean => getAbsoluteDistance(point, center) <= radius;

export const deg2rad = (deg: number): number => (deg * Math.PI) / 180;

export const uncamel = (str: string): string => str.replace(/([A-Z])/g, " $1");

export const noop = (): void => {};

export const memoize = <T extends Function>(fn: T): T => {
  const cache: Record<string, unknown> = {};
  return ((...args: unknown[]) => {
    const key = JSON.stringify(args);
    if (cache[key]) return cache[key];
    const result = fn(...args);
    cache[key] = result;
    return result;
  }) as unknown as T;
};
