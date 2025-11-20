import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { migrateFromLocalStorage } from './lib/migration';

const basename = import.meta.env.BASE_URL;

// Run migration on app startup
migrateFromLocalStorage()
  .then(() => console.log('App initialized with IndexedDB'))
  .catch((err) => console.error('Migration error:', err));

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch((err) => {
        console.error('ServiceWorker registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
