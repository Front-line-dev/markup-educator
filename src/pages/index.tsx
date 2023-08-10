import { useState, useEffect } from 'react';
import classnames from 'classnames';
import { readQuizFiles } from '@lib/quiz/readFiles';
import Link from 'next/link';
import QuizEditor from '@component/quiz/QuizEditor';
import QuizView from '@component/quiz/QuizView';
import QuizList from '@component/quiz/QuizList';
import styles from './index.module.scss';

const htmlDefaultState = `<div class="text">\n\tHello World\n</div>`;
const cssDefaultState = `.text {\n\tcolor: #fff;\n}`;

interface QuizListProps {
  quizList: QuizListPropsInner[];
}

interface QuizListPropsInner {
  id: string;
  category: string;
  name: string;
}

export default function Index({ quizList }: QuizListProps) {
  const [htmlState, setHtmlState] = useState(htmlDefaultState);
  const [cssState, setCssState] = useState(cssDefaultState);
  const [activeHtmlStateTab, setActiveCodeTab] = useState(true);
  const [activeUserViewTab, setActiveUserViewTab] = useState(true);

  return (
    <div className={styles.wrap}>
      <main className={styles.main}>
        <h1 className={styles.title}>Can yoU MarkUp ?</h1>
        <p className={styles.description}>캔유마크업은 마크업 문제를 풀어보는 웹사이트입니다. html, css으로 동일한 화면을 만들어보아요.</p>
        <div className={styles.start}>
          <Link href="./quiz/1" className={classnames(styles.link_start, 'contrast')}>
            시작하기
          </Link>
        </div>
        <div className={styles.box}>
          <QuizEditor
            wrapperClass={styles.quiz}
            activate={activeHtmlStateTab}
            html={htmlDefaultState}
            css={cssDefaultState}
            handleActivate={setActiveCodeTab}
            handleHtml={setHtmlState}
            handleCss={setCssState}
            editable
          />
          <QuizView
            wrapperClass={styles.quiz}
            activate={activeUserViewTab}
            userHtml={htmlState}
            userCss={cssState}
            answerHtml=""
            answerCss=""
            handleActivate={setActiveUserViewTab}
            iframeListenerReady
          />
          <div className={styles.quiz_section}>
            <h2 className={styles.quiz_title}>퀴즈 목록</h2>
            <QuizList quizList={quizList} />
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const files = readQuizFiles();
  return {
    props: { quizList: files },
  };
}
