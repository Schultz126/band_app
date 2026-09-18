import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SetListProvider } from "./context/SetListContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SetListProvider>
        <App />
      </SetListProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
