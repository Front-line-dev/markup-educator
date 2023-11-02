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

  useEffect(() => {
    Sass.compile(css, (result) => {
      if (result.status === 0) {
        setCompiledCss(result.text);
      } else {
        console.error(result);
      }
    });
  }, [css]);

  return (
    <iframe
      srcDoc={`<style>${compiledCss}</style>${html}<script>window.addEventListener('load', () => {window.top.postMessage('', '*');})</script>`}
      title="Rendered codes"
      className={styles.canvas}
      data-type={type}
    />
  );
}
