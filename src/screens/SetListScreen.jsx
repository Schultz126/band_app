import { SONGS } from "../dummie_data/songs";
import SongElement from "../components/SongElement/SongElement";
import { useState } from "react";
import AddSongButton from "../components/AddSongButton/AddSongButton";
import GoBackbutton from "../components/GoBackButton/GoBackButton";

const SetListScreen = () => {
  const [pendingStatusByIndex, setPendingStatusByIndex] = useState({});

  const updatePendingStatus = (index, status) => {
    setPendingStatusByIndex((currentStatuses) => {
      if (status === SONGS[index].status) {
        const { [index]: _, ...remainingStatuses } = currentStatuses;
        return remainingStatuses;
      }
      return { ...currentStatuses, [index]: status };
    });
  };

  const confirmStatusChanges = () => {
    Object.entries(pendingStatusByIndex).forEach(([index, status]) => {
      SONGS[Number(index)].status = status;
    });

    setPendingStatusByIndex({});
  };

  const pendingChanges = Object.keys(pendingStatusByIndex).length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 pb-10 pt-64 sm:px-6 sm:pt-56 lg:px-8">
      <div className="fixed inset-x-0 top-0 z-10 border-b border-gray-200 bg-gray-100/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-3 flex justify-between">
            <GoBackbutton />
            <AddSongButton />
          </header>

          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              No Tones Set List
            </h1>
            <span className="bg-gray-800 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
              {SONGS.length} Songs
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex sm:items-center sm:justify-between">
            <p className="mb-3 text-sm text-gray-600 sm:mb-0">
              {pendingChanges === 0
                ? "Selecione uma música para ver os detalhes e alterar seu status."
                : `${pendingChanges} ${pendingChanges === 1 ? "alteração" : "alterações"} aguardando confirmação.`}
            </p>
            <button
              type="button"
              onClick={confirmStatusChanges}
              disabled={pendingChanges === 0}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
            >
              Confirmar alterações
              {pendingChanges > 0 ? ` (${pendingChanges})` : ""}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <ul className="space-y-3">
          {SONGS.map((item, index) => {
            const status = pendingStatusByIndex[index] ?? item.status;

            return (
              <li key={index} className="list-none">
                <SongElement
                  {...item}
                  status={status}
                  onStatusChange={(newStatus) =>
                    updatePendingStatus(index, newStatus)
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SetListScreen;
