import fs from 'fs';

export function readQuizFileList() {
  const fileNames = fs.readdirSync('src/quiz');
  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace('.json', ''),
    },
  }));
}

export function readQuizFileById(index?: string) {
  const quizFileData = JSON.parse(fs.readFileSync(`src/quiz/${index}.json`, 'utf8'));
  return quizFileData;
}

export function quizListToJsonFile() {
  const fileNames = fs.readdirSync('src/quiz');
  return fileNames.map((fileName) => ({
    id: Number(fileName.replace('.json', '')),
    category: JSON.parse(fs.readFileSync(`src/quiz/${fileName}`, 'utf8')).category,
  }));
}
