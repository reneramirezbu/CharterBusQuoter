/**
 * Charter Bus Quote Widget
 * 
 * This script can be used to embed the Charter Bus Quote widget in WordPress
 * with Elementor. It will create an iframe that loads the full widget.
 * 
 * Usage:
 * 1. Upload this file to your WordPress site
 * 2. Add an HTML or Custom Code widget in Elementor
 * 3. Paste the following code:
 *    <div id="charter-bus-quote-container" data-api-url="https://your-api-domain.com" data-api-key="YOUR_GOOGLE_MAPS_API_KEY"></div>
 *    <script src="/path/to/quote-widget.js"></script>
 */

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Find the container element
    const container = document.getElementById('charter-bus-quote-container');
    if (!container) {
      console.error('Container element #charter-bus-quote-container not found');
      return;
    }
    
    // Get configuration from data attributes
    const apiUrl = container.getAttribute('data-api-url') || 'http://localhost:5000';
    const apiKey = container.getAttribute('data-api-key');
    
    if (!apiKey) {
      console.error('No Google Maps API key provided. Add data-api-key attribute to the container.');
      
      // Show error message in container
      container.innerHTML = `
        <div style="padding: 20px; border: 1px solid #f56565; background-color: #fff5f5; color: #c53030; border-radius: 4px;">
          <strong>Configuration Error:</strong> Google Maps API key is missing. Please add the data-api-key attribute to the container.
        </div>
      `;
      return;
    }
    
    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '800px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    
    // Add source with parameters
    iframe.src = `${apiUrl}/quote-widget.html?api=${encodeURIComponent(apiKey)}`;
    
    // Clear container and append iframe
    container.innerHTML = '';
    container.appendChild(iframe);
    
    // Handle messages from iframe for responsive height
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'charter-bus-widget-height') {
        iframe.style.height = `${event.data.height}px`;
      }
    });
  });
})();