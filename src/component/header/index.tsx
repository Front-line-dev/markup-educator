import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classnames from 'classnames';
import QuizList from '@component/quiz/QuizList';
import styles from './header.module.scss';

interface HeaderProps {
  quizList: QuizParams[];
  resetHandler: React.MouseEventHandler<HTMLButtonElement>;
}

interface QuizParams {
  id: string;
  category: string;
  name: string;
}

function Header({ quizList, resetHandler }: HeaderProps) {
  const router = useRouter();
  const [quizListOpened, setQuizListOpened] = useState(false);
  const [copySuccessPopupVisible, setCopySuccessPopupVisible] = useState(false);
  const [copyErrorPopupVisible, setCopyErrorPopupVisible] = useState(false);

  function toggleQuizListOpened() {
    setQuizListOpened(!quizListOpened);
  }

  async function copyUrlButtonHandler() {
    try {
      await navigator.clipboard.writeText(document.location.href);

      setCopySuccessPopupVisible(true);
      setTimeout(() => {
        setCopySuccessPopupVisible(false);
      }, 3400);
    } catch (error) {
      setCopyErrorPopupVisible(true);
      setTimeout(() => {
        setCopyErrorPopupVisible(false);
      }, 3400);
    }
  }

  useEffect(() => {
    setQuizListOpened(false);
  }, [router.asPath]);

  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>
          <Link className={styles.home_link} href="/">
            Can you markup?
          </Link>
        </h1>
        <div className={styles.button_area}>
          <button type="button" className={classnames(styles.top_button, styles.reset_button)} onClick={resetHandler}>
            <span className="blind">코드 초기화</span>
          </button>
          <button type="button" className={classnames(styles.top_button, styles.share_button)} onClick={copyUrlButtonHandler}>
            <span className="blind">공유</span>
          </button>
          <button type="button" onClick={toggleQuizListOpened} className={classnames(styles.top_button, styles.quiz_button)}>
            <span className="blind">퀴즈목록</span>
          </button>
          {quizListOpened && (
            <div className={styles.overlay}>
              <div className={styles.dimmed} onClick={toggleQuizListOpened} aria-hidden="true" />
              <div className={styles.quiz_list_area}>
                <div className={styles.quiz_list_header}>
                  <strong className={styles.title}>퀴즈 리스트</strong>
                  <button type="button" className={styles.close_button} onClick={toggleQuizListOpened}>
                    <span className="blind">닫기</span>
                  </button>
                </div>
                <QuizList quizList={quizList} />
              </div>
            </div>
          )}
          {copySuccessPopupVisible && <p className={styles.copy_popup_text}>현재 페이지 주소를 복사했습니다</p>}
          {copyErrorPopupVisible && <p className={styles.copy_popup_text}>복사를 실패했습니다</p>}
        </div>
      </div>
    </header>
  );
}
export default Header;
