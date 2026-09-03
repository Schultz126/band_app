import { useState } from "react";
import SubmitSettingsButton from "../components/SubmitSettingsButton/SubmitSettingsButton";

const RehearsalSettingsScreen = () => {
  const [time, setTime] = useState("");
  const [songs, setSongs] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
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

          <SubmitSettingsButton time={time} songs={songs} />
        </div>
      </div>
    </div>
  );
};

export default RehearsalSettingsScreen;
