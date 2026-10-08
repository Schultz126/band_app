import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationButton from "../components/NavigationButton/NavigationButton";
import { createClient } from "@supabase/supabase-js";
import logo from "../assets/NoTonesLogo.jpeg";

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
    <div className="app-shell flex flex-col items-center justify-center p-6">
      <div className="band-panel max-w-sm w-full rounded-lg p-8 text-center">
        <img
          src={logo}
          alt="No Tones"
          className="mx-auto mb-7 w-48 mix-blend-screen sm:w-56"
        />
        <p className="band-muted mb-2 text-xs font-bold uppercase tracking-[0.24em]">
          Gerenciador da banda
        </p>
        <h1 className="band-title mb-8 text-3xl">Prontos para tocar?</h1>

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
