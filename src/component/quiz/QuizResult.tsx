import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import styles from './QuizResult.module.scss';

interface QuizResultProps {
  wrapperClassName?: string;
  score: number;
  debouncing: boolean;
  comparing: boolean;
  quizCleared: boolean;
  quizList: QuizParams[];
}

interface QuizParams {
  id: string;
  category: string;
  name: string;
}

export default function QuizResult({ wrapperClassName, score, debouncing, comparing, quizCleared, quizList }: QuizResultProps) {
  const [nextQuiz, setNextQuiz] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentQuiz = router.asPath.split('/').pop();
    const nextQuizID = String(Number(currentQuiz) + 1);
    if (quizList.find((quiz) => quiz.id === nextQuizID)) {
      setNextQuiz(nextQuizID);
      setQuizFinished(false);
    } else {
      setQuizFinished(true);
    }
  }, [router.asPath, quizList]);

  return (
    <div className={classnames(styles.wrap, wrapperClassName)}>
      <p className={styles.text}>
        {debouncing || comparing ? <span className={styles.comparing} /> : <span className={styles.result}>유사도 {Math.floor(score * 100)}%</span>}
      </p>
      {quizCleared &&
        (quizFinished ? (
          <Link href="/" role="button" className={classnames(styles.link, 'contrast')}>
            홈으로 돌아가기
          </Link>
        ) : (
          <Link href={`/quiz/${nextQuiz}`} role="button" className={classnames(styles.link, 'contrast')}>
            다음 문제로
          </Link>
        ))}
    </div>
  );
}
