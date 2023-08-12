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
          <div className={styles.start}>
            <Link href="./quiz/1" className={classnames(styles.link_start, 'contrast')}>
              시작하기
            </Link>
          </div>
        </div>
        <h2 className={styles.quiz_title}>퀴즈 목록</h2>
        <QuizList quizList={quizList} />
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
