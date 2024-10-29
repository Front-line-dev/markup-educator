import { compareMarkup } from '../lib/score/compare';

self.addEventListener('message', async (event) => {
  const { userHtml, userCss, answerHtml, answerCss } = event.data;
  const score = await compareMarkup(userHtml, userCss, answerHtml, answerCss);
  self.postMessage({ score });
});
