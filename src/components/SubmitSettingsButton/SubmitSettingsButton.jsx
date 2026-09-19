import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import GeneralButton from "../GeneralButton/GeneralButton";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const durationInSeconds = (duration) => {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
};

const timeInSeconds = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 * 60 + minutes * 60;
};

// lastPlayed now comes back from Supabase as a timestamp string (or null for
// a song that's never been rehearsed), so it has to go through Date instead
// of being subtracted directly like it was with the dummy data.
const oldestPlayedFirst = (a, b) => {
  if (a.lastPlayed === null) return b.lastPlayed === null ? 0 : -1;
  if (b.lastPlayed === null) return 1;
  return new Date(a.lastPlayed) - new Date(b.lastPlayed);
};

// Picks which songs go into a new rehearsal, then persists it: creates the
// Ensaio row (with its date) and links the selected songs to it via
// Musicas_do_Ensaio. Returns { ensaio, error }.
export const setEnsaio = async ({ time, songs, date }) => {
  const songLimit = Number(songs);
  const availableSeconds = timeInSeconds(time);
  const minimumOkSongs = Math.ceil(songLimit / 2);
  let usedSeconds = 0;
  const selectedSongs = [];

  const selectSongsThatFit = (candidates, limit) => {
    for (const song of candidates) {
      if (selectedSongs.length === limit) break;
      if (selectedSongs.includes(song)) continue;

      const songSeconds = durationInSeconds(song.howLong);
      if (usedSeconds + songSeconds <= availableSeconds) {
        selectedSongs.push(song);
        usedSeconds += songSeconds;
      }
    }
  };

  const { data: candidateSongs, error: fetchError } = await supabase
    .from("set_list")
    .select("*")
    .in("status", ["ok", "ensaiar"]);

  if (fetchError) {
    console.error("Failed to load songs for rehearsal:", fetchError);
    return { ensaio: null, error: fetchError };
  }

  // "tirar" songs are excluded (already filtered by the query above). Within
  // each status group, songs never played (or played least recently) are
  // selected first.
  const songsByStatus = {
    ok: candidateSongs
      .filter((song) => song.status === "ok")
      .sort(oldestPlayedFirst),
    ensaiar: candidateSongs
      .filter((song) => song.status === "ensaiar")
      .sort(oldestPlayedFirst),
  };

  // Reserve at least half of the requested setlist for ready-to-play songs.
  selectSongsThatFit(songsByStatus.ok, minimumOkSongs);

  // Prioritize songs that need rehearsal, then use additional "ok" songs if
  // there is still room in the requested count and time budget.
  selectSongsThatFit(
    [
      ...songsByStatus.ensaiar,
      ...songsByStatus.ok.filter((song) => !selectedSongs.includes(song)),
    ],
    songLimit,
  );

  // Create the Ensaio row first so there's an id to attach songs to.
  const { data: newEnsaio, error: ensaioError } = await supabase
    .from("ensaio")
    .insert({ date, isDone: false })
    .select()
    .single();

  if (ensaioError) {
    console.error("Failed to create ensaio:", ensaioError);
    return { ensaio: null, error: ensaioError };
  }

  if (selectedSongs.length > 0) {
    const { error: linkError } = await supabase
      .from("musicas_do_ensaio")
      .insert(
        selectedSongs.map((song) => ({
          musica_id: song.id,
          ensaio_id: newEnsaio.id,
        })),
      );

    if (linkError) {
      console.error("Failed to link songs to ensaio:", linkError);
      return { ensaio: null, error: linkError };
    }
  }

  return { ensaio: newEnsaio, error: null };
};

const SubmitSettingsButton = ({ time, songs, date }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleStartRehearsal = async () => {
    if (submitting) return;

    // Verifica se os campos estão em branco
    if (!time || !songs || !date) {
      alert(
        "Por favor, preencha o tempo disponível, a quantidade de músicas e a data para prosseguir.",
      );
      return; // Interrompe a execução
    }

    setSubmitting(true);
    const { ensaio, error } = await setEnsaio({ time, songs, date });
    setSubmitting(false);

    if (error) {
      alert("Erro ao agendar o ensaio. Tente novamente.");
      return;
    }

    navigate(-1);
  };

  return (
    <GeneralButton
      onClick={handleStartRehearsal}
      text={submitting ? "Agendando..." : "Agendar"}
    />
  );
};

export default SubmitSettingsButton;
