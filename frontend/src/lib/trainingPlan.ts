import type { TrainingDayPlan } from "../types";

export function createTrainingDayPlans(): TrainingDayPlan[] {
  const commonTasks = [
    "10 мин: повтор вчерашних ошибок",
    "20 мин: марафон (адаптивный)",
    "15-20 мин: мини-тест (30 вопросов)",
    "5-10 мин: разбор ошибок"
  ];

  const plans: TrainingDayPlan[] = [];
  for (let day = 1; day <= 14; day += 1) {
    let title = "";
    if (day <= 10) {
      title = `День ${day}: набор базы + повтор слабых вопросов`;
    } else if (day <= 13) {
      title = `День ${day}: контрольные сессии и добивка слабых мест`;
    } else {
      title = "День 14: легкое повторение + контрольная сессия";
    }

    plans.push({
      day,
      title,
      tasks: [...commonTasks],
      done: false
    });
  }

  return plans;
}

