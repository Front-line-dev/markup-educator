import fs from 'fs';
import path from 'path';

export function readQuizFiles() {
  const fileNames = fs.readdirSync('src/quiz');
  const files = fileNames.map((fileName) => {
    const { category, name } = JSON.parse(fs.readFileSync(`src/quiz/${fileName}`, 'utf8'));
    return {
      id: path.parse(fileName).name,
      category,
      name,
    };
  });

  return files;
}

export function readQuizFileById(index?: string) {
  const quizFileData = JSON.parse(fs.readFileSync(`src/quiz/${index}.json`, 'utf8'));
  return quizFileData;
}
