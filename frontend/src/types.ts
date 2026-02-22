export type RawQuestion = {
  question: string;
  options: string[];
  correctIndex: number | number[];
};

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number[];
};

export type Mode = "learn" | "test" | "marathon";

export type QuestionStat = {
  seen: number;
  correct: number;
  wrong: number;
  lastSeenAt: string | null;
  wrongStreak: number;
};

export type SessionRecord = {
  id: string;
  mode: Mode;
  startedAt: string;
  finishedAt: string;
  score: number;
  total: number;
  accuracy: number;
};

export type TrainingDayPlan = {
  day: number;
  title: string;
  tasks: string[];
  done: boolean;
};

export type TrainingPlan = {
  startDate: string;
  dayPlans: TrainingDayPlan[];
  completion: number;
};

export type Settings = {
  sessionSizeDefault: number;
  animationLevel: "normal" | "reduced";
};

export type Profile = {
  questionStats: Record<string, QuestionStat>;
  sessions: SessionRecord[];
  trainingPlan: TrainingPlan;
  settings: Settings;
};

export type AnswerRecord = {
  question: Question;
  selectedIndices: number[];
  isCorrect: boolean;
};

export type QuizResult = {
  mode: Mode;
  score: number;
  total: number;
  accuracy: number;
  startedAt: string;
  finishedAt: string;
  answers?: AnswerRecord[];
};
