import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { getReadinessStatus } from "../lib/profile";
import { useProfile } from "../state/ProfileContext";

export function HomePage() {
  const { profile, setTestSize } = useProfile();
  const readiness = getReadinessStatus(profile);

  return (
    <div className="page-wrap">
      <Card>
        <h1 className="title">Подготовка к экзамену</h1>
        <p className="subtitle">Режимы обучения и контроль готовности к сдаче</p>

        <div className="mode-grid">
          <Link to="/learn">
            <Button>Режим заучивания</Button>
          </Link>
          <Link to="/test">
            <Button>Контрольная сессия</Button>
          </Link>
          <Link to="/marathon">
            <Button>Marathon</Button>
          </Link>
          <Link to="/answers">
            <Button variant="ghost">Все ответы подряд</Button>
          </Link>
          <Link to="/training">
            <Button variant="ghost">План на 14 дней</Button>
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="section-title">Настройки</h2>
        <label className="field-label" htmlFor="test-size">
          Размер контрольной сессии: {profile.settings.sessionSizeDefault}
        </label>
        <input
          id="test-size"
          className="range-input"
          type="range"
          min={20}
          max={40}
          step={1}
          value={profile.settings.sessionSizeDefault}
          onChange={(event) => setTestSize(Number(event.target.value))}
        />
      </Card>

      <Card>
        <h2 className="section-title">Статус готовности</h2>
        <p>{readiness.target}</p>
        <p>Серия успешных контрольных: {readiness.streak} / 3</p>
        <p className={readiness.ready ? "status-ready" : "status-pending"}>
          {readiness.ready ? "Готов к экзамену" : "Продолжать тренировки"}
        </p>
      </Card>
    </div>
  );
}

