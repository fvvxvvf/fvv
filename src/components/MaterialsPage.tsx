import React, { useEffect } from 'react';
import { ArrowLeft, FileText, Wheat, Layers, Printer, Microscope, Shield, Zap, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MaterialsPage = () => {
  // Scroll to top when component mounts, or to specific section if hash is present
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Wait for component to render, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const materials = [
    {
      id: 'paper-composite',
      name: 'Paper Composite',
      icon: FileText,
      description: 'Advanced engineered paper frames utilizing innovative manufacturing techniques for optimal performance.',
      detailedDescription: 'Our paper composite technology represents a breakthrough in sustainable aerospace materials. We employ two primary manufacturing methods: precision-layered paper strips bonded with high-grade epoxy resin, and advanced epoxy-infused paper pulp molding. The layered approach creates exceptional directional strength, while the molded technique allows for complex geometries with consistent material properties throughout.',
      advantages: [
        'Ultra-lightweight construction (30% lighter than traditional materials)',
        'Excellent shock absorption and vibration damping',
        'Biodegradable base material with minimal environmental impact',
        'Cost-effective manufacturing process',
        'Rapid prototyping capabilities'
      ],
      applications: [
        'Civilian surveillance and monitoring',
        'Educational and training platforms',
        'Disposable mission-specific drones',
        'Environmental research applications',
        'Emergency response scenarios'
      ],
      sustainability: 'Manufactured from 100% post-consumer recycled paper waste, our process diverts materials from landfills while creating high-performance aerospace components.',
      technicalSpecs: {
        density: '0.8-1.2 g/cm³',
        tensileStrength: '45-65 MPa',
        flexuralStrength: '70-90 MPa',
        operatingTemp: '-10°C to 60°C',
        moistureResistance: 'Epoxy-sealed, <2% absorption'
      }
    },
    {
      id: 'flax-fiber-composite',
      name: 'Flax Fiber Composite',
      icon: Wheat,
      description: 'Natural flax fibers combined with advanced resin systems creating superior bio-composite materials.',
      detailedDescription: 'Our flax fiber composite technology harnesses the exceptional properties of natural flax fibers, known for their high strength-to-weight ratio and natural vibration damping characteristics. The fibers are carefully processed and oriented to maximize structural performance, then combined with specially formulated epoxy resin systems that enhance durability while maintaining the material\'s eco-friendly profile.',
      advantages: [
        'Superior strength-to-weight ratio (comparable to carbon fiber)',
        'Natural vibration damping reduces noise and improves stability',
        'Renewable resource with low carbon footprint',
        'Excellent fatigue resistance for extended operational life',
        'Non-conductive properties for electromagnetic applications'
      ],
      applications: [
        'Professional surveillance and reconnaissance',
        'Extended flight mission platforms',
        'Harsh environment operations',
        'Commercial inspection services',
        'Scientific research platforms'
      ],
      sustainability: 'Sourced from renewable flax crops, our composite reduces carbon footprint by 40% compared to synthetic alternatives while supporting sustainable agriculture.',
      technicalSpecs: {
        density: '1.3-1.5 g/cm³',
        tensileStrength: '200-350 MPa',
        flexuralStrength: '150-250 MPa',
        operatingTemp: '-20°C to 80°C',
        dampingRatio: '0.02-0.04'
      }
    },
    {
      id: 'aluminum-composite',
      name: 'Aluminum Composite',
      icon: Layers,
      description: 'Precision-engineered recycled aluminum components offering exceptional durability and performance.',
      detailedDescription: 'Our aluminum composite technology utilizes two advanced manufacturing approaches: precision-layered recycled aluminum foil strips bonded with specialized adhesives, and high-precision casting of recycled aluminum into complex frame geometries. Both methods leverage the inherent properties of aluminum while maximizing material utilization and minimizing waste.',
      advantages: [
        'Exceptional electromagnetic shielding capabilities',
        'Superior thermal conductivity for heat dissipation',
        'Outstanding durability and corrosion resistance',
        'Excellent dimensional stability across temperature ranges',
        'Recyclable at end-of-life with minimal material degradation'
      ],
      applications: [
        'Military and tactical operations',
        'High-temperature environment missions',
        'Electromagnetic interference-sensitive applications',
        'Long-duration surveillance platforms',
        'Critical infrastructure monitoring'
      ],
      sustainability: 'Constructed from 95% recycled aluminum content, utilizing post-consumer and post-industrial waste streams while maintaining aerospace-grade performance standards.',
      technicalSpecs: {
        density: '2.6-2.8 g/cm³',
        tensileStrength: '200-400 MPa',
        thermalConductivity: '150-200 W/m·K',
        operatingTemp: '-40°C to 150°C',
        emShielding: '>60 dB (1-10 GHz)'
      }
    },
    {
      id: '3d-printed-pet',
      name: '3D Printed PET',
      icon: Printer,
      description: 'Advanced additive manufacturing using recycled PET filament for complex geometries and rapid prototyping.',
      detailedDescription: 'Our 3D printed PET technology employs state-of-the-art additive manufacturing techniques using specially formulated PET filament derived from recycled plastic bottles. The printing process includes post-processing annealing to optimize material properties and achieve aerospace-grade performance characteristics.',
      advantages: [
        'Complex internal structures impossible with traditional manufacturing',
        'Rapid prototyping and customization capabilities',
        'Excellent chemical resistance and durability',
        'Precise dimensional control and repeatability',
        'Integrated features reduce assembly requirements'
      ],
      applications: [
        'Specialized mission-specific platforms',
        'Custom payload integration systems',
        'Research and development prototypes',
        'Limited production specialized variants',
        'Educational demonstration models'
      ],
      sustainability: 'PET filament sourced entirely from recycled plastic bottles, with each drone frame utilizing approximately 50-75 bottles worth of recycled material.',
      technicalSpecs: {
        density: '1.3-1.4 g/cm³',
        tensileStrength: '50-70 MPa',
        flexuralStrength: '80-100 MPa',
        operatingTemp: '-10°C to 70°C',
        layerAdhesion: '>90% of bulk strength'
      }
    }
  ];

  const testingStandards = [
    {
      icon: Microscope,
      title: 'Material Analysis',
      description: 'Comprehensive testing of mechanical properties, durability, and performance characteristics'
    },
    {
      icon: Shield,
      title: 'Environmental Testing',
      description: 'UV resistance, moisture absorption, temperature cycling, and chemical compatibility testing'
    },
    {
      icon: Zap,
      title: 'Electrical Properties',
      description: 'Electromagnetic compatibility, conductivity, and insulation resistance verification'
    },
    {
      icon: Thermometer,
      title: 'Thermal Analysis',
      description: 'Heat deflection, thermal expansion, and operating temperature range validation'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Revolutionary Materials</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Discover the cutting-edge sustainable materials that power our UAV technology. 
            Each material represents years of research and development in transforming waste 
            into high-performance aerospace components.
          </p>
        </div>

        {/* Detailed Material Sections */}
        <div className="space-y-20">
          {materials.map((material, index) => {
            const IconComponent = material.icon;
            return (
              <div key={index} id={material.id} className="bg-gray-50 rounded-3xl p-8 lg:p-12 border border-gray-200 scroll-mt-20">
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                  {/* CAD Visualization Box */}
                  <div className="lg:order-2">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Material Visualization</h3>
                      <div className="overflow-hidden rounded-xl border border-gray-300">
                        <img 
                          src="https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=400"
                          alt={`${material.name} visualization`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content - spans 2 columns */}
                  <div className="lg:col-span-2 lg:order-1">
                    <div className="flex items-center mb-6">
                      <div className="p-4 rounded-xl mr-6" style={{backgroundColor: '#FFFF00'}}>
                        <IconComponent className="h-8 w-8 text-gray-900" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">{material.name}</h2>
                    </div>
                    
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                      {material.detailedDescription}
                    </p>

                    <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainability Impact</h3>
                      <p className="text-gray-700">{material.sustainability}</p>
                    </div>
                  </div>

                  {/* Specifications and Details - full width */}
                  <div className="lg:col-span-3 lg:order-3 space-y-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                        <div className="space-y-3">
                          {Object.entries(material.technicalSpecs).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="text-gray-900 font-semibold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Advantages</h3>
                        <ul className="space-y-3">
                          {material.advantages.map((advantage, advIndex) => (
                            <li key={advIndex} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Applications</h3>
                      <div className="space-y-2">
                        {material.applications.map((app, appIndex) => (
                          <div key={appIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{app}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testing & Certification */}
        <div className="mt-20 bg-gray-50 rounded-3xl p-8 lg:p-12 border border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Material Testing & Certification</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Every material undergoes rigorous testing protocols to ensure aerospace-grade 
              performance and reliability under extreme operational conditions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {testingStandards.map((standard, index) => {
              const IconComponent = standard.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-red-500 p-4 rounded-xl inline-flex mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{standard.title}</h3>
                  <p className="text-gray-700 text-sm">{standard.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Certification Standards</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="text-red-500 font-semibold">Impact Tested</span>
              <span className="text-yellow-400 font-semibold">Weather Resistant</span>
              <span className="text-red-500 font-semibold">Flight Certified</span>
              <span className="text-yellow-400 font-semibold">Eco-Certified</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-red-500 to-yellow-400 rounded-3xl p-8 text-gray-900">
            <h3 className="text-3xl font-bold mb-4">Interested in Our Materials Technology?</h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Contact us to learn more about licensing our materials technology or 
              collaborating on sustainable aerospace innovations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/#contact"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Contact Our Team
              </Link>
              <Link 
                to="/#models"
                className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                View Our Drones
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MaterialsPage;