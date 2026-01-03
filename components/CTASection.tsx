
import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="px-6 py-12 md:py-20">
      <div className="max-w-7xl mx-auto rounded-[40px] md:rounded-[60px] overflow-hidden relative min-h-[500px] flex items-center justify-center text-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Farm field" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 max-w-2xl text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Let's Work Together for a Greener Tomorrow</h2>
          <p className="text-lg text-gray-200 mb-10 font-light leading-relaxed">
            Partner with us to bring sustainable agriculture and fresh organic produce to your customers and community.
          </p>
          <button className="bg-white text-[#2D3E2D] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#D9ED92] transition-colors shadow-2xl">
            Let's Explore
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
