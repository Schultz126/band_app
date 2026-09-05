import GeneralButton from "../GeneralButton/GeneralButton";
import ENSAIO from "../../dummie_data/Ensaio/ensaio";
import { useNavigate } from "react-router-dom";

const FinishButton = () => {
  const navigate = useNavigate();
  const finishRehearsal = () => {
    ENSAIO.forEach((song) => {
      song.setNewDate();
      song.updateTimesPlayed();
    });

    ENSAIO.splice(0, ENSAIO.length); // Clears the ENSAIO array
    navigate(-1);
  };

  return <GeneralButton text={"Finalizar ensaio"} onClick={finishRehearsal} />;
};

export default FinishButton;
