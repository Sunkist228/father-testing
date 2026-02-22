import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnswerOption } from "../components/AnswerOption";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { useQuestions } from "../hooks/useQuestions";
import { pickWeightedQuestion } from "../lib/marathon";
import { isAnswerCorrect } from "../lib/questions";
import { useProfile } from "../state/ProfileContext";
import type { AnswerRecord, Mode, Question, SessionRecord } from "../types";

function shuffle<T>(values: T[]): T[] {
  const next = [...values];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const random = Math.floor(Math.random() * (index + 1));
    const temp = next[index];
    next[index] = next[random];
    next[random] = temp;
  }
  return next;
}

export function QuizPage() {
  const { mode: rawMode } = useParams();
  const mode = (rawMode as Mode) ?? "learn";
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const { profile, markResult, completeSession } = useProfile();
  const { questions, loading, error } = useQuestions();

  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [sessionAnswers, setSessionAnswers] = useState<AnswerRecord[]>([]);
  const [startedAt] = useState(new Date().toISOString());

  useEffect(() => {
    if (questions.length === 0) return;
    setCurrentIndex(0);
    setSelected([]);
    setSubmitted(false);
    setScore(0);
    setAnswered(0);
    setCorrectStreak(0);
    setRecentIds([]);
    setSessionAnswers([]);

    if (mode === "test") {
      const size = Math.max(20, Math.min(40, profile.settings.sessionSizeDefault));
      setSessionQuestions(shuffle(questions).slice(0, size));
      return;
    }
    if (mode === "learn") {
      setSessionQuestions(questions);
      return;
    }
    setSessionQuestions([pickWeightedQuestion(questions, profile, [])]);
  }, [mode, questions, profile.settings.sessionSizeDefault]);

  const currentQuestion = useMemo(() => sessionQuestions[currentIndex], [sessionQuestions, currentIndex]);

  if (!["learn", "test", "marathon"].includes(mode)) {
    return <Card>Неизвестный режим</Card>;
  }

  if (loading) {
    return <Card>Загрузка вопросов...</Card>;
  }

  if (error || questions.length === 0 || !currentQuestion) {
    return <Card>Не удалось загрузить вопросы: {error ?? "пустой список"}</Card>;
  }

  const isMultiAnswer = currentQuestion.correctIndex.length > 1;

  const accuracy = answered > 0 ? Math.round((score / answered) * 100) : 0;
  const isCorrect = submitted ? isAnswerCorrect(selected, currentQuestion.correctIndex) : false;

  function toggleSelection(index: number) {
    if (submitted) return;
    if (!isMultiAnswer) {
      setSelected([index]);
      return;
    }
    setSelected((current) =>
      current.includes(index) ? current.filter((value) => value !== index) : [...current, index]
    );
  }

  function submitAnswer() {
    if (selected.length === 0) return;
    const correct = isAnswerCorrect(selected, currentQuestion.correctIndex);
    markResult(currentQuestion.id, correct);
    setSessionAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedIndices: selected,
        isCorrect: correct
      }
    ]);
    setSubmitted(true);
    setAnswered((value) => value + 1);
    if (correct) {
      setScore((value) => value + 1);
      setCorrectStreak((value) => value + 1);
    } else {
      setCorrectStreak(0);
    }
  }

  function finishSession() {
    const total = answered;
    const finalScore = score;
    const finalAccuracy = total > 0 ? Math.round((finalScore / total) * 100) : 0;
    const finishedAt = new Date().toISOString();
    const session: SessionRecord = {
      id: `${mode}-${Date.now()}`,
      mode,
      startedAt,
      finishedAt,
      score: finalScore,
      total,
      accuracy: finalAccuracy
    };
    completeSession(session);
    navigate("/results", {
      state: {
        mode,
        score: finalScore,
        total,
        accuracy: finalAccuracy,
        startedAt,
        finishedAt,
        answers: sessionAnswers
      }
    });
  }

  function nextQuestion() {
    if (mode === "marathon") {
      setRecentIds((current) => {
        const next = [...current, currentQuestion.id];
        return next.slice(-5);
      });
      const next = pickWeightedQuestion(questions, profile, [...recentIds, currentQuestion.id].slice(-5));
      setSessionQuestions([next]);
      setCurrentIndex(0);
      setSelected([]);
      setSubmitted(false);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= sessionQuestions.length) {
      finishSession();
      return;
    }
    setCurrentIndex(nextIndex);
    setSelected([]);
    setSubmitted(false);
  }

  return (
    <div className="page-wrap">
      <Card>
        <div className="quiz-status">
          <strong>
            {mode === "learn" ? "Заучивание" : mode === "test" ? "Контрольная" : "Marathon"}
          </strong>
          {mode !== "marathon" ? (
            <span>
              Вопрос {currentIndex + 1} / {sessionQuestions.length}
            </span>
          ) : (
            <span>Отвечено: {answered}</span>
          )}
        </div>

        {mode !== "marathon" ? (
          <ProgressBar value={currentIndex + 1} max={sessionQuestions.length} />
        ) : (
          <div className="marathon-stats">
            <span>Серия: {correctStreak}</span>
            <span>Точность: {accuracy}%</span>
          </div>
        )}

        <motion.div
          key={currentQuestion.id}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="question-card"
        >
          <h2 className="question-text">{currentQuestion.question}</h2>
        </motion.div>

        <div className="answers-wrap">
          {currentQuestion.options.map((option, index) => (
            <AnswerOption
              key={`${currentQuestion.id}-${index}`}
              text={option}
              index={index}
              selected={selected.includes(index)}
              disabled={submitted}
              isCorrect={submitted && currentQuestion.correctIndex.includes(index)}
              isWrong={
                submitted && selected.includes(index) && !currentQuestion.correctIndex.includes(index)
              }
              onToggle={toggleSelection}
            />
          ))}
        </div>

        {!submitted ? (
          <Button onClick={submitAnswer} disabled={selected.length === 0}>
            Проверить
          </Button>
        ) : null}

        {submitted ? (
          <p className={isCorrect ? "feedback-ok" : "feedback-bad"}>
            {isCorrect ? "Верно" : "Неверно"}
          </p>
        ) : null}

        <div className="actions-row">
          <Button variant="ghost" onClick={() => navigate("/")}>
            В меню
          </Button>
          {submitted ? <Button onClick={nextQuestion}>Следующий</Button> : null}
          {mode === "marathon" ? (
            <Button variant="danger" onClick={finishSession}>
              Завершить марафон
            </Button>
          ) : null}
          {mode !== "marathon" ? (
            <Button variant="danger" onClick={finishSession}>
              Завершить сессию
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
