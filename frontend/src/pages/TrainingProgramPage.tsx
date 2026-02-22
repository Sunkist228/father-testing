import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { getReadinessStatus, getWeakQuestionIds } from "../lib/profile";
import { useProfile } from "../state/ProfileContext";

export function TrainingProgramPage() {
  const { profile, completeDay } = useProfile();
  const readiness = getReadinessStatus(profile);
  const weakQuestions = getWeakQuestionIds(profile, 8);

  return (
    <div className="page-wrap">
      <Card>
        <h1 className="title">Программа подготовки на 14 дней</h1>
        <p>Нагрузка: 45-60 минут в день</p>
        <p>Выполнено: {profile.trainingPlan.completion}%</p>
        <p className={readiness.ready ? "status-ready" : "status-pending"}>
          {readiness.ready ? "Критерий готовности выполнен" : "Критерий готовности пока не выполнен"}
        </p>
      </Card>

      {profile.trainingPlan.dayPlans.map((dayPlan) => (
        <Card key={dayPlan.day}>
          <div className="day-header">
            <h2 className="section-title">{dayPlan.title}</h2>
            <Button
              variant={dayPlan.done ? "ghost" : "primary"}
              disabled={dayPlan.done}
              onClick={() => completeDay(dayPlan.day)}
            >
              {dayPlan.done ? "Выполнено" : "Отметить выполненным"}
            </Button>
          </div>
          <ul className="task-list">
            {dayPlan.tasks.map((task, index) => (
              <li key={`${dayPlan.day}-${index}`}>{task}</li>
            ))}
          </ul>
        </Card>
      ))}

      <Card>
        <h2 className="section-title">Слабые вопросы</h2>
        {weakQuestions.length === 0 ? (
          <p>Недостаточно данных. Пройдите марафон или контрольную сессию.</p>
        ) : (
          <p>Номера для приоритета: {weakQuestions.join(", ")}</p>
        )}
      </Card>

      <Link to="/">
        <Button variant="ghost">В меню</Button>
      </Link>
    </div>
  );
}

