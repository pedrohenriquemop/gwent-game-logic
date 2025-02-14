export function shuffleArray(array: unknown[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function sampleFromArray<T>(
  array: T[],
  numberOfSamples = 1,
): [T[], number[]] {
  const alreadySampled: number[] = [];

  return [
    Array.from({ length: numberOfSamples }, () => {
      let sample = Math.floor(Math.random() * array.length);

      while (alreadySampled.includes(sample)) {
        sample = Math.floor(Math.random() * array.length);
      }

      alreadySampled.push(sample);

      return array[sample];
    }),
    alreadySampled,
  ];
}
