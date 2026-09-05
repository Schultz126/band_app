export const SongElement = ({
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
}) => {
  const greenClass =
    "bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded border border-green-200";

  const yellowClass =
    "bg-yellow-50 text-yellow-700 text-xs font-semibold px-2 py-1 rounded border border-yellow-200";

  const redClass =
    "bg-red-50 text-red-700 text-xs font-semibold px-2 py-1 rounded border border-red-200";

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-5 mb-4 border border-gray-200">
      {/* Header: Title, Artist, and Stars */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500 font-medium">{artist}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
          ⭐ {star}
        </div>
      </div>

      {/* Badges: Status & Acoustic Guitar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={
            status === "ok"
              ? greenClass
              : status === "ensaiar"
                ? yellowClass
                : redClass
          }
        >
          Status: {status}
        </span>
        <br />
        {hasAcousticGuitar && (
          <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-1 rounded border border-amber-200">
            Acoustic Guitar
          </span>
        )}
      </div>

      {/* Grid: Quick Stats */}
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

      {/* Footer: Notes & Dates */}
      <div className="text-sm text-gray-600 space-y-1 border-t border-gray-100 pt-3">
        <p>
          <span className="font-semibold text-gray-800">Pedal:</span> {pedal}
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
  );
};

export default SongElement;
