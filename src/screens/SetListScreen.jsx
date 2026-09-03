import { SONGS } from "../dummie_data/songs";
import SongElement from "../components/SongElement/SongElement";
import { useNavigate } from "react-router-dom";

const SetListScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Header */}
        <header className="mb-6">
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
            Go back
          </button>
        </header>

        {/* Page Title Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Set List
          </h1>
          <span className="bg-gray-800 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
            {SONGS.length} Songs
          </span>
        </div>

        {/* Responsive Grid for Cards */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {SONGS.map((item, index) => (
            <li key={index} className="list-none">
              <SongElement
                name={item.name}
                artist={item.artist}
                bpm={item.bpm}
                hasAcousticGuitar={item.hasAcousticGuitar}
                howLong={item.howLong}
                howManyTimesHasBeingPlayed={item.howManyTimesHasBeingPlayed}
                lastPlayed={item.lastPlayed}
                obs={item.obs}
                pedal={item.pedal}
                star={item.star}
                status={item.status}
                tune={item.tune}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SetListScreen;
