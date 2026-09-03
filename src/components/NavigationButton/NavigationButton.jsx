const NavigationButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold text-lg py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
    >
      {text}
    </button>
  );
};

export default NavigationButton;
