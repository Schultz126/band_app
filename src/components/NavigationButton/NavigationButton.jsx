const NavigationButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="band-button w-full px-4 py-3 text-lg"
    >
      {text}
    </button>
  );
};

export default NavigationButton;
