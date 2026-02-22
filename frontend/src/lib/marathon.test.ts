import { describe, expect, it } from "vitest";
import { createDefaultProfile } from "./profile";
import { getQuestionWeight } from "./marathon";

describe("getQuestionWeight", () => {
  it("applies formula and min weight", () => {
    const profile = createDefaultProfile();
    profile.questionStats["7"] = {
      seen: 3,
      correct: 1,
      wrong: 2,
      lastSeenAt: null,
      wrongStreak: 1
    };

    expect(getQuestionWeight("7", profile, [])).toBe(8);
    expect(getQuestionWeight("7", profile, ["7"])).toBe(6);
    expect(getQuestionWeight("99", profile, ["99"])).toBe(0.5);
  });
});

