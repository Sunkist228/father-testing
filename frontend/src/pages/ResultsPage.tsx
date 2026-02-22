import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import type { QuizResult } from "../types";

export function ResultsPage() {
  const location = useLocation();
  const result = location.state as QuizResult | undefined;
  const [activeTab, setActiveTab] = useState<"stats" | "review">("stats");

  if (!result) {
    return (
      <div className="page-wrap">
        <Card>
          <h1 className="title">Результаты</h1>
          <p>Нет данных по последней сессии.</p>
          <Link to="/">
            <Button>В меню</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <Card>
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            Статистика
          </button>
          <button 
            className={`tab-btn ${activeTab === "review" ? "active" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            Разбор ответов
          </button>
        </div>

        {activeTab === "stats" ? (
          <div className="tab-content">
            <h1 className="title">Результаты</h1>
            <div className="stats-grid">
              <p>Режим: <strong>{result.mode}</strong></p>
              <p>Счет: <strong>{result.score} / {result.total}</strong></p>
              <p>Точность: <strong>{result.accuracy}%</strong></p>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            <h2 className="subtitle">Ваши ответы:</h2>
            {result.answers && result.answers.length > 0 ? (
              <div className="answers-review">
                {result.answers.map((item, idx) => (
                  <div key={idx} className={`answer-item ${item.isCorrect ? "correct" : "wrong"}`}>
                    <p className="question-text">
                      <strong>{idx + 1}. {item.question.question}</strong>
                    </p>
                    <div className="options-review">
                      {item.question.options.map((opt, optIdx) => {
                        const isSelected = item.selectedIndices.includes(optIdx);
                        const isCorrect = item.question.correctIndex.includes(optIdx);
                        let className = "option-review";
                        if (isCorrect) className += " correct";
                        if (isSelected && !isCorrect) className += " wrong";
                        
                        return (
                          <div key={optIdx} className={className}>
                            {isSelected ? "● " : "○ "} {opt}
                            {isCorrect && " (✓)"}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Нет данных для обзора.</p>
            )}
          </div>
        )}

        <div className="actions-row" style={{ marginTop: '24px' }}>
          <Link to="/">
            <Button>В основное меню</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

