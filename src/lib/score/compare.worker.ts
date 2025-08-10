/* eslint-disable no-restricted-globals */
// /src/lib/score/compare.worker.ts

function calcSpectrum(userPixels: Uint8ClampedArray, answerPixels: Uint8ClampedArray) {
  const pixelLength = userPixels.length;
  const spectrum = new Array(256).fill(0);

  for (let i = 0; i < pixelLength; i += 1) {
    spectrum[userPixels[i]] += 1;
    spectrum[answerPixels[i]] -= 1;
  }

  const MAX_DIFF = pixelLength * 2;
  const difference = spectrum.reduce((acc, cur) => acc + Math.abs(cur), 0);
  // 5 root 만큼 보정
  return (1 - difference / MAX_DIFF) ** (1 / 5);
}

function calcPixelPerfect(userPixels: Uint8ClampedArray, answerPixels: Uint8ClampedArray) {
  const pixelLength = userPixels.length;
  let identicalPixels = 0;
  for (let i = 0; i < pixelLength; i += 1) {
    if (userPixels[i] === answerPixels[i]) {
      identicalPixels += 1;
    }
  }

  // 5 power 만큼 보정
  return (identicalPixels / pixelLength) ** 5;
}

self.onmessage = (event: MessageEvent<{ userPixels: Uint8ClampedArray, answerPixels: Uint8ClampedArray }>) => {
  const { userPixels, answerPixels } = event.data;

  if (userPixels.length !== answerPixels.length) {
    // eslint-disable-next-line no-console
    console.error('Two canvas sizes are not identical');
    postMessage(0);
    return;
  }

  const scoreSpectrum = calcSpectrum(userPixels, answerPixels);
  const scorePerfect = calcPixelPerfect(userPixels, answerPixels);

  const score = scoreSpectrum * scorePerfect;
  postMessage(score);
};

export {};
