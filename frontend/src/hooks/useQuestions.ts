import { useEffect, useState } from "react";
import type { Question } from "../types";
import { fetchQuestions } from "../lib/questions";

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchQuestions()
      .then((data) => {
        if (cancelled) return;
        setQuestions(data);
      })
      .catch((value: unknown) => {
        if (cancelled) return;
        const message = value instanceof Error ? value.message : "Неизвестная ошибка";
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { questions, loading, error };
}

