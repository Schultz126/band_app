import "./App.css";
import { Route, Routes } from "react-router-dom";
import StartingScreen from "./screens/StartingScreen";
import RehearsalScreen from "./screens/RehearsalScreen";
import SetListScreen from "./screens/SetListScreen";
import RehearsalSettingsScreen from "./screens/RehearsalSettingsScreen";
import AddSongScreen from "./screens/AddSongScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartingScreen />} />
      <Route path="/config" element={<RehearsalSettingsScreen />} />
      <Route path="/ensaio" element={<RehearsalScreen />} />
      <Route path="/set-list" element={<SetListScreen />} />
      <Route path="/set-list/add-song" element={<AddSongScreen />} />
      <Route path="/set-list/edit-song" element={<AddSongScreen />} />
    </Routes>
  );
}

export default App;
