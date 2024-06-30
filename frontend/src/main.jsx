import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import './index.css'
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/context.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { SaveProvider } from "./context/SaveContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <SaveProvider>
        <SearchProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SearchProvider>
      </SaveProvider>
    </AppProvider>
  </React.StrictMode>
);
