import Link from 'next/link';
import styles from './QuizListItem.module.scss';

interface QuizListProps {
  quizList: QuizListPropsInner[];
}

interface QuizListPropsInner {
  id: string;
  category: string;
  name: string;
}

export default function QuizListItem({ quizList }: QuizListProps) {
  if (!quizList) {
    return null;
  }

  return (
    <ul className={styles.list_quiz}>
      {quizList.map((quiz) => (
        <li className={styles.quiz_quiz} key={quiz.id}>
          <Link href={`/quiz/${quiz.id}`} className={styles.link_quiz}>
            # Quiz {quiz.id} {quiz.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
