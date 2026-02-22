import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useQuestions } from "../hooks/useQuestions";

export function AnswersListPage() {
  const { questions, loading, error } = useQuestions();

  if (loading) {
    return (
      <div className="page-wrap">
        <Card>Загрузка вопросов...</Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrap">
        <Card>Ошибка: {error}</Card>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 className="title" style={{ margin: 0 }}>Все ответы</h1>
          <Link to="/">
            <Button variant="ghost" style={{ width: 'auto' }}>Назад</Button>
          </Link>
        </div>

        <div className="answers-review">
          {questions.map((q, idx) => (
            <div key={q.id} className="answer-item">
              <p className="question-text">
                <strong>{idx + 1}. {q.question}</strong>
              </p>
              <div className="options-review">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = q.correctIndex.includes(optIdx);
                  return (
                    <div key={optIdx} className={`option-review ${isCorrect ? "correct" : ""}`}>
                      {isCorrect ? "● " : "○ "} {opt}
                      {isCorrect && " (✓)"}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="actions-row" style={{ marginTop: '24px' }}>
          <Link to="/">
            <Button>Вернуться в меню</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
