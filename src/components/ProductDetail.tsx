import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Eye, Clock, Shield, Zap, Camera, Wifi, Battery, Navigation, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { StockManager } from '../utils/stockManager';

const ProductDetail = () => {
  const { productId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [stockInfo, setStockInfo] = useState({ available: 0, inStock: 0, reserved: 0 });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load stock information
  useEffect(() => {
    if (productId) {
      const stock = StockManager.getProductStock(productId);
      setStockInfo(stock);
    }
  }, [productId]);

  // Product data (same as in Shop component)
  const products = {
    'fv-hawk-composite': {
      id: 'fv-hawk-composite',
      name: 'FV Hawk Surveillance',
      category: 'surveillance-aircraft',
      type: 'Helicopter Style',
      price: 299,
      originalPrice: 349,
      images: [
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDd6NmlmZ2d6YmZhc2R3dHFkOXBwYWwwdTVqN3JseXU3OHRmY2JlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QURevAwNku3IYI1wWz/giphy.gif',
        'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      materials: [
        {
          name: 'Flax Fiber Composite',
          price: 299,
          description: 'Natural flax fibers for superior strength and vibration damping',
          benefits: ['Lightweight', 'Eco-friendly', 'Vibration damping', 'High strength']
        },
        {
          name: 'Aluminum Composite',
          price: 329,
          description: 'Recycled aluminum for maximum durability and EMI shielding',
          benefits: ['EMI shielding', 'Heat dissipation', 'Maximum durability', 'Weather resistant']
        }
      ],
      specs: {
        flightTime: '35 minutes',
        range: '3 km',
        weight: '185g',
        maxSpeed: '55 km/h',
        operatingTemp: '-10°C to 45°C',
        windResistance: '25 km/h',
        batteryType: 'LiPo 3S 2200mAh',
        chargingTime: '90 minutes'
      },
      features: [
        {
          icon: Camera,
          title: 'HD Camera System',
          description: '1080p camera with real-time streaming and image stabilization'
        },
        {
          icon: Wifi,
          title: 'Real-time Streaming',
          description: 'Live video transmission up to 3km range with low latency'
        },
        {
          icon: Navigation,
          title: 'GPS Return',
          description: 'Automatic return-to-home with precision landing capabilities'
        },
        {
          icon: Battery,
          title: 'Silent Mode',
          description: 'Reduced noise operation for covert surveillance missions'
        }
      ],
      applications: ['Security Monitoring', 'Property Inspection', 'Search & Rescue', 'Wildlife Observation'],
      inStock: true,
      isNew: true,
      description: 'The FV Hawk represents the perfect balance of sustainability and performance in helicopter-style surveillance drones. Built with our revolutionary sustainable materials, this professional-grade UAV delivers exceptional flight characteristics while maintaining our commitment to environmental responsibility.'
    },
    'fv-eagle-quad': {
      id: 'fv-eagle-quad',
      name: 'FV Eagle Quad',
      category: 'surveillance-quad',
      type: 'Quadcopter',
      price: 249,
      originalPrice: 299,
      images: [
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExajJ4YTlnODRvZHNrcmNoc3hvZDZ3cDU4ajhpaTU4anp4dWh5OGJvNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hR0jSqWtRNovStbMep/giphy.gif',
        'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      materials: [
        {
          name: 'Paper Composite',
          price: 249,
          description: 'Engineered paper composite for lightweight and biodegradable construction',
          benefits: ['Ultra-lightweight', 'Biodegradable', 'Cost-effective', 'Shock absorption']
        },
        {
          name: 'Flax Fiber Composite',
          price: 279,
          description: 'Natural flax fibers for enhanced durability and performance',
          benefits: ['Enhanced durability', 'Natural damping', 'Renewable', 'Professional grade']
        }
      ],
      specs: {
        flightTime: '28 minutes',
        range: '2.5 km',
        weight: '165g',
        maxSpeed: '45 km/h',
        operatingTemp: '0°C to 40°C',
        windResistance: '20 km/h',
        batteryType: 'LiPo 2S 1800mAh',
        chargingTime: '75 minutes'
      },
      features: [
        {
          icon: Camera,
          title: '4K Camera',
          description: 'Ultra-high definition camera with optical zoom capabilities'
        },
        {
          icon: Shield,
          title: 'Obstacle Avoidance',
          description: 'Advanced sensors for automatic obstacle detection and avoidance'
        },
        {
          icon: Navigation,
          title: 'Follow Mode',
          description: 'Intelligent tracking system for automatic subject following'
        },
        {
          icon: Eye,
          title: 'Night Vision',
          description: 'Low-light imaging capabilities for 24/7 surveillance'
        }
      ],
      applications: ['Aerial Photography', 'Property Surveillance', 'Research Projects', 'Educational Use'],
      inStock: true,
      isNew: false,
      description: 'The FV Eagle Quad combines cutting-edge quadcopter technology with sustainable materials. Perfect for both professional surveillance and civilian applications, offering exceptional value and performance.'
    },
    'fv-carrier-payload': {
      id: 'fv-carrier-payload',
      name: 'FV Carrier Payload',
      category: 'tactical',
      type: 'Payload Delivery',
      price: 199,
      originalPrice: 249,
      images: [
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDd6NmlmZ2d6YmZhc2R3dHFkOXBwYWwwdTVqN3JseXU3OHRmY2JlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QURevAwNku3IYI1wWz/giphy.gif',
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      materials: [
        {
          name: 'Flax Fiber Composite',
          price: 199,
          description: 'Natural flax fibers optimized for payload carrying capacity',
          benefits: ['High strength', 'Lightweight', 'Sustainable', 'Flexible design']
        },
        {
          name: '3D Printed PET',
          price: 219,
          description: 'Recycled PET plastic for modular and customizable design',
          benefits: ['Modular design', 'Easy customization', 'Recycled material', 'Rapid prototyping']
        }
      ],
      specs: {
        flightTime: '25 minutes',
        range: '2 km',
        weight: '175g',
        maxSpeed: '40 km/h',
        operatingTemp: '-5°C to 50°C',
        windResistance: '18 km/h',
        batteryType: 'LiPo 3S 1500mAh',
        chargingTime: '60 minutes'
      },
      features: [
        {
          icon: Shield,
          title: 'Modular Payload Bay',
          description: 'Interchangeable payload compartments for various mission requirements'
        },
        {
          icon: Navigation,
          title: 'Precision Drop',
          description: 'GPS-guided payload delivery with pinpoint accuracy'
        },
        {
          icon: Wifi,
          title: 'GPS Waypoints',
          description: 'Pre-programmed flight paths for autonomous delivery missions'
        },
        {
          icon: Battery,
          title: 'Return to Base',
          description: 'Automatic return after payload delivery with battery monitoring'
        }
      ],
      applications: ['Emergency Supply Delivery', 'Research Sample Collection', 'Small Package Delivery', 'Medical Supply Transport'],
      inStock: true,
      isNew: false,
      description: 'The FV Carrier is designed specifically for payload delivery missions. With its modular design and precision drop capabilities, it\'s perfect for emergency supplies, research applications, and small package delivery.'
    },
    'fv-rocket-speed': {
      id: 'fv-rocket-speed',
      name: 'FV Rocket Speed',
      category: 'high-speed',
      type: 'Racing/Speed',
      price: 399,
      originalPrice: 449,
      images: [
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExajJ4YTlnODRvZHNrcmNoc3hvZDZ3cDU4ajhpaTU4anp4dWh5OGJvNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hR0jSqWtRNovStbMep/giphy.gif',
        'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      materials: [
        {
          name: 'Aluminum Composite',
          price: 399,
          description: 'High-strength aluminum composite optimized for high-speed flight',
          benefits: ['Maximum strength', 'Heat resistance', 'Aerodynamic', 'Professional grade']
        }
      ],
      specs: {
        flightTime: '15 minutes',
        range: '1.8 km',
        weight: '160g',
        maxSpeed: '120 km/h',
        operatingTemp: '-20°C to 60°C',
        windResistance: '30 km/h',
        batteryType: 'LiPo 4S 1200mAh',
        chargingTime: '45 minutes'
      },
      features: [
        {
          icon: Zap,
          title: 'Helical Gear System',
          description: 'Advanced propulsion system with dual helical gear sets for maximum speed'
        },
        {
          icon: Shield,
          title: 'Foldable Props',
          description: 'Aerodynamic foldable propellers for reduced drag and portability'
        },
        {
          icon: Battery,
          title: 'Speed Mode',
          description: 'High-performance mode optimized for maximum velocity and agility'
        },
        {
          icon: Navigation,
          title: 'Aerodynamic Design',
          description: 'Rocket-inspired body shape for minimal air resistance'
        }
      ],
      applications: ['Drone Racing', 'Speed Testing', 'Demonstration Flights', 'Performance Evaluation'],
      inStock: true,
      isNew: true,
      description: 'The FV Rocket Speed pushes the boundaries of sustainable drone technology. With its innovative helical gear propulsion system and aerodynamic rocket design, it achieves unprecedented speeds while maintaining our eco-friendly principles.'
    },
    'fv-tube-coax': {
      id: 'fv-tube-coax',
      name: 'FV Tube Coax',
      category: 'surveillance-tube',
      type: 'Coaxial Design',
      price: 329,
      originalPrice: 379,
      images: [
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDd6NmlmZ2d6YmZhc2R3dHFkOXBwYWwwdTVqN3JseXU3OHRmY2JlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QURevAwNku3IYI1wWz/giphy.gif',
        'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      materials: [
        {
          name: '3D Printed PET',
          price: 329,
          description: 'Recycled PET optimized for the unique tube design and coaxial system',
          benefits: ['Complex geometry', 'Lightweight', 'Customizable', 'Eco-friendly']
        },
        {
          name: 'Flax Fiber Composite',
          price: 359,
          description: 'Natural flax fibers for enhanced structural integrity in tube design',
          benefits: ['Superior strength', 'Vibration damping', 'Natural material', 'Professional grade']
        }
      ],
      specs: {
        flightTime: '40 minutes',
        range: '3.5 km',
        weight: '170g',
        maxSpeed: '50 km/h',
        operatingTemp: '-10°C to 50°C',
        windResistance: '22 km/h',
        batteryType: 'LiPo 3S 2000mAh',
        chargingTime: '80 minutes'
      },
      features: [
        {
          icon: Shield,
          title: 'Coaxial Propellers',
          description: 'Counter-rotating propeller system for enhanced stability and efficiency'
        },
        {
          icon: Eye,
          title: 'Tube Design',
          description: 'Unique cylindrical form factor for improved aerodynamics and stealth'
        },
        {
          icon: Battery,
          title: 'Stealth Mode',
          description: 'Reduced acoustic and visual signature for covert operations'
        },
        {
          icon: Wifi,
          title: 'Extended Range',
          description: 'Enhanced communication range with optimized antenna placement'
        }
      ],
      applications: ['Covert Surveillance', 'Urban Monitoring', 'Research Applications', 'Stealth Operations'],
      inStock: true,
      isNew: true,
      description: 'The FV Tube Coax features a revolutionary cylindrical design with coaxial propellers. This unique configuration provides exceptional stability and stealth capabilities, making it ideal for covert surveillance operations.'
    }
  };

  const product = products[productId as keyof typeof products];

  const stockStatus = StockManager.getStockStatus(productId || '');
  const isInStock = stockInfo.available > 0;

  useEffect(() => {
    if (product && product.materials.length > 0) {
      setSelectedMaterial(product.materials[0].name);
    }
  }, [product]);

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const getSelectedMaterialData = () => {
    if (!product || !product.materials) return null;
    return product.materials.find(m => m.name === selectedMaterial) || product.materials[0];
  };

  const getCurrentPrice = () => {
    const materialData = getSelectedMaterialData();
    if (materialData && materialData.price) {
      return materialData.price;
    }
    return typeof product?.price === 'number' ? product.price : 0;
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-xl text-gray-700 mb-8">The requested product could not be found.</p>
            <Link to="/shop" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Back to Shop
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
        <Link to="/shop" className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Interactive Image Gallery */}
          <div className="order-2 lg:order-1">
            <div className="relative h-96 overflow-hidden rounded-2xl shadow-lg bg-gray-100 mb-4">
              <img 
                src={product.images[currentImageIndex]} 
                alt={`${product.name} - View ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    NEW
                  </span>
                )}
                {product.inStock ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Pre-Order
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex space-x-3 justify-center">
              {product.images.map((image, index) => (
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
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Specs - Mobile: Below images, Desktop: Right side */}
          <div className="order-3 lg:order-2 lg:hidden">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Flight Time</p>
                    <p className="text-gray-700">{product.specs.flightTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Range</p>
                    <p className="text-gray-700">{product.specs.range}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Weight</p>
                    <p className="text-gray-700">{product.specs.weight}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Max Speed</p>
                    <p className="text-gray-700">{product.specs.maxSpeed}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Information */}
          <div className="order-1 lg:order-3">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                {product.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isInStock 
                  ? stockInfo.available <= 2 
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                <Package className="w-4 h-4 inline mr-1" />
                {stockStatus.text}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Price Display */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-red-500">€{getCurrentPrice()}</span>
                {product.originalPrice && getCurrentPrice() !== product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">€{product.originalPrice}</span>
                )}
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            {/* Material Selection */}
            {product.materials && product.materials.length > 1 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Material</h3>
                <div className="space-y-3">
                  {product.materials.map((material) => (
                    <div
                      key={material.name}
                      onClick={() => setSelectedMaterial(material.name)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedMaterial === material.name
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{material.name}</h4>
                        <span className="text-lg font-bold text-red-500">€{material.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {material.benefits.map((benefit, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 rounded text-xs" style={{backgroundColor: '#FFFF00', color: '#000000'}}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              {isInStock ? (
                <Link 
                  to={`/checkout/${product.id}?material=${encodeURIComponent(selectedMaterial || (product.materials[0]?.name || ''))}`}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now - €{getCurrentPrice()}</span>
                </Link>
              ) : (
                <button 
                  disabled
                  className="flex-1 bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Out of Stock</span>
                </button>
              )}
              <a 
                href={`mailto:info@fvdrones.com?subject=Product Inquiry - ${product.name}`}
                className="border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 px-8 py-4 rounded-lg font-semibold transition-colors text-center"
              >
                Contact Us
              </a>
            </div>

            {/* Quick Specs */}
            <div className="bg-gray-50 rounded-xl p-6 hidden lg:block">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Flight Time</p>
                    <p className="text-gray-700">{product.specs.flightTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Range</p>
                    <p className="text-gray-700">{product.specs.range}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Weight</p>
                    <p className="text-gray-700">{product.specs.weight}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">Max Speed</p>
                    <p className="text-gray-700">{product.specs.maxSpeed}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Information */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Stock Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Available:</span>
                  <span className={`ml-2 font-semibold ${stockStatus.color}`}>
                    {stockInfo.available} units
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Status:</span>
                  <span className={`ml-2 font-semibold ${stockStatus.color}`}>
                    {isInStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              {stockInfo.available <= 2 && stockInfo.available > 0 && (
                <p className="text-orange-700 text-sm mt-2 font-medium">
                  ⚠️ Limited stock - order soon to avoid disappointment!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Specifications */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key}>
                <p className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {product.features.map((feature, index) => {
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
            {product.applications.map((app, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                <p className="font-semibold text-gray-900">{app}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Material Information */}
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Sustainable Materials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {product.materials.map((material, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{material.name}</h3>
                <p className="text-gray-700 mb-4">{material.description}</p>
                <div className="flex flex-wrap gap-2">
                  {material.benefits.map((benefit, benefitIndex) => (
                    <span 
                      key={benefitIndex}
                      className="px-3 py-1 rounded-full text-sm" style={{backgroundColor: '#FFFF00', color: '#000000'}}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;