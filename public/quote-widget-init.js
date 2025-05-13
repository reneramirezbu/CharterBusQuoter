/**
 * Charter Bus Quote Widget Initialization Script
 * 
 * This script:
 * 1. Fetches the Google Maps API key from the server
 * 2. Loads the Google Maps API with the key
 * 3. Initializes the widget functionality
 */

(function() {
  // Function to fetch the Google Maps API key from the server
  function fetchApiKey() {
    return fetch('/api/google-maps-key')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch API key');
        }
        return response.json();
      })
      .then(data => {
        if (!data.success || !data.apiKey) {
          throw new Error('Invalid API key response');
        }
        return data.apiKey;
      });
  }

  // Function to load the Google Maps API with the fetched key
  function loadGoogleMapsApi(apiKey) {
    return new Promise((resolve, reject) => {
      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
      script.async = true;
      script.defer = true;
      
      // Add callback function to global scope
      window.initGoogleMapsCallback = function() {
        console.log('Google Maps API loaded successfully');
        resolve();
      };
      
      // Error handling
      script.onerror = function() {
        reject(new Error('Failed to load Google Maps API'));
      };
      
      // Add script to document
      document.head.appendChild(script);
    });
  }

  // Function to initialize the Places Autocomplete
  function initPlacesAutocomplete() {
    const pickupInput = document.getElementById('pickup-location');
    const dropoffInput = document.getElementById('dropoff-location');
    
    if (pickupInput && window.google && window.google.maps && window.google.maps.places) {
      new google.maps.places.Autocomplete(pickupInput, {
        types: ['address'],
        fields: ['place_id', 'formatted_address', 'geometry']
      });
    }
    
    if (dropoffInput && window.google && window.google.maps && window.google.maps.places) {
      new google.maps.places.Autocomplete(dropoffInput, {
        types: ['address'],
        fields: ['place_id', 'formatted_address', 'geometry']
      });
    }
  }

  // Initialize widget when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Show loading state
    const widget = document.getElementById('charter-quote-widget');
    if (widget) {
      const loadingOverlay = widget.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
      }
      
      // Get API key and initialize
      fetchApiKey()
        .then(apiKey => loadGoogleMapsApi(apiKey))
        .then(() => {
          initPlacesAutocomplete();
          // Hide loading overlay
          if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
          }
        })
        .catch(error => {
          console.error('Error initializing charter bus quote widget:', error);
          // Show error message in widget
          if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
          }
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-message';
          errorDiv.textContent = 'Unable to load location services. Please try again later.';
          widget.appendChild(errorDiv);
        });
    }
  });
})();