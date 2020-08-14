export function range(min, max, iterator = 1) {
  if (min > max) return [];
  if (min === max) return [max];
  return [min, ...range(min + iterator, max)];
}
