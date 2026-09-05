import ENSAIO from "../../dummie_data/Ensaio/ensaio";
import { SONGS } from "../../dummie_data/songs";
import GeneralButton from "../GeneralButton/GeneralButton";

import { useNavigate } from "react-router-dom";

const durationInSeconds = (duration) => {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
};

const timeInSeconds = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 * 60 + minutes * 60;
};

const oldestPlayedFirst = (a, b) => {
  if (a.lastPlayed === null) return b.lastPlayed === null ? 0 : -1;
  if (b.lastPlayed === null) return 1;
  return a.lastPlayed - b.lastPlayed;
};

export const setEnsaio = ({ time, songs }) => {
  const songLimit = Number(songs);
  const availableSeconds = timeInSeconds(time);
  const minimumOkSongs = Math.ceil(songLimit / 2);
  let usedSeconds = 0;
  const selectedSongs = [];

  const selectSongsThatFit = (candidates, limit) => {
    for (const song of candidates) {
      if (selectedSongs.length === limit) break;

      const songSeconds = durationInSeconds(song.howLong);
      if (usedSeconds + songSeconds <= availableSeconds) {
        selectedSongs.push(song);
        usedSeconds += songSeconds;
      }
    }
  };

  // "tirar" songs are excluded. Within each status group, songs never played
  // (or played least recently) are selected first.
  const songsByStatus = {
    ok: SONGS.filter((song) => song.status === "ok").sort(oldestPlayedFirst),
    ensaiar: SONGS.filter((song) => song.status === "ensaiar").sort(
      oldestPlayedFirst,
    ),
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

  // Mutate the existing array instead of reassigning it, so imports of ENSAIO
  // keep pointing to the selected rehearsal songs.
  ENSAIO.splice(0, ENSAIO.length, ...selectedSongs);

  return ENSAIO;
};

const SubmitSettingsButton = ({ time, songs }) => {
  const navigate = useNavigate();

  const handleStartRehearsal = () => {
    // Verifica se os campos estão em branco
    if (!time || !songs) {
      alert(
        "Por favor, preencha o tempo disponível e a quantidade de músicas para prosseguir.",
      );
      return; // Interrompe a execução
    }

    setEnsaio({ time, songs });

    navigate(-1);
  };

  return <GeneralButton onClick={handleStartRehearsal} text={"Agendar"} />;
};

export default SubmitSettingsButton;
