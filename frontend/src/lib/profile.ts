import type { Profile, QuestionStat, SessionRecord } from "../types";
import { createTrainingDayPlans } from "./trainingPlan";

const STORAGE_KEY = "father_testing_profile_v1";

function defaultQuestionStat(): QuestionStat {
  return {
    seen: 0,
    correct: 0,
    wrong: 0,
    lastSeenAt: null,
    wrongStreak: 0
  };
}

export function createDefaultProfile(): Profile {
  return {
    questionStats: {},
    sessions: [],
    trainingPlan: {
      startDate: new Date().toISOString(),
      dayPlans: createTrainingDayPlans(),
      completion: 0
    },
    settings: {
      sessionSizeDefault: 30,
      animationLevel: "normal"
    }
  };
}

export function loadProfile(): Profile {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultProfile();
  }
  try {
    const parsed = JSON.parse(raw) as Profile;
    return parsed;
  } catch {
    return createDefaultProfile();
  }
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function withQuestionResult(profile: Profile, questionId: string, isCorrect: boolean): Profile {
  const current = profile.questionStats[questionId] ?? defaultQuestionStat();
  const next = {
    ...current,
    seen: current.seen + 1,
    correct: current.correct + (isCorrect ? 1 : 0),
    wrong: current.wrong + (isCorrect ? 0 : 1),
    lastSeenAt: new Date().toISOString(),
    wrongStreak: isCorrect ? 0 : current.wrongStreak + 1
  };

  return {
    ...profile,
    questionStats: {
      ...profile.questionStats,
      [questionId]: next
    }
  };
}

export function withCompletedSession(profile: Profile, session: SessionRecord): Profile {
  return {
    ...profile,
    sessions: [...profile.sessions, session]
  };
}

export function withCompletedTrainingDay(profile: Profile, day: number): Profile {
  const dayPlans = profile.trainingPlan.dayPlans.map((plan) =>
    plan.day === day ? { ...plan, done: true } : plan
  );
  const done = dayPlans.filter((plan) => plan.done).length;
  return {
    ...profile,
    trainingPlan: {
      ...profile.trainingPlan,
      dayPlans,
      completion: Math.round((done / dayPlans.length) * 100)
    }
  };
}

export function getReadinessStatus(profile: Profile): {
  ready: boolean;
  streak: number;
  target: string;
} {
  const testSessions = profile.sessions.filter((session) => session.mode === "test");
  const lastThree = testSessions.slice(-3);
  const streak = lastThree.filter((session) => session.accuracy >= 85).length;
  return {
    ready: lastThree.length === 3 && streak === 3,
    streak,
    target: ">=85% в 3 последних контрольных сессиях"
  };
}

export function getWeakQuestionIds(profile: Profile, take = 10): string[] {
  return Object.entries(profile.questionStats)
    .sort((left, right) => {
      const leftScore = left[1].wrong * 3 + left[1].wrongStreak * 2;
      const rightScore = right[1].wrong * 3 + right[1].wrongStreak * 2;
      return rightScore - leftScore;
    })
    .slice(0, take)
    .map(([questionId]) => questionId);
}

