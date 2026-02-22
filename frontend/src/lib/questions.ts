import type { Question, RawQuestion } from "../types";

function fixMojibake(value: string): string {
  const suspicious = (value.match(/[РС]/g) ?? []).length > Math.floor(value.length / 4);
  if (!suspicious) {
    return value;
  }
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
}

export function normalizeQuestions(rawQuestions: RawQuestion[]): Question[] {
  return rawQuestions.map((question, index) => ({
    id: String(index + 1),
    question: fixMojibake(question.question.trim()),
    options: question.options.map((option) => fixMojibake(option.trim())),
    correctIndex: Array.isArray(question.correctIndex)
      ? [...question.correctIndex]
      : [question.correctIndex]
  }));
}

export async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch("/api/questions");
  if (!response.ok) {
    throw new Error(`Не удалось загрузить вопросы: ${response.status}`);
  }
  const data = (await response.json()) as RawQuestion[];
  return normalizeQuestions(data);
}

export function isAnswerCorrect(selected: number[], correct: number[]): boolean {
  if (selected.length !== correct.length) {
    return false;
  }
  const a = [...selected].sort((left, right) => left - right);
  const b = [...correct].sort((left, right) => left - right);
  return a.every((value, index) => value === b[index]);
}
