import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Profile, SessionRecord } from "../types";
import {
  loadProfile,
  saveProfile,
  withCompletedSession,
  withCompletedTrainingDay,
  withQuestionResult
} from "../lib/profile";

type ProfileAction =
  | { type: "mark-result"; payload: { questionId: string; isCorrect: boolean } }
  | { type: "complete-session"; payload: SessionRecord }
  | { type: "complete-day"; payload: { day: number } }
  | { type: "set-test-size"; payload: { value: number } };

type ProfileContextValue = {
  profile: Profile;
  markResult: (questionId: string, isCorrect: boolean) => void;
  completeSession: (session: SessionRecord) => void;
  completeDay: (day: number) => void;
  setTestSize: (value: number) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function reducer(state: Profile, action: ProfileAction): Profile {
  switch (action.type) {
    case "mark-result":
      return withQuestionResult(state, action.payload.questionId, action.payload.isCorrect);
    case "complete-session":
      return withCompletedSession(state, action.payload);
    case "complete-day":
      return withCompletedTrainingDay(state, action.payload.day);
    case "set-test-size":
      return {
        ...state,
        settings: {
          ...state.settings,
          sessionSizeDefault: action.payload.value
        }
      };
    default:
      return state;
  }
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, dispatch] = useReducer(reducer, undefined, loadProfile);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      markResult: (questionId, isCorrect) =>
        dispatch({ type: "mark-result", payload: { questionId, isCorrect } }),
      completeSession: (session) => dispatch({ type: "complete-session", payload: session }),
      completeDay: (day) => dispatch({ type: "complete-day", payload: { day } }),
      setTestSize: (value) => dispatch({ type: "set-test-size", payload: { value } })
    }),
    [profile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile должен использоваться внутри ProfileProvider");
  }
  return context;
}

