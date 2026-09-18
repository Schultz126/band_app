import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import { createClient } from "@supabase/supabase-js";

/*const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);*/

const StartingScreen = () => {
  const navigate = useNavigate();

  /*useEffect(() => {
    const loadSetList = async () => {
      const { data, error } = await supabase.from("set_list").select("*");

      if (error) {
        console.error("Failed to load instruments:", error);
        return;
      }

      console.log(data);
    };

    loadSetList();
  }, []);*/

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-200">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-gray-500 mb-8 text-sm">No tones</p>

        {/* Button Container */}
        <div className="flex flex-col gap-4">
          <NavigationButton
            text="Set List"
            onClick={() => {
              navigate("/set-list");
            }}
          />
          <NavigationButton
            text="Agendar ensaio"
            onClick={() => {
              navigate("/config");
            }}
          />
          <NavigationButton
            text="Ensaiar"
            onClick={() => {
              navigate("/ensaio");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StartingScreen;
