import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { db } from '@model/db';
import Header from '@component/header';
import QuizEditor from '@component/quiz/QuizEditor';
import QuizResult from '@component/quiz/QuizResult';
import QuizView from '@component/quiz/QuizView';
import compareMarkup from '@lib/score/compare';
import styles from './Quiz.module.scss';

const DB_VERSION = 1;

interface QuizlistProps {
  quizList: QuizParams[];
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
  name: string;
}

export default function Quiz({ quizList, id, name, category, defaultUserHtml, defaultUserCss, answerHtml, answerCss }: QuizlistProps) {
  const [userHtml, setUserHtml] = useState(defaultUserHtml);
  const [userCss, setUserCss] = useState(defaultUserCss);
  const [activeHtmlStateTab, setActiveCodeTab] = useState(true);
  const [activeUserViewTab, setActiveUserViewTab] = useState(true);
  const [debouncing, setDebouncing] = useState(false);
  const [score, setScore] = useState(0);
  const [comparing, setComparing] = useState(false);
  const [iframeListenerReady, setIframeListenerReady] = useState(false);
  const [quizCleared, setQuizCleared] = useState(false);
  const [clearAnimationState, setClearAnimationState] = useState(false);
  const [userIframe, setUserIframe] = useState<Window>(null);
  const [answerIframe, setAnswerIframe] = useState<Window>(null);

  // init
  useEffect(() => {
    async function loadIndexedDB() {
      const savedState = await db.markups.get(id);
      if (savedState?.version === DB_VERSION && savedState) {
        const { cssState, htmlState, quizClearedState } = savedState;
        setUserHtml(htmlState);
        setUserCss(cssState);
        setQuizCleared(quizClearedState);
      } else {
        setUserHtml(defaultUserHtml);
        setUserCss(defaultUserCss);
        setQuizCleared(false);
      }
    }

    loadIndexedDB();
  }, [id, defaultUserHtml, defaultUserCss]);

  useEffect(() => {
    // 아이프레임 이벤트 리스너 등록
    async function handleIframeMessage(event) {
      if (event?.source?.location?.pathname === 'srcdoc') {
        // 이벤트가 발생될 때마다 아이프레임 요소 업데이트
        const iframeType = event.source.frameElement.dataset.type;
        if (iframeType === 'user') {
          setUserIframe(event.source);
        } else if (iframeType === 'answer') {
          setAnswerIframe(event.source);
        }
        // 요소에 접근해서 스코어 계산
        if (userIframe && answerIframe) {
          setComparing(true);
          const currentScore = await compareMarkup(userIframe, answerIframe);
          setScore(currentScore);
          setComparing(false);

          // 처음으로 정답을 맞혔을 경우
          if (currentScore === 1 && quizCleared === false) {
            setQuizCleared(true);
            setClearAnimationState(true);
            setTimeout(() => {
              setClearAnimationState(false);
            }, 5000);
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
  }, [userIframe, answerIframe, quizCleared]);

  useEffect(() => {
    // db에 코드 저장
    try {
      db.markups.put({ id, htmlState: userHtml, cssState: userCss, quizClearedState: quizCleared, version: DB_VERSION }, id);
    } catch (error) {
      console.error(error);
    }
  }, [userHtml, userCss, id, quizCleared]);

  const resetHandler = () => {
    setUserHtml(defaultUserHtml);
    setUserCss(defaultUserCss);
  };

  return (
    <div className={styles.wrap}>
      {clearAnimationState && <Confetti width={document.body.clientWidth - 50} height={document.body.clientHeight} recycle={false} />}
      <Header resetHandler={resetHandler} quizList={quizList} />
      <main className={styles.main_wrap}>
        <h2 className={styles.quiz_name}>{`# Quiz ${id} < ${name} >`}</h2>
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
        <div className={styles.view_result_wrap}>
          <QuizResult
            wrapperClassName={styles.result}
            score={score}
            debouncing={debouncing}
            comparing={comparing}
            quizCleared={quizCleared}
            quizList={quizList}
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
        </div>
        {quizCleared && (
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
