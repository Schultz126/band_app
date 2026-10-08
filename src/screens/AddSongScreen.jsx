import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GoBackbutton from "../components/GoBackButton/GoBackButton";
import { useSetList } from "../context/SetListContext";
import { createClient } from "@supabase/supabase-js";
import { BsTrash3 } from "react-icons/bs";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const inputClass =
  "band-input mt-1";

const DEFAULT_SONG = {
  name: "",
  artist: "",
  tune: "E",
  status: "tirar",
  hasAcousticGuitar: false,
  bpm: "",
  star: "3",
  pedal: "",
  obs: "",
  howLong: "",
};

const AddSongScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reload } = useSetList();

  const initialData = location.state;
  const isEditing = Boolean(initialData);

  const [song, setSong] = useState(initialData || DEFAULT_SONG);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateSong = (event) => {
    const { name, value, type, checked } = event.target;
    setSong((currentSong) => ({
      ...currentSong,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!song.artist || !song.bpm || !song.name || !song.howLong) {
      alert("Preencha todos os campos");
      return;
    }

    setSaving(true);

    const payload = {
      name: song.name.trim(),
      artist: song.artist.trim(),
      tune: song.tune.trim(),
      status: song.status,
      hasAcousticGuitar: song.hasAcousticGuitar,
      bpm: Number(song.bpm),
      star: Number(song.star),
      pedal: song.pedal.trim(),
      obs: song.obs.trim(),
      howLong: song.howLong,
    };

    let error;

    if (isEditing) {
      // Only update fields the form edits; leave lastPlayed / howManyTimesHasBeingPlayed untouched
      ({ error } = await supabase
        .from("set_list")
        .update(payload)
        .eq("id", initialData.id));
    } else {
      ({ error } = await supabase.from("set_list").insert({
        ...payload,
        lastPlayed: null,
        howManyTimesHasBeingPlayed: 0,
      }));
    }

    setSaving(false);

    if (error) {
      console.error("Failed to save song:", error);
      alert("Erro ao salvar a música. Tente novamente.");
      return;
    }

    await reload(); // refresh the shared songs list from Supabase
    navigate(-1); // Por algum motivo que desconheço, usar navigate("/set-list") cria um monte de páginas na stack e faz vc voltar para páginas que podem não existir mais
  };

  // Opens the confirmation modal instead of deleting immediately
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  // Runs only after the user confirms inside the modal
  const confirmDelete = async () => {
    setDeleting(true);

    const { error } = await supabase
      .from("set_list")
      .delete()
      .eq("id", initialData.id);

    setDeleting(false);

    if (error) {
      console.error("Failed to delete song:", error);
      alert("Erro ao excluir a música. Tente novamente.");
      return;
    }

    setShowDeleteModal(false);
    await reload();
    navigate(-1);
  };

  return (
    <div className="app-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <GoBackbutton />

        <div className="band-panel mt-6 rounded-lg p-6 sm:p-8">
          <div className="mb-8">
            <div className="flex flex-row justify-between">
              <h1 className="band-title text-3xl">
                {isEditing ? `Alterar ${initialData.name}` : "Adicionar música"}
              </h1>
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-bold text-red-400 transition-colors hover:text-red-200"
                >
                  <BsTrash3 className="size-5" />
                </button>
              ) : (
                <></>
              )}
            </div>
            <p className="band-muted mt-2 text-sm">
              {isEditing
                ? "Edite os detalhes da música selecionada."
                : "Preencha os detalhes para incluir uma nova música no set list."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-[#d8d1c7]">
                Nome da música
                <input
                  className={inputClass}
                  name="name"
                  value={song.name}
                  onChange={updateSong}
                />
              </label>

              <label className="block text-sm font-semibold text-[#d8d1c7]">
                Artista
                <input
                  className={inputClass}
                  name="artist"
                  value={song.artist}
                  onChange={updateSong}
                />
              </label>

              <label className="block text-sm font-semibold text-[#d8d1c7]">
                Tom
                <select
                  className={inputClass}
                  name="tune"
                  value={song.tune}
                  onChange={updateSong}
                >
                  <option value="E">E</option>
                  <option value="D#">D#</option>
                  <option value="D">D</option>
                  <option value="C#">C</option>
                </select>
              </label>

              <label className="block text-sm font-semibold text-[#d8d1c7]">
                Status
                <select
                  className={inputClass}
                  name="status"
                  value={song.status}
                  onChange={updateSong}
                >
                  <option value="ok">ok</option>
                  <option value="ensaiar">ensaiar</option>
                  <option value="tirar">tirar</option>
                </select>
              </label>

              <label className="block text-sm font-semibold text-[#d8d1c7]">
                BPM
                <input
                  className={inputClass}
                  name="bpm"
                  type="number"
                  min="1"
                  value={song.bpm}
                  onChange={updateSong}
                />
              </label>

              <label className="block text-sm font-semibold text-[#d8d1c7]">
                Duração
                <input
                  className={inputClass}
                  name="howLong"
                  type="time"
                  value={song.howLong}
                  onChange={updateSong}
                />
              </label>

              <label className="block text-sm font-semibold text-[#d8d1c7]">
                Animação
                <select
                  className={inputClass}
                  name="star"
                  value={song.star}
                  onChange={updateSong}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-[#d8d1c7]">
                Pedal
                <input
                  className={inputClass}
                  name="pedal"
                  value={song.pedal}
                  onChange={updateSong}
                  placeholder="Ex: 1-2"
                />
              </label>
            </div>

            <label className="block text-sm font-semibold text-[#d8d1c7]">
              Observações
              <textarea
                className={inputClass}
                name="obs"
                value={song.obs}
                onChange={updateSong}
                rows="3"
                placeholder="Comentários sobre a música"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-[#3a3732] bg-black/20 px-4 py-3 text-sm font-semibold text-[#d8d1c7]">
              <input
                className="h-4 w-4 rounded border-[#5a554d] bg-[#151514] text-red-600 focus:ring-red-600"
                name="hasAcousticGuitar"
                type="checkbox"
                checked={song.hasAcousticGuitar}
                onChange={updateSong}
              />
              Usa violão
            </label>

            <div className="border-t border-[#3a3732] pt-6">
              <button
                type="submit"
                disabled={saving}
                className="band-button w-full px-4 py-3 text-sm"
              >
                {saving
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar alterações"
                    : "Adicionar ao set list"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
          <div
            className="band-panel w-full max-w-md rounded-lg p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="band-title text-xl">
              Excluir música?
            </h2>
            <p className="band-muted mt-2 text-sm">
              Tem certeza que deseja excluir{" "}
              <span className="font-semibold text-[#f4f0e9]">
                {initialData?.name}
              </span>
              ? Essa ação não pode ser desfeita.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md border border-[#5a554d] px-4 py-2 text-sm font-bold text-[#e5ded4] transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="rounded-md bg-red-800 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-950"
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSongScreen;
