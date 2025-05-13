// This script initializes the Google Maps API with the key from environment variables
// and ensures the widget can access it for Places Autocomplete functionality

(function() {
  // Get the Google Maps API key from the environment or a data attribute
  const apiKey = document.getElementById('charter-quote-widget').getAttribute('data-api-key') || 
                'YOUR_API_KEY_HERE';
  
  // Load the Google Maps API with the Places library
  function loadGoogleMapsAPI() {
    if (window.google && window.google.maps) {
      console.log('Google Maps API already loaded');
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    script.onload = function() {
      console.log('Google Maps API loaded successfully');
    };
    
    script.onerror = function() {
      console.error('Failed to load Google Maps API');
    };
  }
  
  // Initialize when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGoogleMapsAPI);
  } else {
    loadGoogleMapsAPI();
  }
})();