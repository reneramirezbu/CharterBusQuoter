import React from "react";

const Features: React.FC = () => {
  const features = [
    {
      icon: "ri-shield-check-line",
      title: "Safe & Reliable",
      description: "All our drivers are professionally trained and our vehicles undergo regular safety inspections."
    },
    {
      icon: "ri-money-dollar-circle-line",
      title: "Transparent Pricing",
      description: "No hidden fees. Get an accurate quote upfront with a detailed breakdown of all costs."
    },
    {
      icon: "ri-customer-service-2-line",
      title: "24/7 Support",
      description: "Our customer service team is available around the clock to assist with any questions or concerns."
    }
  ];
  
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-bold text-2xl text-center mb-10">Why Choose Our Charter Bus Service</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`${feature.icon} text-primary text-2xl`}></i>
              </div>
              <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
