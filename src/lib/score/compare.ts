import { toCanvas } from 'html-to-image';

async function getPixels(el: HTMLElement): Promise<Uint8ClampedArray> {
  const canvas = await toCanvas(el);
  const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  return data;
}

export default function compareMarkup(
  worker: Worker,
  userIframe: Window,
  answerIframe: Window
): Promise<number> {
  return new Promise((resolve, reject) => {
    const getAndPostPixels = async () => {
      try {
        const userPixels = await getPixels(userIframe.document.documentElement);
        const answerPixels = await getPixels(answerIframe.document.documentElement);
        worker.postMessage({ userPixels, answerPixels }, [userPixels.buffer, answerPixels.buffer]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        reject(error);
      }
    };

    const messageHandler = (event: MessageEvent<number>) => {
      resolve(event.data);
      worker.removeEventListener('message', messageHandler);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      worker.removeEventListener('error', errorHandler);
    };

    const errorHandler = (error: ErrorEvent) => {
      // eslint-disable-next-line no-console
      console.error('Worker error:', error);
      reject(error);
      worker.removeEventListener('message', messageHandler);
      worker.removeEventListener('error', errorHandler);
    };

    worker.addEventListener('message', messageHandler);
    worker.addEventListener('error', errorHandler);

    getAndPostPixels();
  });
}
