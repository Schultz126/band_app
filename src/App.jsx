import "./App.css";
import { Route, Routes } from "react-router-dom";
import StartingScreen from "./screens/StartingScreen";
import RehearsalScreen from "./screens/RehearsalScreen";
import SetListScreen from "./screens/SetListScreen";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<StartingScreen />} />
        <Route path="ensaio" element={<RehearsalScreen />} />
        <Route path="set-list" element={<SetListScreen />} />
      </Routes>
    </>
  );
}

export default App;
