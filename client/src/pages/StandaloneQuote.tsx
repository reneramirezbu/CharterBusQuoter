import React from "react";
import { useEffect } from "react";
import SimpleCharterQuoteWidget from "@/components/SimpleCharterQuoteWidget";

/**
 * Standalone Quote Page
 * 
 * A minimal page that showcases just the Charter Bus Quote Widget
 * wrapped in the charter-quote-widget container for Elementor embedding.
 */
const StandaloneQuote: React.FC = () => {
  // Load the external CSS for the quote widget
  useEffect(() => {
    // Add CSS link to the document head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/quote-widget.css';
    document.head.appendChild(link);

    return () => {
      // Clean up the link element when the component unmounts
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="standalone-quote-page bg-white min-h-screen py-8 px-4">
      <div id="charter-quote-widget" className="charter-quote-widget">
        <SimpleCharterQuoteWidget />
      </div>
    </div>
  );
};

export default StandaloneQuote;