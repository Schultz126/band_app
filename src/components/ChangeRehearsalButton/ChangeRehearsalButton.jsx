import { useNavigate } from "react-router-dom";

const ChangeRehearsalButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate("/ensaio/alterar");
      }}
      className="group flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
    >
      Alterar Set-List
      {/* SVG Right Arrow Icon */}
      <svg
        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </button>
  );
};

export default ChangeRehearsalButton;
