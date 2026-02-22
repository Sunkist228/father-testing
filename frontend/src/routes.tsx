import { Navigate, Route, Routes } from "react-router-dom";
import { AnswersListPage } from "./pages/AnswersListPage";
import { HomePage } from "./pages/HomePage";
import { QuizPage } from "./pages/QuizPage";
import { ResultsPage } from "./pages/ResultsPage";
import { TrainingProgramPage } from "./pages/TrainingProgramPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/training" element={<TrainingProgramPage />} />
      <Route path="/answers" element={<AnswersListPage />} />
      <Route path="/:mode" element={<QuizPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

