import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GoBackbutton from "../components/GoBackButton/GoBackButton";
import Song from "../dummie_data/Song";
import { SONGS } from "../dummie_data/songs";

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-sm transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900";

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

  // 1. Extract initial data and edit status FIRST
  const initialData = location.state;
  const isEditing = Boolean(initialData);

  // 2. Initialize state safely using passed data or defaults
  const [song, setSong] = useState(initialData || DEFAULT_SONG);

  const updateSong = (event) => {
    const { name, value, type, checked } = event.target;
    setSong((currentSong) => ({
      ...currentSong,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3. Single consolidated submit handler
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!song.artist || !song.bpm || !song.name || !song.howLong) {
      alert("Preencha todos os campos");
      return;
    }

    if (isEditing) {
      const songIndex = SONGS.findIndex(
        (s) => s.name === initialData.name && s.artist === initialData.artist,
      );

      const updatedSong = new Song(
        song.name.trim(),
        song.artist.trim(),
        song.tune.trim(),
        initialData.lastPlayed,
        song.status,
        song.hasAcousticGuitar,
        Number(song.bpm),
        Number(song.star),
        song.pedal.trim(),
        song.obs.trim(),
        song.howLong,
        initialData.howManyTimesHasBeingPlayed,
      );

      if (songIndex !== -1) {
        SONGS[songIndex] = updatedSong;
      } else {
        SONGS.push(updatedSong);
      }
    } else {
      SONGS.push(
        new Song(
          song.name.trim(),
          song.artist.trim(),
          song.tune.trim(),
          null,
          song.status,
          song.hasAcousticGuitar,
          Number(song.bpm),
          Number(song.star),
          song.pedal.trim(),
          song.obs.trim(),
          song.howLong,
          0,
        ),
      );
    }

    navigate("/set-list");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <GoBackbutton />

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {isEditing ? `Alterar ${initialData.name}` : "Adicionar música"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {isEditing
                ? "Edite os detalhes da música selecionada."
                : "Preencha os detalhes para incluir uma nova música no set list."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nome da música
                <input
                  className={inputClass}
                  name="name"
                  value={song.name}
                  onChange={updateSong}
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700">
                Artista
                <input
                  className={inputClass}
                  name="artist"
                  value={song.artist}
                  onChange={updateSong}
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700">
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

              <label className="block text-sm font-semibold text-gray-700">
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

              <label className="block text-sm font-semibold text-gray-700">
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

              <label className="block text-sm font-semibold text-gray-700">
                Duração
                <input
                  className={inputClass}
                  name="howLong"
                  type="time"
                  value={song.howLong}
                  onChange={updateSong}
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700">
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

              <label className="block text-sm font-semibold text-gray-700">
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

            <label className="block text-sm font-semibold text-gray-700">
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

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
              <input
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                name="hasAcousticGuitar"
                type="checkbox"
                checked={song.hasAcousticGuitar}
                onChange={updateSong}
              />
              Usa violão
            </label>

            <div className="border-t border-gray-100 pt-6">
              <button
                type="submit"
                className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                {isEditing ? "Salvar alterações" : "Adicionar ao set list"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSongScreen;
