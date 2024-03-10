import { useState } from 'react';
import { useRouter } from 'next/router';
import useDownloader from 'react-use-downloader';
import classnames from 'classnames';
import Editor from '@component/Editor';
import Canvas from '@component/Canvas';
import styles from './make.module.scss';

export default function Make() {
  const router = useRouter();
  const { download } = useDownloader();
  const [userHtml, setUserHtml] = useState('');
  const [userCss, setUserCss] = useState('');
  const [answerHtml, setAnswerHtml] = useState('');
  const [answerCss, setAnswerCss] = useState('');
  const [jsonName, setJsonName] = useState('');
  const [jsonCategory, setJsonCategory] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  // Editor 호환용 변수
  const [debouncing, setDebouncing] = useState(false);

  function handleSave() {
    const content = {
      name: jsonName,
      category: jsonCategory,
      defaultUserHtml: userHtml,
      defaultUserCss: userCss,
      answerHtml,
      answerCss,
    };

    // download json file
    const fileURI = encodeURIComponent(JSON.stringify(content, null, 4));

    download(`data:text/json,${fileURI}`, 'quiz.json');
  }

  function handleLoad() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', () => {
      const file = input.files[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const jsonData = JSON.parse(reader.result.toString());
        const {
          name: loadedName,
          category: loadedCategory,
          defaultUserHtml: loadedUserHtml,
          defaultUserCss: loadedUserCss,
          answerHtml: loadedAnswerHtml,
          answerCss: loadedAnswerCss,
        } = jsonData;

        setJsonName(loadedName);
        setJsonCategory(loadedCategory);
        setUserHtml(loadedUserHtml);
        setUserCss(loadedUserCss);
        setAnswerHtml(loadedAnswerHtml);
        setAnswerCss(loadedAnswerCss);
      });

      reader.readAsText(file);
    });

    input.click();
  }

  function handleGenerate(e) {
    const url = encodeURIComponent(e.target.value);
    const host = window.location.href.replace('admin/make', 'workshop/quiz');
    setGeneratedUrl(`${host}?url=${url}`);
  }

  return (
    <div>
      <main className={styles.main}>
        <h2>USER HTML / CSS</h2>
        <div className={styles.editor_wrap}>
          <Editor lang="html" initialString={userHtml} setString={setUserHtml} setDebouncing={setDebouncing} editable />
          <Editor lang="css" initialString={userCss} setString={setUserCss} setDebouncing={setDebouncing} editable />
        </div>
        <h2>ANSWER HTML / CSS</h2>
        <div className={styles.editor_wrap}>
          <Editor lang="html" initialString={answerHtml} setString={setAnswerHtml} setDebouncing={setDebouncing} editable />
          <Editor lang="css" initialString={answerCss} setString={setAnswerCss} setDebouncing={setDebouncing} editable />
        </div>
        <h2>PC, Tablet, Mobile 사이즈 미리보기</h2>
        <div className={classnames(styles.canvas_row, styles.tablet)}>
          <div className={styles.canvas_wrap}>
            <Canvas html={userHtml} css={userCss} />
          </div>
          <div className={styles.canvas_wrap}>
            <Canvas html={answerHtml} css={answerCss} />
          </div>
        </div>
        <div className={classnames(styles.canvas_row, styles.pc)}>
          <div className={styles.canvas_wrap}>
            <Canvas html={userHtml} css={userCss} />
          </div>
          <div className={styles.canvas_wrap}>
            <Canvas html={answerHtml} css={answerCss} />
          </div>
        </div>
        <div className={classnames(styles.canvas_row, styles.mobile)}>
          <div className={styles.canvas_wrap}>
            <Canvas html={userHtml} css={userCss} />
          </div>
          <div className={styles.canvas_wrap}>
            <Canvas html={answerHtml} css={answerCss} />
          </div>
        </div>
        <div>
          <h2>JSON 파일 관련 설정</h2>
          <label>
            name: <input type="text" onChange={(e) => setJsonName(e.target.value)} value={jsonName} />
          </label>
          <br />
          <label>
            category: <input type="text" onChange={(e) => setJsonCategory(e.target.value)} value={jsonCategory} />
          </label>
          <br />
          <button type="button" onClick={handleSave} className={styles.button}>
            현재 코드를 JSON으로 저장
          </button>
          <button type="button" onClick={handleLoad} className={styles.button}>
            JSON 파일을 현재 코드로 불러오기
          </button>
          <br />
          <h2>JSON 주소를 입력해서 퀴즈 페이지 공유하기</h2>
          <p>
            GitHub Pages 기능을 이용해서 github.io 도메인을 가지는 URL을 생성해주세요
            <br />
            생성된 URL을 밑의 JSON URL에 입력한 후 퀴즈 페이지 URL 주소를 복사해서 공유해주세요
          </p>
          <label>
            JSON URL: <input type="text" onChange={handleGenerate} />
          </label>
          <br />
          <label>
            퀴즈 페이지 URL: <input type="text" value={generatedUrl} disabled />
          </label>
        </div>
      </main>
    </div>
  );
}
