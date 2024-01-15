import { useState, useEffect } from 'react';
import Sass from 'sass.js';
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
    Sass.compile(css, (result) => {
      if (result.status === 0) {
        setCompiledCss(result.text);
        setIsShowCssError(false);
      } else {
        setIsShowCssError(true);
      }
    });
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
