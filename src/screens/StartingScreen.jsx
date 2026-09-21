import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const StartingScreen = () => {
  const navigate = useNavigate();
  const [thereIsEnsaio, setThereIsEnsaio] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkEnsaio = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ensaio")
      .select("*")
      .eq("isDone", false);

    setLoading(false);

    if (error) {
      console.error("Falha na checagem de ensaio:", error.message);
      setThereIsEnsaio(false);
      return false;
    }

    // Verifica se o array contém pelo menos um registro
    const hasActiveEnsaio = data && data.length > 0;
    setThereIsEnsaio(hasActiveEnsaio);

    return hasActiveEnsaio;
  };

  const handleAgendarClick = async () => {
    const hasActive = await checkEnsaio();
    if (hasActive) {
      alert(
        "Há um ensaio agendado, finalize o ensaio ou cancele antes de agendar outro",
      );
    } else {
      navigate("/config");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-gray-500 mb-8 text-sm">No tones</p>

        <div className="flex flex-col gap-4">
          <NavigationButton
            text="Set List"
            onClick={() => navigate("/set-list")}
          />
          <NavigationButton
            text={loading ? "Verificando..." : "Agendar ensaio"}
            onClick={handleAgendarClick}
          />
          <NavigationButton
            text="Ensaiar"
            onClick={() => navigate("/ensaio")}
          />
        </div>
      </div>
    </div>
  );
};

export default StartingScreen;
