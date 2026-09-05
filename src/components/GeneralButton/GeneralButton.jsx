const GeneralButton = ({ onClick, text }) => {
  return (
    <button
      className="w-full bg-gray-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default GeneralButton;
