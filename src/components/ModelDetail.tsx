import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Shield, Zap, Camera, Wifi, Battery, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const ModelDetail = () => {
  const { modelName } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const models = {
    'sentinel-pro': {
      name: 'Sentinel Pro',
      category: 'Professional Surveillance',
      images: [
        'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      material: 'Flax Fiber Composite',
      price: 'Contact for Pricing',
      description: 'The Sentinel Pro represents the pinnacle of sustainable surveillance technology. Built with our revolutionary flax fiber composite frame, this professional-grade UAV delivers exceptional performance while maintaining our commitment to environmental responsibility.',
      specs: {
        flightTime: '45 minutes',
        range: '5 km',
        weight: '180g',
        maxSpeed: '65 km/h',
        operatingTemp: '-10°C to 45°C',
        windResistance: '25 km/h',
        batteryType: 'LiPo 3S 2200mAh',
        chargingTime: '90 minutes'
      },
      features: [
        {
          icon: Camera,
          title: '4K Camera with 30x Zoom',
          description: 'Professional-grade camera system with optical zoom and image stabilization'
        },
        {
          icon: Eye,
          title: 'Thermal Imaging',
          description: 'Advanced thermal sensor for night operations and heat signature detection'
        },
        {
          icon: Wifi,
          title: 'Real-time Data Transmission',
          description: 'Live video streaming and telemetry data transmission up to 5km range'
        },
        {
          icon: Navigation,
          title: 'GPS Auto-Return',
          description: 'Automatic return-to-home functionality with GPS precision landing'
        }
      ],
      applications: ['Law Enforcement', 'Border Security', 'Search & Rescue', 'Wildlife Monitoring'],
      sustainability: [
        'Frame constructed from 85% recycled flax fibers',
        'Biodegradable components where possible',
        'Minimal environmental impact manufacturing',
        'End-of-life recycling program available'
      ]
    },
    'recon-elite': {
      name: 'Recon Elite',
      category: 'Military & Tactical',
      images: [
        'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      material: 'Aluminum Composite',
      price: 'Restricted Access',
      description: 'The Recon Elite is engineered for the most demanding tactical operations. Featuring our advanced aluminum composite construction from 95% recycled materials, this military-grade platform delivers uncompromising performance in hostile environments.',
      specs: {
        flightTime: '60 minutes',
        range: '10 km',
        weight: '195g',
        maxSpeed: '80 km/h',
        operatingTemp: '-20°C to 55°C',
        windResistance: '35 km/h',
        batteryType: 'LiPo 4S 3000mAh',
        chargingTime: '120 minutes'
      },
      features: [
        {
          icon: Shield,
          title: 'Encrypted Communications',
          description: 'Military-grade encryption for secure data transmission and command links'
        },
        {
          icon: Eye,
          title: 'Night Vision Capability',
          description: 'Advanced low-light sensors and infrared imaging systems'
        },
        {
          icon: Zap,
          title: 'EMP Hardened',
          description: 'Electromagnetic pulse protection for critical mission continuity'
        },
        {
          icon: Battery,
          title: 'Silent Operation Mode',
          description: 'Reduced acoustic signature for covert reconnaissance missions'
        }
      ],
      applications: ['Military Operations', 'Intelligence Gathering', 'Tactical Support', 'Counter-Surveillance'],
      sustainability: [
        'Frame built from 95% recycled aluminum',
        'Electromagnetic shielding from recycled materials',
        'Reduced carbon footprint manufacturing process',
        'Military-approved recycling protocols'
      ]
    },
    'ecoscout': {
      name: 'EcoScout',
      category: 'Civilian & Training',
      images: [
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      material: 'Paper Composite',
      price: '€2,499',
      description: 'The EcoScout demonstrates that sustainability and performance can coexist beautifully. Constructed entirely from our innovative paper composite materials, this civilian-friendly UAV is perfect for education, research, and hobby applications.',
      specs: {
        flightTime: '25 minutes',
        range: '2 km',
        weight: '150g',
        maxSpeed: '45 km/h',
        operatingTemp: '0°C to 40°C',
        windResistance: '15 km/h',
        batteryType: 'LiPo 2S 1500mAh',
        chargingTime: '60 minutes'
      },
      features: [
        {
          icon: Camera,
          title: 'HD Camera',
          description: '1080p camera system perfect for aerial photography and monitoring'
        },
        {
          icon: Eye,
          title: 'Environmental Monitoring',
          description: 'Specialized sensors for air quality and environmental data collection'
        },
        {
          icon: Navigation,
          title: 'Educational Software',
          description: 'Comprehensive learning platform for drone operation and programming'
        },
        {
          icon: Shield,
          title: 'Easy Assembly',
          description: 'Tool-free assembly design perfect for educational environments'
        }
      ],
      applications: ['Environmental Research', 'Education', 'Hobby Use', 'Aerial Photography'],
      sustainability: [
        'Frame made from 100% recycled paper waste',
        'Completely biodegradable structure',
        'Non-toxic materials throughout',
        'Educational recycling program included'
      ]
    },
    'prototype-x1': {
      name: 'Prototype X1',
      category: 'Research & Development',
      images: [
        'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      material: '3D Printed PET',
      price: '€3,999',
      description: 'The Prototype X1 showcases the future of customizable UAV design. Built using our advanced 3D printed PET technology from recycled plastic bottles, this platform offers unprecedented flexibility for research and custom applications.',
      specs: {
        flightTime: '35 minutes',
        range: '3 km',
        weight: '170g',
        maxSpeed: '55 km/h',
        operatingTemp: '-5°C to 50°C',
        windResistance: '20 km/h',
        batteryType: 'LiPo 3S 1800mAh',
        chargingTime: '75 minutes'
      },
      features: [
        {
          icon: Shield,
          title: 'Modular Design',
          description: 'Interchangeable components for rapid configuration changes'
        },
        {
          icon: Camera,
          title: 'Custom Payload Bay',
          description: 'Adaptable payload compartment for specialized equipment'
        },
        {
          icon: Zap,
          title: 'Rapid Prototyping',
          description: 'Quick iteration capabilities for research and development'
        },
        {
          icon: Wifi,
          title: 'Open Source Compatible',
          description: 'Compatible with open-source flight control systems and software'
        }
      ],
      applications: ['Research', 'Custom Applications', 'Proof of Concept', 'Educational Development'],
      sustainability: [
        'Frame printed from recycled PET bottles',
        'Modular design reduces waste',
        'Recyclable component materials',
        'Sustainable manufacturing process'
      ]
    }
  };

  const model = models[modelName as keyof typeof models];

  const nextImage = () => {
    if (model) {
      setCurrentImageIndex((prev) => (prev + 1) % model.images.length);
    }
  };

  const prevImage = () => {
    if (model) {
      setCurrentImageIndex((prev) => (prev - 1 + model.images.length) % model.images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!model) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Model Not Found</h1>
            <p className="text-xl text-gray-700 mb-8">The requested model could not be found.</p>
            <Link to="/" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Return Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Models
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Interactive Image Gallery */}
          <div>
            <div className="relative h-96 overflow-hidden rounded-2xl shadow-lg bg-gray-100">
              {/* Main Image */}
              <img 
                src={model.images[currentImageIndex]} 
                alt={`${model.name} - View ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {model.images.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex space-x-3 mt-4 justify-center">
              {model.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    currentImageIndex === index 
                      ? 'border-red-500 ring-2 ring-red-500 ring-opacity-50' 
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${model.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-20"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Bullet Navigation */}
            <div className="flex justify-center space-x-2 mt-4">
              {model.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentImageIndex === index 
                      ? 'bg-red-500 scale-125' 
                      : 'bg-gray-300 hover:bg-red-300'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Model Information */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {model.category}
              </span>
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                {model.material}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{model.name}</h1>
            <p className="text-2xl font-bold text-red-500 mb-6">{model.price}</p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{model.description}</p>
            
            <div className="flex gap-4">
              <Link 
                to={`/quote/${modelName}`}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Request Quote
              </Link>
              <a 
                href="mailto:info@fvdrones.com?subject=Model Inquiry"
                className="border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-semibold text-gray-900">Flight Time</p>
                <p className="text-gray-700">{model.specs.flightTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Eye className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-semibold text-gray-900">Range</p>
                <p className="text-gray-700">{model.specs.range}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-semibold text-gray-900">Weight</p>
                <p className="text-gray-700">{model.specs.weight}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-semibold text-gray-900">Max Speed</p>
                <p className="text-gray-700">{model.specs.maxSpeed}</p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div>
              <p className="font-semibold text-gray-900">Operating Temperature</p>
              <p className="text-gray-700">{model.specs.operatingTemp}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Wind Resistance</p>
              <p className="text-gray-700">{model.specs.windResistance}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Battery</p>
              <p className="text-gray-700">{model.specs.batteryType}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Charging Time</p>
              <p className="text-gray-700">{model.specs.chargingTime}</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {model.features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-red-500 p-3 rounded-lg flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Applications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Applications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {model.applications.map((app, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                <p className="font-semibold text-gray-900">{app}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability */}
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Sustainability Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {model.sustainability.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ModelDetail;