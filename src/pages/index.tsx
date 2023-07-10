import { useState } from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import QuizEditor from '@component/quiz/QuizEditor';
import QuizView from '@component/quiz/QuizView';
import styles from './index.module.scss';

const htmlDefaultState = `<div class="text">\n\tHello World\n</div>`;
const cssDefaultState = `.text {\n\tcolor: #fff;\n}`;

export default function Index() {
  const [htmlState, setHtmlState] = useState(htmlDefaultState);
  const [cssState, setCssState] = useState(cssDefaultState);
  const [activeHtmlStateTab, setActiveCodeTab] = useState(true);
  const [activeUserViewTab, setActiveUserViewTab] = useState(true);

  return (
    <div className={styles.wrap}>
      <main className={styles.main}>
        <h1 className={styles.title}>Can yoU Mark Up ?</h1>
        <p className={styles.description}>화면을 똑같이 만들 수 있나요 ?</p>
        <div className={styles.box}>
          <QuizEditor
            wrapperClass={styles.quiz}
            activate={activeHtmlStateTab}
            html={htmlDefaultState}
            css={cssDefaultState}
            handleActivate={setActiveCodeTab}
            handleHtml={setHtmlState}
            handleCss={setCssState}
          />
          <QuizView
            wrapperClass={styles.quiz}
            activate={activeUserViewTab}
            userHtml={htmlState}
            userCss={cssState}
            answerHtml=""
            answerCss=""
            handleActivate={setActiveUserViewTab}
            iframeListenerReady={true}
          />
          <div className={styles.start}>
            <Link href="./quiz/1" className={classnames(styles.link_start, 'contrast')}>
              시작하기
            </Link>
          </div>
        </div>
        <h2 className={styles.quiz_title}>퀴즈 목록</h2>
        <div className={styles.quiz_box}>
          <em className={styles.quiz_level}>초급</em>
          {/* 문제 수 받아서 처리 */}
          <ul className={styles.list_quiz}>
            <li className={styles.item_quiz}>
              <Link href="./quiz/1" className={styles.link_quiz}>
                # Quiz 01
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.quiz_box}>
          <em className={styles.quiz_level}>중급</em>
          {/* 문제 수 받아서 처리 */}
          <ul className={styles.list_quiz}>
            <li className={styles.item_quiz}>
              <Link href="./" className={styles.link_quiz}>
                # Quiz 01
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
