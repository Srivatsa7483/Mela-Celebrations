import { StrictMode } from "react";
import "./styles/globals.css";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ui/ErrorBoundary.jsx";

// Global fetch interceptor to handle absolute API URLs on production hosting
const isProduction = import.meta.env.PROD;
const API_URL = import.meta.env.VITE_API_URL || (isProduction ? "https://mela-celebrations.onrender.com" : "");

if (API_URL) {
  console.log(`🌐 Production API Interceptor active: routing /api/* requests to ${API_URL}`);
  const originalFetch = window.fetch;
  window.fetch = async function (resource, init) {
    let url = resource;
    if (typeof url === "string" && url.startsWith("/api/")) {
      url = `${API_URL}${url}`;
    }
    return originalFetch(url, init);
  };
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);