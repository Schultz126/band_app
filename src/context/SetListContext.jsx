// src/context/SetListContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Song from "../dummie_data/Song";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const SetListContext = createContext(null);

export const SetListProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSetList = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("set_list").select("*");
    console.log("raw data:", data); // add this

    if (error) {
      console.error("Failed to load instruments:", error);
      setError(error);
      setLoading(false);
      return;
    }

    const songInstances = data.map(
      (row) =>
        new Song(
          row.id,
          row.name,
          row.artist,
          row.tune,
          row.lastPlayed ? new Date(row.lastPlayed) : null, // Converting different types between js and supabase
          row.status,
          row.hasAcousticGuitar,
          row.bpm,
          row.star,
          row.pedal,
          row.obs,
          row.howLong,
          row.howManyTimesHasBeingPlayed,
        ),
    );

    setSongs(songInstances);
    setLoading(false);
  };

  useEffect(() => {
    loadSetList();
  }, []);

  return (
    <SetListContext.Provider
      value={{ songs, setSongs, loading, error, reload: loadSetList }}
    >
      {children}
    </SetListContext.Provider>
  );
};

export const useSetList = () => {
  const context = useContext(SetListContext);
  if (!context) {
    throw new Error("useSetList must be used within a SetListProvider");
  }
  return context;
};
