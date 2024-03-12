import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { readQuizFiles } from '@lib/quiz/readFiles';
import Quiz from '@component/quiz/Quiz';

interface QuizlistProps {
  quizList: QuizParams[];
}

interface QuizParams {
  id: string;
  category: string;
  name: string;
}

export default function WorkshopQuiz({ quizList }: QuizlistProps) {
  const [quizReady, setQuizReady] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [defaultUserHtml, setDefaultUserHtml] = useState('');
  const [defaultUserCss, setDefaultUserCss] = useState('');
  const [answerHtml, setAnswerHtml] = useState('');
  const [answerCss, setAnswerCss] = useState('');
  const router = useRouter();

  useEffect(() => {
    setQuizReady(false);
    const urlParam = decodeURIComponent(router.query?.url as string);

    async function getQuizData(url) {
      try {
        const res = await fetch(url);
        const jsonData = await res.json();
        setName(jsonData.name);
        setCategory(jsonData.category);
        setDefaultUserHtml(jsonData.defaultUserHtml);
        setDefaultUserCss(jsonData.defaultUserCss);
        setAnswerHtml(jsonData.answerHtml);
        setAnswerCss(jsonData.answerCss);
        setQuizReady(true);
      } catch (error) {
        console.error(error);
      }
    }

    if (urlParam) {
      getQuizData(urlParam);
    }
  }, [router]);

  return (
    quizReady && (
      <Quiz
        quizList={quizList}
        id={null}
        name={name}
        category={category}
        defaultUserHtml={defaultUserHtml}
        defaultUserCss={defaultUserCss}
        answerHtml={answerHtml}
        answerCss={answerCss}
        workshop
      />
    )
  );
}

export async function getStaticProps() {
  const files = readQuizFiles();
  return {
    props: { quizList: files },
  };
}
