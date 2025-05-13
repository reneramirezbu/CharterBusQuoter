import React from "react";

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      text: "The booking process was incredibly easy and the quote was very reasonable. Our driver was professional and the bus was immaculate. Will definitely use this service again for our next corporate retreat.",
      name: "Sarah Johnson",
      role: "Event Coordinator"
    },
    {
      text: "We used their service for our school field trip and it was exceptional. The quote tool gave us exactly what we needed to budget properly, and the entire experience was stress-free.",
      name: "Michael Torres",
      role: "School Administrator"
    }
  ];
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-bold text-2xl text-center mb-10">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex space-x-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="ri-star-fill"></i>
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
