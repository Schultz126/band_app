import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SetListProvider } from "./context/SetListContext";
import { EnsaioProvider } from "./context/RehearsalContext";
import { MusicasDoEnsaioProvider } from "./context/MusicaDoEnsaioContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SetListProvider>
        <EnsaioProvider>
          <MusicasDoEnsaioProvider>
            <App />
          </MusicasDoEnsaioProvider>
        </EnsaioProvider>
      </SetListProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
