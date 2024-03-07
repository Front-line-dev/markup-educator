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
        <div className={styles.control_wrap}>
          <label>
            name: <input type="text" onChange={(e) => setJsonName(e.target.value)} value={jsonName} />
          </label>
          <label>
            category: <input type="text" onChange={(e) => setJsonCategory(e.target.value)} value={jsonCategory} />
          </label>
          <br />
          <button type="button" onClick={handleSave} className={styles.button}>
            save
          </button>
          <button type="button" onClick={handleLoad} className={styles.button}>
            load
          </button>
          <br />
          <label>
            url: <input type="text" onChange={handleGenerate} />
          </label>
          <br />
          <label>
            generated url: <input type="text" value={generatedUrl} disabled />
          </label>
        </div>
      </main>
    </div>
  );
}
