import { useState } from "react";
import SubmitSettingsButton from "../components/SubmitSettingsButton/SubmitSettingsButton";
import GoBackbutton from "../components/GoBackButton/GoBackButton";

const todayAsDateInputValue = () => new Date().toISOString().slice(0, 10);

const RehearsalSettingsScreen = () => {
  const [time, setTime] = useState("");
  const [songs, setSongs] = useState("");
  // Native <input type="date"> needs a "YYYY-MM-DD" string, not a Date object
  const [date, setDate] = useState(todayAsDateInputValue());

  return (
    <div className="app-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm flex-col">
        <GoBackbutton />
        <div className="flex flex-1 items-center justify-center">
          <div className="band-panel w-full rounded-lg p-8">
            <p className="band-muted mb-2 text-center text-xs font-bold uppercase tracking-[0.2em]">No Tones</p>
            <h1 className="band-title mb-6 text-center text-2xl">
              Configurar Ensaio
            </h1>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col text-left">
                <label className="band-muted mb-1 text-sm font-semibold">
                  Tempo disponível:
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="band-input"
                />
              </div>

              <div className="flex flex-col text-left mb-4">
                <label className="band-muted mb-1 text-sm font-semibold">
                  Quantidade de músicas:
                </label>
                <input
                  type="number"
                  min="1"
                  max="14" // Deve ser removido na versão final
                  value={songs}
                  onChange={(e) => setSongs(e.target.value)}
                  placeholder="Ex: 5"
                  className="band-input"
                />
              </div>
              <div className="flex flex-col text-left mb-4">
                <label className="band-muted mb-1 text-sm font-semibold">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="band-input"
                />
              </div>

              <SubmitSettingsButton time={time} songs={songs} date={date} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RehearsalSettingsScreen;
