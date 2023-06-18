import { toPixelData } from 'html-to-image';

async function getPixelData(htmlString: string, cssString: string) {
  const shadowParent = document.createElement('div');
  const shadowRoot = shadowParent.attachShadow({ mode: 'open' });
  shadowRoot.innerHTML = `<style>${cssString}</style>${htmlString}`;
  const pixels = await toPixelData(shadowParent, { width: 500, height: 500, cacheBust: true });

  return pixels;
}

function calcSpectrum(userPixels, answerPixels) {
  const pixelLength = userPixels.length;
  const spectrums = new Array(4).fill(null).map(() => new Array(256).fill(0));

  for (let i = 0; i < pixelLength; i += 4) {
    for (let j = 0; j < 4; j += 1) {
      // rgba
      spectrums[j][userPixels[i + j]] += 1;
      spectrums[j][answerPixels[i + j]] -= 1;
    }
  }

  const MAX_DIFF = pixelLength * 2;
  const difference = spectrums.map((spectrum) => spectrum.reduce((acc, cur) => acc + Math.abs(cur), 0)).reduce((acc, cur) => acc + cur, 0);
  return 1 - difference / MAX_DIFF;
}

function calcPixelPerfect(userPixels, answerPixels) {
  const pixelLength = userPixels.length;
  let identicalPixels = 0;
  for (let i = 0; i < pixelLength; i += 1) {
    if (userPixels[i] === answerPixels[i]) {
      identicalPixels += 1;
    }
  }

  return identicalPixels / pixelLength;
}

export default async function compareMarkup(userHtmlString: string, userCssString: string, answerHTML: string, answerCSS: string) {
  console.time();
  const userPixels = await getPixelData(userHtmlString, userCssString);
  const answerPixels = await getPixelData(answerHTML, answerCSS);

  if (userPixels.length !== answerPixels.length) {
    console.error('Two canvas sizes are not identical');
  }

  // compare canvas
  const scoreSpectrum = calcSpectrum(userPixels, answerPixels);
  const scorePerfect = calcPixelPerfect(userPixels, answerPixels);

  console.timeEnd();
  // 1점 만점
  return (scoreSpectrum * scorePerfect) ** 10;
}
