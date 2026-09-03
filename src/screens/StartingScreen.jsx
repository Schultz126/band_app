import { useNavigate } from "react-router-dom";
import NavigationButton from "../components/NavigationButton/NavigationButton";

const StartingScreen = () => {
  const navigate = useNavigate();

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
            text="Ensaiar"
            onClick={() => {
              navigate("/config");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StartingScreen;
