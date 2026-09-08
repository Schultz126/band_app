import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SONG_STATUSES = ["ok", "ensaiar", "tirar"];
const STATUS_CLASSES = {
  ok: "border-green-200 bg-green-50 text-green-700",
  ensaiar: "border-yellow-200 bg-yellow-50 text-yellow-700",
  tirar: "border-red-200 bg-red-50 text-red-700",
};

export const SongElement = (props) => {
  const {
    name,
    artist,
    tune,
    lastPlayed,
    status,
    hasAcousticGuitar,
    bpm,
    star,
    pedal,
    obs,
    howLong,
    howManyTimesHasBeingPlayed,
    onStatusChange, // New prop to handle dropdown changes in the parent
  } = props;

  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false); // Local expansion state

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300 hover:shadow-md">
      {/* Header (Expand/Retract Toggle) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-semibold text-gray-800">{name}</span>
        <span className="flex items-center gap-3">
          <span
            className={`min-w-14 rounded border px-2 py-1 text-center text-xs font-semibold ${STATUS_CLASSES[status]}`}
          >
            {status}
          </span>
          <span className="text-gray-400" aria-hidden="true">
            {isExpanded ? "▴" : "▾"}
          </span>
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4">
          {/* Clickable Area for Navigation */}
          <div
            className="cursor-pointer mb-4 hover:opacity-80 transition-opacity"
            onClick={() => {
              navigate("/set-list/edit-song", { state: props });
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500 font-medium">{artist}</p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                ⭐ {star}
              </div>
            </div>

            {hasAcousticGuitar && (
              <div className="mb-4">
                <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-1 rounded border border-amber-200">
                  Acoustic Guitar
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-lg mb-4 text-sm">
              <div>
                <span className="block text-gray-400 text-xs uppercase tracking-wider">
                  Tune
                </span>
                <span className="font-semibold text-gray-700">{tune}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs uppercase tracking-wider">
                  BPM
                </span>
                <span className="font-semibold text-gray-700">{bpm}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs uppercase tracking-wider">
                  Length
                </span>
                <span className="font-semibold text-gray-700">{howLong}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs uppercase tracking-wider">
                  Plays
                </span>
                <span className="font-semibold text-gray-700">
                  {howManyTimesHasBeingPlayed}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-semibold text-gray-800">Pedal:</span>{" "}
                {pedal}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Obs: </span>{" "}
                {obs ? obs : "Nenhuma"}
              </p>
              <p className="text-gray-400 text-xs mt-3 text-right">
                Last Played:{" "}
                {lastPlayed ? (
                  lastPlayed.toLocaleDateString()
                ) : (
                  <span className="text-red-400">Never</span>
                )}
              </p>
            </div>
          </div>

          {/* Status Dropdown (Outside the clickable navigation area) */}
          <div className="border-t border-gray-100 pt-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Alterar status
            </label>
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              {SONG_STATUSES.map((songStatus) => (
                <option key={songStatus} value={songStatus}>
                  {songStatus}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongElement;
