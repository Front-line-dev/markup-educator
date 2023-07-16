import { useEffect, useState } from 'react';
import { readQuizFileList, readQuizFileById } from '@lib/quiz/readFiles';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@model/db';
import Header from '@component/header';
import QuizEditor from '@component/quiz/QuizEditor';
import QuizResult from '@component/quiz/QuizResult';
import QuizView from '@component/quiz/QuizView';
import compareMarkup from '@lib/score/compare';
import styles from './quiz.module.scss';

interface QuizParams {
  id: string;
  name: string;
  defaultUserHtml: string;
  defaultUserCss: string;
  answerHtml: string;
  answerCss: string;
}

export default function Quiz({ id, name, defaultUserHtml, defaultUserCss, answerHtml, answerCss }: QuizParams) {
  const [userHtml, setUserHtml] = useState(defaultUserHtml);
  const [userCss, setUserCss] = useState(defaultUserCss);
  const [activeHtmlStateTab, setActiveCodeTab] = useState(true);
  const [activeUserViewTab, setActiveUserViewTab] = useState(true);
  const [debouncing, setDebouncing] = useState(false);
  const [score, setScore] = useState(0);
  const [comparing, setComparing] = useState(false);
  const [iframeListenerReady, setIframeListenerReady] = useState(false);

  // db에서 코드 불러오기
  const dataBaseItem = useLiveQuery(() => db.markups.where('id').equals(id).toArray())?.shift();
  if (dataBaseItem) {
    setUserHtml(dataBaseItem.htmlState);
    setUserCss(dataBaseItem.cssState);
  }

  useEffect(() => {
    const iframeMap = { user: null, answer: null };
    // 아이프레임 이벤트 리스너 등록
    async function handleIframeMessage(event) {
      if (event?.source?.location?.pathname === 'srcdoc') {
        // 이벤트가 발생될 때마다 아이프레임 요소 업데이트
        iframeMap[event.source.frameElement.dataset.type] = event.source;
        // 요소에 접근해서 스코어 계산
        if (iframeMap.user && iframeMap.answer) {
          setComparing(true);
          setScore(await compareMarkup(iframeMap.user, iframeMap.answer));
          setComparing(false);
        }
      }
    }
    window.addEventListener('message', handleIframeMessage);

    // 아이프레임 이벤트 발생을 위해 이벤트 리스너 등록 후 아이프레임 렌더
    setIframeListenerReady(true);

    return () => {
      // 아이프레임 이벤트 리스너 제거
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  useEffect(() => {
    // db에 코드 저장
    try {
      db.markups.put({ id, htmlState: userHtml, cssState: userCss }, id);
    } catch (error) {
      console.error(error);
    }
  }, [userHtml, userCss, id]);

  function resetHandler() {
    setUserHtml(defaultUserHtml);
    setUserCss(defaultUserCss);
  }

  return (
    <div className={styles.wrap}>
      <Header resetHandler={resetHandler} />
      <main className={styles.main}>
        <QuizEditor
          wrapperClass={styles.editor}
          activate={activeHtmlStateTab}
          html={userHtml}
          css={userCss}
          handleActivate={setActiveCodeTab}
          handleHtml={setUserHtml}
          handleCss={setUserCss}
          handleDebouncing={setDebouncing}
        />
        <QuizView
          wrapperClass={styles.view}
          activate={activeUserViewTab}
          userHtml={userHtml}
          userCss={userCss}
          answerHtml={answerHtml}
          answerCss={answerCss}
          handleActivate={setActiveUserViewTab}
          iframeListenerReady={iframeListenerReady}
        />
        <QuizResult wrapperClassName={styles.grade} score={score} debouncing={debouncing} comparing={comparing} />
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = readQuizFileList();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const quizFileData = readQuizFileById(params.id);
  return {
    props: { id: params.id, ...quizFileData },
  };
}
