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

interface QuizlistProps {
  quizFileList: QuizParams[];
  id: string;
  name: string;
  category: string;
  defaultUserHtml: string;
  defaultUserCss: string;
  answerHtml: string;
  answerCss: string;
}

interface QuizParams {
  id: string;
  category: string;
}

export default function Quiz({ quizFileList, id, name, category, defaultUserHtml, defaultUserCss, answerHtml, answerCss }: QuizlistProps) {
  const [userHtml, setUserHtml] = useState(defaultUserHtml);
  const [userCss, setUserCss] = useState(defaultUserCss);
  const [activeHtmlStateTab, setActiveCodeTab] = useState(true);
  const [activeUserViewTab, setActiveUserViewTab] = useState(true);
  const [debouncing, setDebouncing] = useState(false);
  const [score, setScore] = useState(0);
  const [comparing, setComparing] = useState(false);
  const [iframeListenerReady, setIframeListenerReady] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizlist, setQuizList] = useState([]);

  // db에서 코드 불러오기
  const dataBaseItem = useLiveQuery(() => db.markups.where('id').equals(id).toArray())?.shift();
  if (dataBaseItem) {
    setUserHtml(dataBaseItem.htmlState);
    setUserCss(dataBaseItem.cssState);
  }

  useEffect(() => {
    const quizfilelist = [...quizFileList];
    quizfilelist.sort((a, b) => (
      a.id < b.id ? -1 : 1)
    )
    setQuizList(quizfilelist);
  }, [quizFileList]);

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
          const currentScore = await compareMarkup(iframeMap.user, iframeMap.answer);
          setScore(currentScore);
          setComparing(false);

          // 정답일 경우 정답코드 보여줌
          if (currentScore === 1) {
            setShowAnswer(true);
          }
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
      <Header resetHandler={resetHandler} quizFileList={quizlist} />
      <main className={styles.main}>
        <div className={styles.name}>{name}</div>
        <QuizEditor
          wrapperClass={styles.editor}
          activate={activeHtmlStateTab}
          html={userHtml}
          css={userCss}
          handleActivate={setActiveCodeTab}
          handleHtml={setUserHtml}
          handleCss={setUserCss}
          handleDebouncing={setDebouncing}
          editable
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
        {showAnswer && (
          <>
            <strong className={styles.answer_title}>Answer Code</strong>
            <QuizEditor
              wrapperClass={styles.answer}
              activate={activeHtmlStateTab}
              html={answerHtml}
              css={answerCss}
              handleActivate={setActiveCodeTab}
              handleHtml={setUserHtml}
              handleCss={setUserCss}
              handleDebouncing={setDebouncing}
              editable={false}
            />
          </>
        )}
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
  const quizFileList = readQuizFileList(true);
  return {
    props: { quizFileList, id: params.id, ...quizFileData }
  };
}
