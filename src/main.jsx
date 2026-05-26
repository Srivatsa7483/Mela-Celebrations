import { StrictMode } from "react";
import "./styles/globals.css";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ui/ErrorBoundary.jsx";

// Global fetch interceptor to handle absolute API URLs on production hosting
// VITE_API_URL controls where API requests go:
//   - Set to empty string "" to let .htaccess Apache proxy handle /api/* (recommended for Hostinger)
//   - Set to your Render URL to bypass .htaccess and call Render directly
const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_URL = (VITE_API_URL !== undefined && VITE_API_URL !== "") 
  ? VITE_API_URL 
  : "";

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
} else {
  console.log("🌐 API requests will use .htaccess proxy (Apache mod_proxy) or relative /api/* paths.");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);