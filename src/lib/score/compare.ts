import { toPixelData } from 'html-to-image';

function calcSpectrum(userPixels, answerPixels) {
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

function calcPixelPerfect(userPixels, answerPixels) {
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

function getIframeSize(userIframe, answerIframe) {
  const { width: userWidth, height: userHeight } = userIframe.frameElement.getBoundingClientRect();
  const { width: answerWidth, height: answerHeight } = answerIframe.frameElement.getBoundingClientRect();

  return {
    width: Math.floor(Math.min(userWidth, answerWidth)),
    height: Math.floor(Math.min(userHeight, answerHeight)),
  };
}

export default async function compareMarkup(userIframe, answerIframe) {
  console.time();
  const sizeOption = getIframeSize(userIframe, answerIframe);
  let userPixels;
  let answerPixels;
  try {
    userPixels = await toPixelData(userIframe.document.body, sizeOption);
    answerPixels = await toPixelData(answerIframe.document.body, sizeOption);
  } catch (error) {
    console.error(error);
    return 0;
  }

  if (userPixels.length !== answerPixels.length) {
    console.error('Two canvas sizes are not identical');
    return 0;
  }

  // compare canvas
  const scoreSpectrum = calcSpectrum(userPixels, answerPixels);
  const scorePerfect = calcPixelPerfect(userPixels, answerPixels);

  // 데스크톱에서 약 50ms 만큼 계산
  console.timeEnd();
  // 1점 만점
  return scoreSpectrum * scorePerfect;
}
