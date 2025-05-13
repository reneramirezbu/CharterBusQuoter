import React from "react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="ri-bus-2-line text-primary text-2xl"></i>
          <h1 className="font-heading font-bold text-lg sm:text-xl text-primary-900">Charter Bus Quote</h1>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
          <a href="#how-it-works" className="text-gray-600 hover:text-primary transition text-sm">How It Works</a>
          <a href="#services" className="text-gray-600 hover:text-primary transition text-sm">Services</a>
          <a href="#about" className="text-gray-600 hover:text-primary transition text-sm">About Us</a>
          <Button className="text-sm">Contact Us</Button>
        </div>
        
        <button 
          className="sm:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white px-4 py-2 shadow-md">
          <nav className="flex flex-col space-y-3 pb-3">
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition py-2">How It Works</a>
            <a href="#services" className="text-gray-600 hover:text-primary transition py-2">Services</a>
            <a href="#about" className="text-gray-600 hover:text-primary transition py-2">About Us</a>
            <Button className="w-full justify-center">Contact Us</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
