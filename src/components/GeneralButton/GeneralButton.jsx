const GeneralButton = ({ onClick, text }) => {
  return (
    <button
      className="band-button w-full px-4 py-3"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default GeneralButton;
