import { useNavigate } from "react-router-dom";

const AddSongButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="band-button-ghost group flex items-center text-sm pr-2 duration-200"
      onClick={() => {
        navigate("/set-list/add-song");
      }}
    >
      Adicionar música +
    </button>
  );
};

export default AddSongButton;
