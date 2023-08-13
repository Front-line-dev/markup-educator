import { useState, useEffect } from 'react';
import QuizListItem from './QuizListItem';
import styles from './QuizList.module.scss';

interface QuizListProps {
  quizList: QuizListPropsInner[];
}

interface QuizListPropsInner {
  id: string;
  category: string;
  name: string;
}

export default function QuizList({ quizList }: QuizListProps) {
  const [basicQuizList, setBasicQuizList] = useState([]);
  const [intermediateQuizList, setIntermediateQuizList] = useState([]);
  const [expertQuizList, setExpertQuizList] = useState([]);
  const [extraQuizList, setExtraQuizList] = useState([]);

  useEffect(() => {
    const quizCategoryMap = {
      1: setBasicQuizList,
      2: setIntermediateQuizList,
      3: setExpertQuizList,
      4: setExtraQuizList,
    };

    quizList
      .sort((a, b) => (Number(a.id) < Number(b.id) ? -1 : 1))
      .forEach((quiz) => {
        if (quiz.category) {
          quizCategoryMap[quiz.category]((categoryQuizList) => [...categoryQuizList, quiz]);
        }
      });
  }, [quizList]);

  return (
    <>
      <div className={styles.quiz_box}>
        <em className={styles.quiz_level}>초급</em>
        <QuizListItem quizList={basicQuizList} />
      </div>
      <div className={styles.quiz_box}>
        <em className={styles.quiz_level}>중급</em>
        <QuizListItem quizList={intermediateQuizList} />
      </div>
      <div className={styles.quiz_box}>
        <em className={styles.quiz_level}>고급</em>
        <QuizListItem quizList={expertQuizList} />
      </div>
    </>
  );
}
