import { useState, useEffect } from 'react';
import styles from './Canvas.module.scss';

interface CanvasProps {
  html: string;
  css: string;
  type?: string;
}

export default function Canvas({ html, css, type }: CanvasProps) {
  const [compiledCss, setCompiledCss] = useState('');
  const [isShowCssError, setIsShowCssError] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL('../worker/cssWorker.ts', import.meta.url));

    worker.postMessage({ css });

    worker.addEventListener('message', (event) => {
      const { compiledCss, error } = event.data;

      if (error) {
        setCompiledCss(css);
        setIsShowCssError(true);
      } else {
        setCompiledCss(compiledCss);
        setIsShowCssError(false);
      }
    });

    return () => {
      worker.terminate();
    };
  }, [css]);

  return (
    <div className={styles.wrap}>
      <iframe
        srcDoc={`<style>${compiledCss}</style>${html}<script>window.addEventListener('load', () => {window.top.postMessage('', '*');})</script>`}
        title="Rendered codes"
        className={styles.canvas}
        data-type={type}
      />
      {isShowCssError && <p className={styles.error}>Error : CSS 문법이 잘못되었습니다.</p>}
    </div>
  );
}
