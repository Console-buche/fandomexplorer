import { ScrollDirection } from '@/hooks/useScroll';

export function getScrollDeltaFromDirection(
  direction: ScrollDirection,
  delta: number,
  factor: number
) {
  if (direction === 1) {
    return delta * factor;
  }
  if (direction === -1) {
    return -1 * delta * factor;
  }

  return 0;
}
