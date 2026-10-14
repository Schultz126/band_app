import SongElement from "../components/SongElement/SongElement";
import { useEffect, useState } from "react";
import AddSongButton from "../components/AddSongButton/AddSongButton";
import GoBackbutton from "../components/GoBackButton/GoBackButton";
import { useSetList } from "../context/SetListContext";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const compareSongsAlphabetically = (a, b) =>
  (a.name ?? "").localeCompare(b.name ?? "", "pt-BR", {
    sensitivity: "base",
  });

const compareSongsByStatus = (a, b) => {
  const statusA = (a.status ?? "").toLowerCase();
  const statusB = (b.status ?? "").toLowerCase();
  return statusA.localeCompare(statusB, "pt-BR");
};

const compareByTimesPlayed = (a, b) => {
  const timesA = a.howManyTimesHasBeingPlayed;
  const timesB = b.howManyTimesHasBeingPlayed;
  return timesB - timesA;
};

const SetListScreen = () => {
  const [pendingStatusById, setPendingStatusById] = useState({});
  const [displayedSongs, setDisplayedSongs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedSort, setSelectedSort] = useState("pad");
  const { songs, loading, reload } = useSetList();

  useEffect(() => {
    switch (selectedSort) {
      case "pad":
        setDisplayedSongs(songs);
        break;
      case "a-z":
        setDisplayedSongs(() => [...songs].sort(compareSongsAlphabetically));
        break;
      case "status":
        setDisplayedSongs(() => [...songs].sort(compareSongsByStatus));
        break;
      case "times":
        setDisplayedSongs(() => [...songs].sort(compareByTimesPlayed));
        break;
    }
  }, [songs, selectedSort]);

  const updatePendingStatus = (song, status) => {
    setPendingStatusById((currentStatuses) => {
      if (status === song.status) {
        const { [song.id]: _, ...remainingStatuses } = currentStatuses;
        return remainingStatuses;
      }
      return { ...currentStatuses, [song.id]: status };
    });
  };

  const confirmStatusChanges = async () => {
    setSaving(true);

    const entries = Object.entries(pendingStatusById);

    const results = await Promise.all(
      entries.map(
        ([songId, status]) =>
          supabase
            .from("set_list")
            .update({ status }) // Escrevendo {status} eu seleciono qual coluna deve ser atualizada. Nenhuma outra coluna é alterada
            .eq("id", songId), // .eq determina qual música será atualizada.
      ),
    );

    const failed = results.filter((r) => r.error);
    if (failed.length > 0) {
      console.error("Failed to update some songs:", failed);
      alert("Algumas alterações não puderam ser salvas. Tente novamente.");
    }

    setSaving(false);
    setPendingStatusById({});
    await reload(); // refetch from Supabase so local state matches DB
  };

  const pendingChanges = Object.keys(pendingStatusById).length;

  if (loading) {
    return (
      <div>
        <p>Carregando músicas</p>
      </div>
    );
  }
  const handleSelectSortMethod = (event) => {
    setSelectedSort(event.target.value);
  };

  return (
    <div className="app-shell px-4 pb-10 pt-64 sm:px-6 sm:pt-56 lg:px-8">
      <div className="fixed inset-x-0 top-0 z-10 border-b border-[#3a3732] bg-[#0a0a0a]/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-3 flex justify-between">
            <GoBackbutton />
            <AddSongButton />
          </header>

          <div className="mb-3 flex items-center justify-between">
            <h1 className="band-title text-3xl">No Tones Set List</h1>
            <span className="rounded-full border border-[#4b4741] bg-[#1c1b19] px-3 py-1 text-sm font-semibold text-[#f4f0e9] shadow-sm">
              {songs.length} Songs
            </span>
          </div>

          <div className="band-panel rounded-md p-3 sm:flex sm:items-center sm:justify-between">
            <p className="band-muted mb-3 text-sm sm:mb-0">
              {pendingChanges === 0
                ? "Selecione uma música para ver os detalhes e alterar seu status."
                : `${pendingChanges} ${pendingChanges === 1 ? "alteração" : "alterações"} aguardando confirmação.`}
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <div className="relative">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-2 top-1/2 z-10 size-5 -translate-y-1/2 text-[#f4f0e9]"
                >
                  <path
                    d="M3.5 5h17l-6.5 7.2v5l-4 2v-7L3.5 5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <select
                  className="band-input band-select w-16 cursor-pointer text-transparent"
                  value={selectedSort}
                  onChange={handleSelectSortMethod}
                  aria-label="Filtrar e ordenar músicas"
                  title="Filtrar e ordenar músicas"
                >
                  <option value="pad">Padrão</option>
                  <option value="a-z">A-Z</option>
                  <option value="status">Status</option>
                  <option value="times">Frequência</option>
                </select>
              </div>
              <button
                type="button"
                onClick={confirmStatusChanges}
                disabled={pendingChanges === 0 || saving}
                className="band-button w-full px-4 py-2 text-sm sm:w-auto"
              >
                {saving
                  ? "Salvando..."
                  : `Confirmar alterações${pendingChanges > 0 ? ` (${pendingChanges})` : ""}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <ul className="space-y-3">
          {displayedSongs.map((item, index) => {
            const status = pendingStatusById[item.id] ?? item.status;

            return (
              <li key={item.id ?? index} className="list-none">
                <SongElement
                  {...item}
                  status={status}
                  onStatusChange={(newStatus) =>
                    updatePendingStatus(item, newStatus)
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
