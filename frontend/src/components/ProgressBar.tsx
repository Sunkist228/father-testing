export function ProgressBar({ value, max }: { value: number; max: number }) {
  const percent = max <= 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="progress-wrap" aria-label={`Прогресс ${percent}%`}>
      <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
    </div>
  );
}

