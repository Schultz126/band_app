import { SONGS } from "../dummie_data/songs";
import SongElement from "../components/SongElement/SongElement";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddSongButton from "../components/AddSongButton/AddSongButton";

const SONG_STATUSES = ["ok", "ensaiar", "tirar"];
const STATUS_CLASSES = {
  ok: "border-green-200 bg-green-50 text-green-700",
  ensaiar: "border-yellow-200 bg-yellow-50 text-yellow-700",
  tirar: "border-red-200 bg-red-50 text-red-700",
};

const SetListScreen = () => {
  const navigate = useNavigate();
  const [pendingStatusByIndex, setPendingStatusByIndex] = useState({});
  const [expandedSongIndex, setExpandedSongIndex] = useState(null);

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

    // This is the point where the pending changes can later be sent to a database.
    setPendingStatusByIndex({});
  };

  const pendingChanges = Object.keys(pendingStatusByIndex).length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 pb-10 pt-64 sm:px-6 sm:pt-56 lg:px-8">
      <div className="fixed inset-x-0 top-0 z-10 border-b border-gray-200 bg-gray-100/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-3 flex justify-between">
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="group flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              {/* SVG Left Arrow Icon */}
              <svg
                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go back
            </button>

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
            const isExpanded = expandedSongIndex === index;

            return (
              <li key={index} className="list-none">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSongIndex(isExpanded ? null : index)
                  }
                  aria-expanded={isExpanded}
                  aria-controls={`song-details-${index}`}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
                >
                  <span className="font-semibold text-gray-800">
                    {item.name}
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className={`rounded border px-2 py-1 text-xs font-semibold min-w-14 text-center ${STATUS_CLASSES[status]}`}
                    >
                      {status}
                    </span>
                    <span className="text-gray-400" aria-hidden="true">
                      {isExpanded ? "▴" : "▾"}
                    </span>
                  </span>
                </button>

                {isExpanded && (
                  <div id={`song-details-${index}`} className="px-1 pt-3">
                    <SongElement {...item} status={status} />
                    <label
                      htmlFor={`song-status-${index}`}
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Alterar status
                    </label>
                    <select
                      id={`song-status-${index}`}
                      value={status}
                      onChange={(event) =>
                        updatePendingStatus(index, event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      {SONG_STATUSES.map((songStatus) => (
                        <option key={songStatus} value={songStatus}>
                          {songStatus}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SetListScreen;
