import React from 'react';
import { ArrowRight, Recycle, Target } from 'lucide-react';

const Hero = () => {
  const scrollToModels = () => {
    const modelsSection = document.getElementById('models');
    if (modelsSection) {
      modelsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToInvestment = () => {
    const investmentSection = document.getElementById('invest');
    if (investmentSection) {
      investmentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-gray-900 text-white py-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://fvdrones.com/images/video.mp4" type="video/mp4" />
          {/* Fallback gradient background if video fails to load */}
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            From Residues to Resources
          </h1>
          <p className="text-2xl md:text-3xl font-semibold mb-4" style={{color: '#FFFF00'}}>
            Currently in Development Stage
          </p>
          <p className="text-lg md:text-xl font-medium mb-8 text-gray-300">
            Alpha Models Available for Early Supporters
          </p>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            We're developing revolutionary UAV technology from recycled materials. 
            Our alpha models (airplane, helicopter, and quadcopter surveillance drones) are available now.
            <strong className="text-yellow-400"> Early buyers will receive the final production model for free as a thank you for supporting our mission!</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={scrollToModels}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              Explore Models <ArrowRight className="h-5 w-5" />
            </button>
            <button 
              onClick={scrollToInvestment}
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Investment Opportunities
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <Recycle className="h-12 w-12 mb-4" style={{color: '#FFFF00'}} />
              <h3 className="text-xl font-semibold mb-3">Sustainable Innovation</h3>
              <p className="text-gray-300">
                Transforming waste materials into high-performance UAV components, 
                demonstrating the potential of circular economy principles in aerospace.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <Target className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mission-Critical Performance</h3>
              <p className="text-gray-300">
                Purpose-built for surveillance, reconnaissance, and tactical applications 
                with the reliability required for professional operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;