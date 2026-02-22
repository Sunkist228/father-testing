import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { AppRoutes } from "./routes";

export function App() {
  const location = useLocation();

  return (
    <main className="app-shell">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <AppRoutes />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

