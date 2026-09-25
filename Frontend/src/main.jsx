import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider } from "./auth/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider><LanguageProvider><App /></LanguageProvider></AuthProvider>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
}
