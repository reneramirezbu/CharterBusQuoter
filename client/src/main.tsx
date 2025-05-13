import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Load Google Maps API script with better error handling and loading logic
const loadMapsApi = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.");
    return;
  }
  
  // Check if API is already loaded
  if (window.google && window.google.maps) {
    console.log("Google Maps API already loaded");
    return;
  }
  
  // Create a promise to track loading status
  const mapsPromise = new Promise<void>((resolve, reject) => {
    // Add a callback for when the API loads
    window.initGoogleMapsCallback = () => {
      console.log("Google Maps API loaded successfully");
      resolve();
    };
    
    // Handle load errors
    const handleScriptError = () => {
      console.error("Failed to load Google Maps API");
      reject(new Error("Google Maps API failed to load"));
    };
    
    // Create and add the script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    script.onerror = handleScriptError;
    document.head.appendChild(script);
    
    // Set a timeout in case the API doesn't load
    setTimeout(() => {
      if (!window.google || !window.google.maps) {
        handleScriptError();
      }
    }, 10000); // 10 seconds timeout
  });
  
  return mapsPromise;
};

// Define the callback property on the window object
declare global {
  interface Window {
    initGoogleMapsCallback?: () => void;
  }
}

// Load the Maps API
loadMapsApi()
  .catch(error => {
    console.warn("Google Maps failed to load:", error);
  });

// Render the app regardless of Maps API status (component will handle fallbacks)
createRoot(document.getElementById("root")!).render(<App />);
