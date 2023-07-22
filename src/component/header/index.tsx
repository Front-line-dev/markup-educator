import { useState } from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import styles from './header.module.scss';

interface HeaderProps {
  resetHandler: Function;
}

function Header({ resetHandler }: HeaderProps) {
  const [quizListOpened, setQuizListOpened] = useState(false);
  const [copySuccessPopupVisible, setCopySuccessPopupVisible] = useState(false);
  function toggleQuizListOpened() {
    document.body.classList.toggle('modal_opened', !quizListOpened);
    setQuizListOpened(!quizListOpened);
  }

  function copyUrlButtonHandler() {
    setCopySuccessPopupVisible(true);
    setTimeout(() => {
      setCopySuccessPopupVisible(false);
    }, 3400);
  }
  return (
    <header className={styles.container}>
      <h1 className={styles.title}>
        <a className={styles.home_link} href="#!">
          Can you markup?
        </a>
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
            <div className={styles.dimmed} onClick={toggleQuizListOpened} />
            <div className={styles.quiz_list_area}>
              <div className={styles.quiz_list_header}>
                <strong className={styles.title}>퀴즈 리스트</strong>
                <button type="button" className={styles.close_button} onClick={toggleQuizListOpened}>
                  <span className="blind">닫기</span>
                </button>
              </div>
              <div className={styles.quiz_box}>
                <em className={styles.quiz_level}>초급</em>
                {/* 문제 수 받아서 처리 */}
                <ul className={styles.list_quiz}>
                  <li className={styles.item_quiz}>
                    <Link href="./quiz/1" className={styles.link_quiz}>
                      # Quiz 01
                    </Link>
                  </li>
                  <li className={styles.item_quiz}>
                    <Link href="./quiz/2" className={styles.link_quiz}>
                      # Quiz 02
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
              <div className={styles.quiz_box}>
                <em className={styles.quiz_level}>고급</em>
                {/* 문제 수 받아서 처리 */}
                <ul className={styles.list_quiz}>
                  <li className={styles.item_quiz}>
                    <Link href="./" className={styles.link_quiz}>
                      # Quiz 01
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {copySuccessPopupVisible && <p className={styles.copy_popup_text}>복사 되었습니다</p>}
      </div>
    </header>
  );
}
export default Header;
