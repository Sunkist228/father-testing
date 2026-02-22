import type { Profile, Question } from "../types";

export function getQuestionWeight(questionId: string, profile: Profile, recentlySeen: string[]): number {
  const stat = profile.questionStats[questionId];
  const wrong = stat?.wrong ?? 0;
  const wrongStreak = stat?.wrongStreak ?? 0;
  const seen = stat?.seen ?? 0;
  const recentPenalty = recentlySeen.includes(questionId) ? 2 : 0;

  const rawWeight = wrong * 3 + wrongStreak * 2 + (seen === 0 ? 1.5 : 0) - recentPenalty;
  return Math.max(0.5, rawWeight);
}

export function pickWeightedQuestion(questions: Question[], profile: Profile, recentlySeen: string[]): Question {
  const weights = questions.map((question) => getQuestionWeight(question.id, profile, recentlySeen));
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  let random = Math.random() * totalWeight;

  for (let index = 0; index < questions.length; index += 1) {
    random -= weights[index];
    if (random <= 0) {
      return questions[index];
    }
  }

  return questions[questions.length - 1];
}

