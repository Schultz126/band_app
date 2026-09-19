import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createClient } from "@supabase/supabase-js";
import { useEnsaio } from "./RehearsalContext";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const MusicasDoEnsaioContext = createContext(null);

// Must be rendered inside an EnsaioProvider — it reads the current ensaio's
// id from there so it knows which join rows to fetch. If there's no open
// ensaio, songs stays an empty list.
//
// Note: Musicas_do_Ensaio has no separate `id` column — its primary key is
// the (musica_id, ensaio_id) pair. musica_id is the song's own set_list id,
// so once songs are joined in, a song's own `id` already doubles as its
// musica_id — no extra field needed to identify or remove a row.
export const MusicasDoEnsaioProvider = ({ children }) => {
  const { ensaio } = useEnsaio();
  const ensaioId = ensaio?.id; // Conexão com a propiedade id de uma forma segura

  const [rows, setRows] = useState([]); // join rows, each with a nested set_list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!ensaioId) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("musicas_do_ensaio")
      .select("musica_id, ensaio_id, set_list(*)")
      .eq("ensaio_id", ensaioId);

    if (error) {
      console.error("Failed to load musicas do ensaio:", error);
      setError(error);
    } else {
      setRows(data);
      setError(null);
    }
    setLoading(false);
  }, [ensaioId]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Flatten into plain song objects from set_list. song.id === musica_id,
  // so that's all that's needed to remove a row later.
  const songs = rows
    .filter((row) => row.set_list)
    .map((row) => ({ ...row.set_list }));

  const addSong = async (musicaId) => {
    if (!ensaioId) return { error: new Error("No active ensaio") };

    const { error } = await supabase
      .from("musicas_do_ensaio")
      .insert({ musica_id: musicaId, ensaio_id: ensaioId });

    if (error) {
      console.error("Failed to add song to ensaio:", error);
      return { error };
    }

    await reload();
    return { error: null };
  };

  const removeSong = async (musicaId) => {
    if (!ensaioId) return { error: new Error("No active ensaio") };

    const { error } = await supabase
      .from("musicas_do_ensaio")
      .delete()
      .eq("musica_id", musicaId)
      .eq("ensaio_id", ensaioId);

    if (error) {
      console.error("Failed to remove song from ensaio:", error);
      return { error };
    }

    await reload();
    return { error: null };
  };

  return (
    <MusicasDoEnsaioContext.Provider
      value={{ songs, loading, error, reload, addSong, removeSong }}
    >
      {children}
    </MusicasDoEnsaioContext.Provider>
  );
};

export const useMusicasDoEnsaio = () => {
  const context = useContext(MusicasDoEnsaioContext);
  if (!context) {
    throw new Error(
      "useMusicasDoEnsaio must be used within a MusicasDoEnsaioProvider",
    );
  }
  return context;
};
