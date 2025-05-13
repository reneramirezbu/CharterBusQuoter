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
  // Configuration options
  const defaultConfig = {
    apiUrl: window.location.origin, // Default to current domain
    containerId: 'charter-bus-quote-widget',
    iframeId: 'charter-bus-quote-iframe',
    paths: {
      widgetHtml: '/quote-widget.html'
    }
  };

  // Create and configure the widget container
  function createWidgetContainer() {
    // Find the container element
    const container = document.getElementById(defaultConfig.containerId);
    
    if (!container) {
      console.error(`Element with ID "${defaultConfig.containerId}" not found.`);
      return null;
    }
    
    // Get configuration from data attributes
    const apiUrl = container.getAttribute('data-api-url') || defaultConfig.apiUrl;
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = defaultConfig.iframeId;
    iframe.style.width = '100%';
    iframe.style.height = '600px'; // Default height
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    
    // Set the source to the widget HTML
    iframe.src = `${apiUrl}${defaultConfig.paths.widgetHtml}`;
    
    // Add iframe to container
    container.appendChild(iframe);
    
    return iframe;
  }

  // Initialize the widget when the DOM is ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createWidgetContainer);
    } else {
      createWidgetContainer();
    }
  }
  
  // Start initialization
  init();
})();