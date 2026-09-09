import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ENSAIO from "../dummie_data/Ensaio/ensaio";
import { SONGS } from "../dummie_data/songs";
import SongElement from "../components/SongElement/SongElement";
import GoBackbutton from "../components/GoBackButton/GoBackButton";
import GeneralButton from "../components/GeneralButton/GeneralButton";

const RehearsalScreen = () => {
  // Use state to force re-renders when mutating ENSAIO
  const [rehearsalSongs, setRehearsalSongs] = useState([...ENSAIO]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal para adicionar novas músicas
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); // Modal para confirmar finalização do ensaio
  const navigate = useNavigate();

  // Calculate dynamic time based on state, not directly from ENSAIO
  const totalSeconds = rehearsalSongs.reduce((total, song) => {
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

  // --- Actions ---
  const handleRemoveSong = (indexToRemove) => {
    // Mutate the original imported array
    ENSAIO.splice(indexToRemove, 1);
    // Update local state
    setRehearsalSongs([...ENSAIO]);
  };

  const handleAddSong = (song) => {
    ENSAIO.push(song);
    setRehearsalSongs([...ENSAIO]);
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (index, newStatus) => {
    ENSAIO[index].status = newStatus;

    // Also update main SONGS array if required
    const mainSong = SONGS.find((s) => s.name === ENSAIO[index].name);
    if (mainSong) mainSong.status = newStatus;

    setRehearsalSongs([...ENSAIO]);
  };

  // Find songs from main library that are not in the current rehearsal
  const availableSongs = SONGS.filter(
    (mainSong) => !rehearsalSongs.some((rSong) => rSong.name === mainSong.name),
  );

  // Deverá ser modificada para salvar as alterações no banco de dados
  const finishRehearsal = () => {
    ENSAIO.forEach((song) => {
      if (song.setNewDate) song.setNewDate();
      if (song.updateTimesPlayed) song.updateTimesPlayed();
    });

    ENSAIO.splice(0, ENSAIO.length); // Clears the ENSAIO array
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <GoBackbutton />

        <div className="flex items-center justify-between mb-8 mt-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Setlist do ensaio
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            + Adicionar Música
          </button>
        </div>

        {rehearsalSongs.length === 0 ? (
          <p className="text-gray-500">
            Nenhum ensaio foi agendado ou todas as músicas foram removidas.
          </p>
        ) : (
          <>
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {rehearsalSongs.map((item, index) => (
                <li key={`${item.name}-${index}`} className="list-none">
                  <SongElement
                    {...item}
                    onStatusChange={(status) =>
                      handleStatusChange(index, status)
                    }
                    onRemove={() => handleRemoveSong(index)}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg font-semibold text-gray-800">
              Duração total: {totalLength}
            </p>
            <div className="mt-6">
              <GeneralButton
                text={"Finalizar ensaio"}
                onClick={() => setConfirmModalOpen(true)} // changed this to open the modal
              />
            </div>
          </>
        )}
      </div>

      {/* Modal for adding new songs */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-900">
                Adicionar ao Ensaio
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-900 font-bold p-2"
              >
                ✕
              </button>
            </div>

            <div className="p-2 overflow-y-auto flex-1">
              {availableSongs.length === 0 ? (
                <p className="p-4 text-center text-gray-500">
                  Todas as músicas já estão no ensaio!
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {availableSongs.map((song, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 transition rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {song.name}
                        </p>
                        <p className="text-sm text-gray-500">{song.artist}</p>
                      </div>
                      <button
                        onClick={() => handleAddSong(song)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        Adicionar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for confirming rehearsal completion */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm flex flex-col p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Finalizar ensaio?
            </h2>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja finalizar este ensaio? Isso registrará a
              data de hoje para todas as músicas da lista.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              {/* Essa confrimação será usada para reescrever a tabela de ensaio no servidor */}
              <button
                onClick={finishRehearsal}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RehearsalScreen;
