import { ScrollDirection } from '@/hooks/useScroll';

export function getScrollDeltaFromDirection(
  direction: ScrollDirection,
  delta: number,
  factor: number
) {
  const baseDelta = 0.1;

  if (direction === 1) {
    return Math.max(delta, baseDelta) * factor;
  }
  if (direction === -1) {
    return -1 * Math.max(delta, baseDelta) * factor;
  }

  return 0;
}

export function normalizeScrollFactor(
  factor: number,
  distance: number
): number {
  const BASE_DISTANCE = 5;
  const normalizedFactor = factor * (BASE_DISTANCE / Math.max(distance, 1));

  return Math.min(Math.max(normalizedFactor, 0.1), 10);
}
