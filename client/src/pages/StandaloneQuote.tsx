import React from "react";
import CharterBusQuoteWidget from "@/components/CharterBusQuoteWidget";

/**
 * Standalone Quote Page
 * 
 * A minimal page that showcases just the Charter Bus Quote Widget
 * without any extra UI elements.
 */
const StandaloneQuote: React.FC = () => {
  return (
    <div className="standalone-quote-page bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <CharterBusQuoteWidget />
      </div>
    </div>
  );
};

export default StandaloneQuote;