export function average(array: number[]) {
  return array.reduce((s, x) => s + x, 0) / array.length;
}

export function dispersion(array: number[]) {
  const avg = average(array);
  return array.reduce((s, x) => s + (x - avg) ** 2, 0) / array.length;
}

export function standartDeviation(array: number[]) {
  return Math.sqrt(dispersion(array));
}
