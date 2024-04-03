import { useState } from 'react';
import useDownloader from 'react-use-downloader';
import classnames from 'classnames';
import Editor from '@component/Editor';
import Canvas from '@component/Canvas';
import styles from './make.module.scss';

export default function Make() {
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
  const [buttonStatus, setButtonStatus] = useState(false);

  function handlePreviewButton() {
    if (buttonStatus) setButtonStatus(false);
    else setButtonStatus(true);
  }

  async function copyGeneratedUrl() {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
    }
  }

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
    <div className={styles.wrap}>
      <main className={styles.main}>
        <h1 className={styles.title}>직접 문제를 만들어보자 !</h1>
        <div>
          <h2 className={styles.sub_title}># JSON</h2>
          <h3 className={styles.json_title}>1. JSON 파일로 문제 불러오기</h3>
          <div className={styles.example}>
            <label className={styles.example_label}>
              문제 이름: <input type="text" className={styles.input} onChange={(e) => setJsonName(e.target.value)} value={jsonName} />
            </label>
            <label className={styles.example_label}>
              문제 넘버링: <input type="text" className={styles.input} onChange={(e) => setJsonCategory(e.target.value)} value={jsonCategory} />
            </label>
            <div className={styles.buttons}>
              <button type="button" onClick={handleSave} className={styles.example_button}>
                현재 코드를 JSON으로 저장
              </button>
              <button type="button" onClick={handleLoad} className={styles.example_button}>
                JSON 파일을 현재 코드로 불러오기
              </button>
            </div>
          </div>
          <button type="button" className={styles.preview_button} onClick={handlePreviewButton}>
            {buttonStatus ? '▼' : '▶'}
            미리보기
          </button>
          <div className={classnames(styles.editor_area, { [styles.closed]: !buttonStatus })}>
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
          </div>
          <h3 className={styles.json_title}>2. JSON 주소를 입력해서 퀴즈 페이지 공유하기</h3>
          <p className={styles.description}>
            <em className={styles.use}>※ 사용방법</em>
            GitHub Pages 기능을 이용해서 github.io 도메인을 가지는 URL을 생성해주세요
            <br />
            생성된 URL을 밑의 JSON URL에 입력한 후 퀴즈 페이지 URL 주소를 복사해서 공유해주세요
          </p>
          <div className={styles.example}>
            <label className={styles.example_label}>
              JSON URL: <input type="text" className={styles.input} onChange={handleGenerate} />
            </label>
            <span className={classnames(styles.example_label, { [styles.disabled]: generatedUrl.length <= 0 })}>
              퀴즈 페이지 URL: <input type="text" className={styles.input} value={generatedUrl} disabled />
              <button type="button" className={styles.button_copy} onClick={copyGeneratedUrl} disabled={generatedUrl.length <= 0}>
                복사하기
              </button>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
