export function easeOutCubic(x: number) {
  return 1 - (1 - x) ** 3;
}
