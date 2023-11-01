import { useEffect, useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import styles from './Canvas.module.scss';

interface CanvasProps {
  html: string;
  css: string;
}

export default function Canvas({ html, css }: CanvasProps) {
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    const makePNG = async () => {
      // 코드를 요소로 변환
      const htmlElement = document.createElement('div');
      const styleElement = document.createElement('style');
      htmlElement.innerHTML = html;
      styleElement.innerHTML = css;

      // 요소에 스타일 적용
      htmlElement.style.display = 'relative';
      htmlElement.style.width = '400px';
      htmlElement.style.height = '400px';

      // 전체 화면을 캡처해서 로딩 화면으로 사용
      // const bodyDaturl = await toJpeg(document.body);
      // const loadingImg = document.createElement('img');
      // loadingImg.src = bodyDaturl;
      // loadingImg.style.position = 'absolute';
      // loadingImg.style.inset = '0';
      // loadingImg.style.width = '100%';
      // loadingImg.style.height = '100%';
      // loadingImg.style.objectFit = 'cover';
      // loadingImg.style.zIndex = '100';
      // document.body.appendChild(loadingImg);

      // 이미지로 변환 위해 임시로 body에 추가
      const tempHtmlElement = document.body.appendChild(htmlElement);
      const tempStyleElement = document.body.appendChild(styleElement);
      const dataurl = await toPng(tempHtmlElement);

      // 임시로 만든 요소 삭제
      tempHtmlElement.remove();
      tempStyleElement.remove();
      // loadingImg.remove();

      setImgSrc(dataurl);
    };

    makePNG();
  }, [html, css]);

  return <img className={styles.canvas} alt="코드가 렌더링 된 이미지" src={imgSrc} />;
}
