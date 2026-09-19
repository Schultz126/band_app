import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const EnsaioContext = createContext(null);

// There's at most one rehearsal "in progress" at a time: the current ensaio
// is whichever Ensaio row has isDone = false. If none exists, ensaio is
// null and the screen should render its empty state.
export const EnsaioProvider = ({ children }) => {
  const [ensaio, setEnsaio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ensaio")
      .select("*")
      .eq("isDone", false)
      .order("date", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to load ensaio:", error);
      setError(error);
      setEnsaio(null);
    } else {
      setEnsaio(data); // null when there's no open rehearsal
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const finishEnsaio = async () => {
    if (!ensaio) return { error: new Error("No active ensaio") };

    const { error } = await supabase
      .from("ensaio")
      .update({ isDone: true })
      .eq("id", ensaio.id);

    if (error) {
      console.error("Failed to finish ensaio:", error);
      return { error };
    }

    await reload(); // ensaio becomes null again, unless another is open
    return { error: null };
  };

  return (
    <EnsaioContext.Provider
      value={{ ensaio, loading, error, reload, finishEnsaio }}
    >
      {children}
    </EnsaioContext.Provider>
  );
};

export const useEnsaio = () => {
  const context = useContext(EnsaioContext);
  if (!context) {
    throw new Error("useEnsaio must be used within an EnsaioProvider");
  }
  return context;
};
