import React from 'react';
import { FileText, Wheat, Layers, Printer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Materials = () => {
  const materials = [
    {
      name: 'Paper Composite',
      slug: 'paper-composite',
      icon: FileText,
      description: 'Engineered paper frames using either stacked paper strips with epoxy resin or epoxy-infused paper pulp molding.',
      advantages: 'Lightweight, biodegradable base material, excellent shock absorption',
      applications: 'Civilian surveillance, training models, disposable mission drones',
      sustainability: 'Made from 100% recycled paper waste'
    },
    {
      name: 'Flax Fiber Composite',
      slug: 'flax-fiber-composite',
      icon: Wheat,
      description: 'Natural flax fibers combined with epoxy resin creating a strong, lightweight bio-composite material.',
      advantages: 'High strength-to-weight ratio, natural vibration damping, renewable resource',
      applications: 'Professional surveillance, extended flight missions, harsh environment operations',
      sustainability: 'Renewable flax fibers reduce carbon footprint by 40%'
    },
    {
      name: 'Aluminum Composite',
      slug: 'aluminum-composite',
      icon: Layers,
      description: 'Recycled aluminum foil strips layered with epoxy or precision-cast aluminum frames from recycled metal.',
      advantages: 'Excellent electromagnetic shielding, superior durability, heat dissipation',
      applications: 'Military applications, tactical operations, high-heat environments',
      sustainability: 'Utilizes 95% recycled aluminum content'
    },
    {
      name: '3D Printed PET',
      slug: '3d-printed-pet',
      icon: Printer,
      description: 'Annealed PET filament frames manufactured through precision 3D printing for complex geometries.',
      advantages: 'Complex internal structures, rapid prototyping, customizable designs',
      applications: 'Specialized missions, custom payloads, research applications',
      sustainability: 'PET filament sourced from recycled plastic bottles'
    }
  ];

  const handleMaterialClick = (materialSlug: string) => {
    // Navigate to materials page and scroll to specific material section
    window.location.href = `/materials#${materialSlug}`;
  };

  return (
    <section id="materials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Revolutionary Materials
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Transforming waste into high-performance UAV components. Each material represents 
            our commitment to sustainable engineering without compromising operational excellence.
          </p>
          <Link 
            to="/materials"
            className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Learn More About Our Materials <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {materials.map((material, index) => {
            const IconComponent = material.icon;
            return (
              <div 
                key={index}
                onClick={() => handleMaterialClick(material.slug)}
                className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer group hover:border-red-500 hover:scale-105 transform"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-400 group-hover:bg-red-500 p-3 rounded-lg mr-4 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 text-gray-900 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-500 transition-colors duration-300">{material.name}</h3>
                </div>
                
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {material.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Key Advantages</h4>
                    <p className="text-xs text-gray-600">{material.advantages}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Applications</h4>
                    <p className="text-xs text-gray-600">{material.applications}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-300">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-xs text-green-600 font-medium">{material.sustainability}</p>
                    </div>
                  </div>
                </div>

                {/* Click indicator */}
                <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-red-500 text-sm font-medium">Click to learn more →</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gray-900 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Material Testing & Certification</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            All materials undergo rigorous testing for durability, weather resistance, and performance 
            under extreme conditions. Certified for both civilian and professional applications.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-white font-semibold">Impact Tested</span>
            <span className="text-white font-semibold">Weather Resistant</span>
            <span className="text-white font-semibold">Flight Certified</span>
            <span className="text-white font-semibold">Eco-Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Materials;