import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <i className="ri-bus-2-line text-primary-400 text-2xl"></i>
              <h3 className="font-heading font-bold text-lg">Charter Bus Quote</h3>
            </div>
            <p className="text-gray-400 text-sm">Providing reliable charter bus services nationwide for all your group transportation needs.</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Services</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Corporate Events</a></li>
              <li><a href="#" className="hover:text-white transition">School Trips</a></li>
              <li><a href="#" className="hover:text-white transition">Sports Teams</a></li>
              <li><a href="#" className="hover:text-white transition">Group Tours</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <i className="ri-phone-line mr-2"></i>
                <span>(800) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="ri-mail-line mr-2"></i>
                <span>info@charterbus.example</span>
              </li>
              <li className="flex items-center">
                <i className="ri-map-pin-line mr-2"></i>
                <span>123 Main Street, Anytown, USA</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Charter Bus Quote Service. All rights reserved.
          </div>
          <div className="flex space-x-4">
            {["ri-facebook-fill", "ri-twitter-fill", "ri-instagram-line", "ri-linkedin-fill"].map((icon, index) => (
              <a key={index} href="#" className="text-gray-400 hover:text-white transition">
                <i className={`${icon} text-xl`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
