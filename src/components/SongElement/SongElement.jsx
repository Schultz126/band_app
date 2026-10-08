import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SONG_STATUSES = ["ok", "ensaiar", "tirar"];
const STATUS_CLASSES = {
  ok: "border-emerald-800 bg-emerald-950/50 text-emerald-300",
  ensaiar: "border-amber-800 bg-amber-950/50 text-amber-300",
  tirar: "border-red-900 bg-red-950/50 text-red-300",
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
    onStatusChange,
    onRemove, // <-- New prop for deleting
  } = props;

  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  /*const totalSeconds = rehearsalSongs.reduce((total, song) => {
    const [minutes, seconds] = song.howLong.split(":").map(Number);
    return total + minutes * 60 + seconds;
  }, 0);

  const totalLength = [
    Math.floor(totalSeconds / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");*/

  const [hours, minutes, seconds] = howLong.split(":");
  const correctedLength = `${hours}:${minutes}`;

  return (
    <div className="song-card transition hover:border-[#5a554d] hover:shadow-md">
      {/* Header (Expand/Retract Toggle) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-semibold tracking-wide text-[#f4f0e9]">{name}</span>
        <span className="flex items-center gap-3">
          <span
            className={`min-w-14 rounded border px-2 py-1 text-center text-xs font-semibold ${STATUS_CLASSES[status]}`}
          >
            {status}
          </span>
          <span className="text-[#938d84]" aria-hidden="true">
            {isExpanded ? "▴" : "▾"}
          </span>
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[#3a3732] p-4">
          {/* Clickable Area for Navigation */}
          <div
            className="cursor-pointer mb-4 hover:opacity-80 transition-opacity"
            onClick={() => {
              // 1. Separa as funções dos dados. Estava dando problema pq o app tentava ler funções como dados
              const { onStatusChange, onRemove, ...songData } = props;
              // 2. Manda apenas os dados
              navigate("/set-list/edit-song", { state: songData }); // state: é necessário para enviar os dados específicos deste componente para a tela de edição
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="band-muted text-sm font-medium">{artist}</p>
              </div>
              <div className="flex items-center rounded-full border border-amber-800 bg-amber-950/50 px-2 py-1 text-xs font-bold text-amber-300">
                ⭐ {star}
              </div>
            </div>

            {hasAcousticGuitar && (
              <div className="mb-4">
                <span className="rounded border border-amber-800 bg-amber-950/50 px-2 py-1 text-xs font-semibold text-amber-300">
                  Acoustic Guitar
                </span>
              </div>
            )}

            <div className="mb-4 grid grid-cols-2 gap-3 rounded-md border border-[#34312d] bg-black/20 p-3 text-sm sm:grid-cols-4">
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#938d84]">
                  Tune
                </span>
                <span className="font-semibold text-[#e5ded4]">{tune}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#938d84]">
                  BPM
                </span>
                <span className="font-semibold text-[#e5ded4]">{bpm}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#938d84]">
                  Length
                </span>
                <span className="font-semibold text-[#e5ded4]">
                  {correctedLength}
                </span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#938d84]">
                  Plays
                </span>
                <span className="font-semibold text-[#e5ded4]">
                  {howManyTimesHasBeingPlayed}
                </span>
              </div>
            </div>

            <div className="band-muted space-y-1 text-sm">
              <p>
                <span className="font-semibold text-[#e5ded4]">Pedal:</span>{" "}
                {pedal}
              </p>
              <p>
                <span className="font-semibold text-[#e5ded4]">Obs: </span>{" "}
                {obs ? obs : "Nenhuma"}
              </p>
              <p className="mt-3 text-right text-xs text-[#777168]">
                Last Played:{" "}
                {lastPlayed ? (
                  // lastPlayed comes back from Supabase as an ISO string, not
                  // a Date object, so it has to go through `new Date(...)`
                  // before .toLocaleDateString() can be called on it.
                  new Date(lastPlayed).toLocaleDateString()
                ) : (
                  <span className="text-red-400">Never</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#3a3732] pt-3 sm:flex-row sm:items-end sm:justify-between">
            {/* Status Dropdown */}
            <div className="flex-1">
              <label className="mb-1 block text-sm font-semibold text-[#d8d1c7]">
                Alterar status
              </label>
              <select
                value={status}
                onChange={(event) =>
                  onStatusChange && onStatusChange(event.target.value)
                }
                className="band-input sm:w-48"
              >
                {SONG_STATUSES.map((songStatus) => (
                  <option key={songStatus} value={songStatus}>
                    {songStatus}
                  </option>
                ))}
              </select>
            </div>

            {/* Remove Button */}
            {onRemove && (
              <button
                onClick={onRemove}
                className="rounded-md border border-red-900 bg-red-950/50 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-950"
              >
                Remover do Ensaio
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongElement;
