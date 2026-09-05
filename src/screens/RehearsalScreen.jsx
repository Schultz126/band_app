import ENSAIO from "../dummie_data/Ensaio/ensaio";
import SongElement from "../components/SongElement/SongElement";
import FinishButton from "../components/FinishButton/FinishButton";

const RehearsalScreen = () => {
  const totalSeconds = ENSAIO.reduce((total, song) => {
    const [minutes, seconds] = song.howLong.split(":").map(Number);
    return total + minutes * 60 + seconds;
  }, 0);
  const totalLength = [
    Math.floor(totalSeconds / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">
          Setlist do ensaio
        </h1>

        {ENSAIO.length === 0 ? (
          <p>Nenhum ensaio foi agendado</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ENSAIO.map((item) => (
                <li key={`${item.name}-${item.artist}`} className="list-none">
                  <SongElement {...item} />
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg font-semibold text-gray-800">
              Duração total: {totalLength}
            </p>
            <FinishButton />
          </>
        )}
      </div>
    </div>
  );
};

export default RehearsalScreen;
