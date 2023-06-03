import { useEffect, useState } from 'react';
import Header from '@component/header';
import Canvas from '@component/Canvas';
import Editor from '@component/Editor';
import classnames from 'classnames';
import QuizResult from '@component/quiz/QuizResult';
import styles from './quiz.module.scss';

const htmlDefaultState = `<div class="text">\n\tHello World\n</div>`;
const cssDefaultState = `.text {\n\tcolor: #fff;\n}`;

export default function Quiz() {
  const [htmlState, setHtmlState] = useState(htmlDefaultState);
  const [cssState, setCssState] = useState(cssDefaultState);
  const [activeHtmlStateTab, setActiveCodeTab] = useState(true);
  const [activeUserViewTab, setActiveUserViewTab] = useState(true);

  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (timer) {
      // DEBOUNCING
      // 채점중 문구 표시
    } else {
      // 채점 점수 보여줌
    }
  }, [timer]);

  useEffect(() => {
    // update index db
    // update user canvas (canvas에 넘기는것으로 구현. 여기 useEffect에서 작동하지 않음)
    // 채점
  }, [htmlState, cssState]);

  return (
    <div className={styles.wrap}>
      <Header />
      <main className={styles.main}>
        <div className={styles.box}>
          <div className={styles.tab}>
            <button
              type="button"
              className={classnames(styles.button_tab, {
                [styles.activate]: activeHtmlStateTab,
              })}
              onClick={() => setActiveCodeTab(true)}
            >
              html
            </button>
            <button
              type="button"
              className={classnames(styles.button_tab, {
                [styles.activate]: !activeHtmlStateTab,
              })}
              onClick={() => setActiveCodeTab(false)}
            >
              css
            </button>
          </div>
          <div className={classnames(styles.code, { [styles.activate]: activeHtmlStateTab })}>
            <span className={styles.code_label}>html</span>
            <div className={styles.code_inner}>
              <Editor lang="html" initialString={htmlState} setState={setHtmlState} timer={timer} setTimer={setTimer} />
            </div>
          </div>
          <div className={classnames(styles.code, { [styles.activate]: !activeHtmlStateTab })}>
            <span className={styles.code_label}>css</span>
            <div className={styles.code_inner}>
              <Editor lang="css" initialString={cssState} setState={setCssState} timer={timer} setTimer={setTimer} />
            </div>
          </div>
        </div>
        <div className={styles.result_box}>
          <div className={styles.tab}>
            <button
              type="button"
              className={classnames(styles.button_tab, {
                [styles.activate]: activeUserViewTab,
              })}
              onClick={() => setActiveUserViewTab(true)}
            >
              user
            </button>
            <button
              type="button"
              className={classnames(styles.button_tab, {
                [styles.activate]: !activeUserViewTab,
              })}
              onClick={() => setActiveUserViewTab(false)}
            >
              answer
            </button>
          </div>
          <div className={styles.result}>
            <div className={classnames(styles.code, { [styles.activate]: activeUserViewTab })}>
              <span className={styles.code_label}>user</span>
              <div className={styles.canvas}>
                <Canvas html={htmlState} css={cssState} />
              </div>
            </div>
            <div className={classnames(styles.code, { [styles.activate]: !activeUserViewTab })}>
              <span className={styles.code_label}>answer</span>
              <div className={styles.canvas}>
                <Canvas html="" css="" />
              </div>
            </div>
          </div>
        </div>
        <QuizResult wrapperClassName={styles.grade} />
      </main>
    </div>
  );
}
