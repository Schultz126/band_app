import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useEnsaio } from "../context/RehearsalContext";
import { useMusicasDoEnsaio } from "../context/MusicaDoEnsaioContext";
import { useSetList } from "../context/SetListContext";
import SongElement from "../components/SongElement/SongElement";
import GoBackbutton from "../components/GoBackButton/GoBackButton";
import GeneralButton from "../components/GeneralButton/GeneralButton";
import { generateSetlistPdf } from "../utils/generateSetlistPdf";
import { CiShare2 } from "react-icons/ci";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// ensaio.date comes back as a timestamptz string (e.g. "2026-09-19T00:00:00+00:00").
// timeZone: "UTC" keeps the displayed day from shifting backward for anyone
// west of UTC, since the time portion is always midnight UTC.
const formatEnsaioDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
};

const RehearsalScreen = () => {
  const { ensaio, finishEnsaio, reload: reloadEnsaio } = useEnsaio();
  const {
    songs: rehearsalSongs,
    addSong,
    removeSong,
    reload: reloadMusicasDoEnsaio,
  } = useMusicasDoEnsaio();
  const { songs: allSongs } = useSetList();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal para adicionar novas músicas
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); // Modal para confirmar finalização do ensaio
  const [finishing, setFinishing] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [sharing, setSharing] = useState(false);
  const navigate = useNavigate();

  // EnsaioProvider lives at the app root and only fetches once on that
  // initial mount, so if a rehearsal was just scheduled and we navigated
  // straight here, its `ensaio` can be stale. Refresh it every time this
  // screen mounts — MusicasDoEnsaioProvider reacts to ensaio?.id changing,
  // so the songs will follow automatically once this resolves.
  useEffect(() => {
    reloadEnsaio();
  }, [reloadEnsaio]);

  const thereIsEnsaio = Boolean(ensaio);

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
  // musica_id (the join table's FK to set_list) is the same value as the
  // song's own id, so we can pass item.id straight through.
  const handleRemoveSong = async (musicaId) => {
    const { error } = await removeSong(musicaId);
    if (error) alert("Erro ao remover música do ensaio. Tente novamente.");
  };

  const handleAddSong = async (song) => {
    const { error } = await addSong(song.id);
    if (error) {
      alert("Erro ao adicionar música ao ensaio. Tente novamente.");
      return;
    }
    setIsAddModalOpen(false);
  };

  // status lives on set_list itself (shared across the whole app, not
  // just this rehearsal), so it's updated there directly.
  const handleStatusChange = async (songId, newStatus) => {
    const { error } = await supabase
      .from("set_list")
      .update({ status: newStatus })
      .eq("id", songId);

    if (error) {
      console.error("Failed to update song status:", error);
      alert("Erro ao atualizar status da música.");
      return;
    }

    await reloadMusicasDoEnsaio();
  };

  // Songs from the main library that aren't already in this rehearsal
  const availableSongs = allSongs.filter(
    (mainSong) => !rehearsalSongs.some((rSong) => rSong.id === mainSong.id),
  );

  const finishRehearsal = async () => {
    setFinishing(true);

    // Record that today's rehearsal covered these songs
    const today = new Date().toISOString();
    const updates = rehearsalSongs.map((song) =>
      supabase
        .from("set_list")
        .update({
          lastPlayed: today,
          howManyTimesHasBeingPlayed:
            (song.howManyTimesHasBeingPlayed || 0) + 1,
        })
        .eq("id", song.id),
    );

    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);

    if (failed) {
      console.error("Failed to update songs after rehearsal:", failed.error);
      setFinishing(false);
      alert("Erro ao registrar as músicas do ensaio. Tente novamente.");
      return;
    }

    const { error } = await finishEnsaio();
    setFinishing(false);

    if (error) {
      alert("Erro ao finalizar o ensaio. Tente novamente.");
      return;
    }

    navigate(-1);
  };

  // Função para deletar o ensaio (Musicas_do_Ensaio primeiro, depois Ensaio)
  const cancelRehearsal = async () => {
    if (!ensaio) return;

    setCancelling(true);

    const { error: songsError } = await supabase
      .from("musicas_do_ensaio")
      .delete()
      .eq("ensaio_id", ensaio.id);

    if (songsError) {
      console.error("Failed to delete musicas_do_ensaio rows:", songsError);
      setCancelling(false);
      alert("Erro ao cancelar o ensaio. Tente novamente.");
      return;
    }

    const { error: ensaioError } = await supabase
      .from("ensaio")
      .delete()
      .eq("id", ensaio.id);

    setCancelling(false);

    if (ensaioError) {
      console.error("Failed to delete ensaio row:", ensaioError);
      alert("Erro ao cancelar o ensaio. Tente novamente.");
      return;
    }

    navigate(-1);
  };

  // Generates the setlist PDF, then opens the phone's native share sheet
  // (WhatsApp shows up there like any other app). Falls back to a plain
  // download on browsers that don't support sharing files (mostly desktop).
  const handleShareSetlist = async () => {
    setSharing(true);

    try {
      const file = generateSetlistPdf(ensaio, rehearsalSongs);

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Set List do Ensaio",
            text: "Set list do ensaio",
          });
        } catch (shareError) {
          // AbortError just means the user closed the share sheet — not a real failure
          if (shareError.name !== "AbortError") {
            console.error("Failed to share setlist:", shareError);
            alert("Não foi possível compartilhar o PDF.");
          }
        }
      } else {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to generate setlist PDF:", error);
      alert("Não foi possível gerar o PDF.");
    }

    setSharing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between">
          <GoBackbutton />
          <button onClick={handleShareSetlist}>
            <CiShare2 className="size-5 mb-2 hover:text-black" />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-8 mt-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
            {`Set-list do ensaio do dia ${formatEnsaioDate(ensaio?.date)}`}
          </h1>
          {thereIsEnsaio ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800 sm:w-auto"
              >
                + Adicionar Música
              </button>
              <button
                onClick={() => setCancelModalOpen(true)}
                className="w-full rounded-lg bg-red-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 sm:w-auto sm:ml-2"
              >
                Cancelar Ensaio
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>

        {rehearsalSongs.length === 0 ? (
          <p className="text-gray-500">
            Nenhum ensaio foi agendado ou todas as músicas foram removidas.
          </p>
        ) : (
          <>
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {rehearsalSongs.map((item) => (
                <li key={item.id} className="list-none">
                  <SongElement
                    {...item}
                    onStatusChange={(status) =>
                      handleStatusChange(item.id, status)
                    }
                    onRemove={() => handleRemoveSong(item.id)}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg font-semibold text-gray-800">
              Duração total: {totalLength}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <GeneralButton
                text={"Finalizar ensaio"}
                onClick={() => setConfirmModalOpen(true)}
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
                  {availableSongs.map((song) => (
                    <li
                      key={song.id}
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
                disabled={finishing}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={finishRehearsal}
                disabled={finishing}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 transition disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {finishing ? "Finalizando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for confirming ensaio cancellation */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm flex flex-col p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Cancelar ensaio?
            </h2>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja cancelar este ensaio? Essa ação não pode
              ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                disabled={cancelling}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={cancelRehearsal}
                disabled={cancelling}
                className="rounded-lg bg-red-900 px-4 py-2 text-sm font-bold text-white hover:bg-red-800 transition disabled:cursor-not-allowed disabled:bg-red-400"
              >
                {cancelling ? "Cancelando..." : "Cancelar Ensaio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RehearsalScreen;
