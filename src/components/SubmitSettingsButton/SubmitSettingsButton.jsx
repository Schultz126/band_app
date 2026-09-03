import { useNavigate } from "react-router-dom";

const SubmitSettingsButton = ({ time, songs }) => {
  const navigate = useNavigate();

  const handleStartRehearsal = () => {
    // Verifica se os campos estão em branco
    if (!time || !songs) {
      alert(
        "Por favor, preencha o tempo disponível e a quantidade de músicas para prosseguir.",
      );
      return; // Interrompe a execução aqui
    }

    // A lógica futura para selecionar as músicas entrará aqui
    console.log("Tempo:", time, "Músicas:", songs);

    // Avança para a tela de ensaio
    navigate("/ensaio");
  };

  return (
    <button
      onClick={handleStartRehearsal}
      className="w-full bg-gray-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
    >
      Ensaiar
    </button>
  );
};

export default SubmitSettingsButton;
