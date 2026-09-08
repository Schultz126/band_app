import { useNavigate } from "react-router-dom";

const AddSongButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="group flex items-center font-semibold text-gray-500 hover:text-gray-900 transition-colors group-hover:-translate-x-1 text-sm pr-2 duration-200"
      onClick={() => {
        navigate("/set-list/add-song");
      }}
    >
      Adicionar música +
    </button>
  );
};

export default AddSongButton;
