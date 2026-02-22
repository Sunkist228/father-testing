import { describe, expect, it } from "vitest";
import { isAnswerCorrect, normalizeQuestions } from "./questions";

describe("normalizeQuestions", () => {
  it("normalizes single and multiple correctIndex formats", () => {
    const normalized = normalizeQuestions([
      { question: "Q1", options: ["A"], correctIndex: 0 },
      { question: "Q2", options: ["A", "B"], correctIndex: [0, 1] }
    ]);

    expect(normalized[0].correctIndex).toEqual([0]);
    expect(normalized[1].correctIndex).toEqual([0, 1]);
    expect(normalized[0].id).toBe("1");
  });
});

describe("isAnswerCorrect", () => {
  it("checks multi-select exact match", () => {
    expect(isAnswerCorrect([2, 0], [0, 2])).toBe(true);
    expect(isAnswerCorrect([0], [0, 2])).toBe(false);
    expect(isAnswerCorrect([0, 1], [0, 2])).toBe(false);
  });
});

