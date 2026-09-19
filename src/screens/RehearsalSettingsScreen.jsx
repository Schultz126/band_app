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
    <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm flex-col">
        <GoBackbutton />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Configurar Ensaio
            </h1>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col text-left">
                <label className="text-sm text-gray-600 mb-1">
                  Tempo disponível:
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col text-left mb-4">
                <label className="text-sm text-gray-600 mb-1">
                  Quantidade de músicas:
                </label>
                <input
                  type="number"
                  min="1"
                  max="14" // Deve ser removido na versão final
                  value={songs}
                  onChange={(e) => setSongs(e.target.value)}
                  placeholder="Ex: 5"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col text-left mb-4">
                <label className="text-sm text-gray-600 mb-1">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
