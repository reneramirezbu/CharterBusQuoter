import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Load Google Maps API script
const loadMapsApi = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.");
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

loadMapsApi();
createRoot(document.getElementById("root")!).render(<App />);
