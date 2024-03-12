import { readQuizFiles, readQuizFileById } from '@lib/quiz/readFiles';
import Quiz from '@component/quiz/Quiz';

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

export default function BuiltInQuiz({ quizList, id, name, category, defaultUserHtml, defaultUserCss, answerHtml, answerCss }: QuizlistProps) {
  return (
    <Quiz
      quizList={quizList}
      id={id}
      name={name}
      category={category}
      defaultUserHtml={defaultUserHtml}
      defaultUserCss={defaultUserCss}
      answerHtml={answerHtml}
      answerCss={answerCss}
      workshop={false}
    />
  );
}

export async function getStaticPaths() {
  const files = readQuizFiles();
  return {
    paths: files.map((file) => ({
      params: {
        id: file.id,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const quizFileData = readQuizFileById(params.id);
  const files = readQuizFiles();
  return {
    props: { quizList: files, id: params.id, ...quizFileData },
  };
}
