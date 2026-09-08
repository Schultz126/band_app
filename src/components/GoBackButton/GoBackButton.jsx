import { useNavigate } from "react-router-dom";

const GoBackbutton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(-1);
      }}
      className="group flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
    >
      {/* SVG Left Arrow Icon */}
      <svg
        className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Voltar
    </button>
  );
};

export default GoBackbutton;
