/**
 * Charter Bus Quote Widget Embedding Script
 * 
 * This script allows the Charter Bus Quote widget to be embedded
 * in any website, including WordPress with Elementor.
 * 
 * Usage:
 * 1. Add a <div id="charter-bus-quote-widget"></div> where you want the widget
 * 2. Include this script in your page
 * 3. The widget will render inside that div
 * 
 * Example:
 * <div id="charter-bus-quote-widget" data-api-url="https://your-api-url.com"></div>
 * <script src="https://your-domain.com/embed.js"></script>
 */

(function() {
  // Configuration
  const WIDGET_ID = 'charter-bus-quote-widget';
  const API_BASE_URL = document.getElementById(WIDGET_ID)?.getAttribute('data-api-url') || window.location.origin;
  const GOOGLE_MAPS_API_KEY = document.getElementById(WIDGET_ID)?.getAttribute('data-maps-api-key') || '';
  
  // Create container for widget
  function createWidgetContainer() {
    const container = document.getElementById(WIDGET_ID);
    if (!container) {
      console.error(`Element with ID "${WIDGET_ID}" not found. Widget cannot be rendered.`);
      return null;
    }
    return container;
  }
  
  // Load Google Maps API
  function loadGoogleMapsAPI(callback) {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is missing. Please provide a data-maps-api-key attribute.');
      return;
    }
    
    // Check if already loaded
    if (window.google && window.google.maps) {
      if (callback) callback();
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Handle load event
    script.onload = function() {
      if (callback) callback();
    };
    
    // Handle error
    script.onerror = function() {
      console.error('Failed to load Google Maps API');
    };
    
    // Add to document
    document.head.appendChild(script);
  }
  
  // Load CSS
  function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${API_BASE_URL}/widget-styles.css`;
    document.head.appendChild(link);
    
    // Add icon font
    const iconFont = document.createElement('link');
    iconFont.rel = 'stylesheet';
    iconFont.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
    document.head.appendChild(iconFont);
  }
  
  // Load the widget
  function loadWidget() {
    const container = createWidgetContainer();
    if (!container) return;
    
    // Inject iframe or fetch widget content
    const iframe = document.createElement('iframe');
    iframe.src = `${API_BASE_URL}/quote`;
    iframe.style.width = '100%';
    iframe.style.height = '800px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    container.appendChild(iframe);
    
    // Adjust iframe height based on content
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'charter-bus-widget-height') {
        iframe.style.height = `${event.data.height}px`;
      }
    });
  }
  
  // Initialize
  function init() {
    loadCSS();
    loadGoogleMapsAPI(loadWidget);
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();