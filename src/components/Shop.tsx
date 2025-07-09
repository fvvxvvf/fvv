import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Eye, Clock, Shield, Zap, Filter, Search, Settings, Lock } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { StockManager } from '../utils/stockManager';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import { AdminSecurity } from '../utils/adminSecurity';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [stockData, setStockData] = useState<{[key: string]: any}>({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    loadStockData();
    
    // Check if already authenticated
    if (AdminSecurity.isAuthenticated()) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const loadStockData = () => {
    const data = StockManager.getAllStock();
    setStockData(data);
  };

  // Refresh stock data when returning from admin
  useEffect(() => {
    if (!showAdmin) {
      loadStockData();
    }
  }, [showAdmin]);

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setShowAdmin(false);
  };

  const products = [
    // Surveillance Aircraft Models
    {
      id: 'fv-hawk-composite',
      name: 'FV Hawk Surveillance',
      category: 'surveillance-aircraft',
      type: 'Helicopter Style',
      price: 299,
      originalPrice: 349,
      images: [
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDd6NmlmZ2d6YmZhc2R3dHFkOXBwYWwwdTVqN3JseXU3OHRmY2JlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QURevAwNku3IYI1wWz/giphy.gif',
        'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      materials: [
        { name: 'Aluminum Composite' },
        { name: 'Flax Fiber Composite' }
      ],
      specs: {
        flightTime: '35 minutes',
        range: '3 km',
        weight: '185g',
        maxSpeed: '55 km/h'
      },
      features: ['HD Camera', 'Real-time Streaming', 'GPS Return', 'Silent Mode'],
      applications: ['Security', 'Monitoring', 'Inspection'],
      isNew: true
    },
    {
      id: 'fv-eagle-quad',
      name: 'FV Eagle Quad',
      category: 'surveillance-quad',
      type: 'Quadcopter',
      price: 249,
      originalPrice: 299,
      images: [
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExajJ4YTlnODRvZHNrcmNoc3hvZDZ3cDU4ajhpaTU4anp4dWh5OGJvNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hR0jSqWtRNovStbMep/giphy.gif',
        'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      materials: [
        { name: 'Aluminum Composite' },
        { name: 'Flax Fiber Composite' }
      ],
      specs: {
        flightTime: '28 minutes',
        range: '2.5 km',
        weight: '165g',
        maxSpeed: '45 km/h'
      },
      features: ['4K Camera', 'Obstacle Avoidance', 'Follow Mode', 'Night Vision'],
      applications: ['Surveillance', 'Photography', 'Research'],
      isNew: false
    },
    // Tactical Models (Sub-200g)
    {
      id: 'fv-stinger-taser',
      name: 'FV Stinger Taser',
      category: 'tactical',
      type: 'Taser Deployment',
      price: 'Request Quote',
      images: ['https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=800'],
      materials: [
        { name: 'Aluminum Composite' }
      ],
      specs: {
        flightTime: '20 minutes',
        range: '1.5 km',
        weight: '195g',
        maxSpeed: '60 km/h'
      },
      features: ['Taser Deployment', 'Precision Targeting', 'Emergency Stop', 'Encrypted Comms'],
      applications: ['Law Enforcement', 'Security', 'Crowd Control'],
      isNew: true,
      restricted: true
    },
    {
      id: 'fv-guardian-rubber',
      name: 'FV Guardian Rubber',
      category: 'tactical',
      type: 'Non-Lethal',
      price: 'Request Quote',
      images: ['https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800'],
      materials: [
        { name: 'Aluminum Composite' }
      ],
      specs: {
        flightTime: '18 minutes',
        range: '1.2 km',
        weight: '190g',
        maxSpeed: '65 km/h'
      },
      features: ['Rubber Bullet System', 'Multi-Shot Capability', 'Target Lock', 'Safe Mode'],
      applications: ['Riot Control', 'Perimeter Defense', 'Training'],
      isNew: true,
      restricted: true
    },
    {
      id: 'fv-carrier-payload',
      name: 'FV Carrier Payload',
      category: 'tactical',
      type: 'Payload Delivery',
      price: 199,
      originalPrice: 249,
      images: [
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDd6NmlmZ2d6YmZhc2R3dHFkOXBwYWwwdTVqN3JseXU3OHRmY2JlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QURevAwNku3IYI1wWz/giphy.gif',
        'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=1200'
      ],
      materials: [
        { name: 'Aluminum Composite' },
        { name: 'Flax Fiber Composite' }
      ],
      specs: {
        flightTime: '25 minutes',
        range: '2 km',
        weight: '175g',
        maxSpeed: '40 km/h'
      },
      features: ['Modular Payload Bay', 'Precision Drop', 'GPS Waypoints', 'Return to Base'],
      applications: ['Delivery', 'Emergency Supply', 'Research'],
      isNew: false
    },
    // High-Speed Model
    {
      id: 'fv-rocket-speed',
      name: 'FV Rocket Speed',
      category: 'high-speed',
      type: 'Racing/Speed',
      price: 399,
      originalPrice: 449,
      images: ['https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=800'],
      materials: [
        { name: 'Aluminum Composite' }
      ],
      specs: {
        flightTime: '15 minutes',
        range: '1.8 km',
        weight: '160g',
        maxSpeed: '120 km/h'
      },
      features: ['Helical Gear System', 'Foldable Props', 'Speed Mode', 'Aerodynamic Design'],
      applications: ['Racing', 'Speed Testing', 'Demonstration'],
      isNew: true
    },
    // Tube Surveillance
    {
      id: 'fv-tube-coax',
      name: 'FV Tube Coax',
      category: 'surveillance-tube',
      type: 'Coaxial Design',
      price: 329,
      originalPrice: 379,
      images: ['https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=800'],
      materials: [
        { name: '3D Printed PET' },
        { name: 'Flax Fiber Composite' }
      ],
      specs: {
        flightTime: '40 minutes',
        range: '3.5 km',
        weight: '170g',
        maxSpeed: '50 km/h'
      },
      features: ['Coaxial Propellers', 'Tube Design', 'Stealth Mode', 'Extended Range'],
      applications: ['Covert Surveillance', 'Urban Monitoring', 'Research'],
      isNew: true
    },
    // Prototype Models (Larger)
    {
      id: 'fv-titan-ic',
      name: 'FV Titan IC Engine',
      category: 'prototype',
      type: 'IC Engine Prototype',
      price: 'Request Quote',
      images: ['https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=800'],
      materials: [
        { name: 'Aluminum Composite' }
      ],
      specs: {
        flightTime: '90 minutes',
        range: '15 km',
        weight: '1.8 kg',
        maxSpeed: '85 km/h'
      },
      features: ['IC Engine', 'Heavy Payload', 'Long Range', 'Professional Grade'],
      applications: ['Research', 'Long Missions', 'Heavy Payload'],
      isNew: true,
      experimental: true
    },
    {
      id: 'fv-atlas-heavy',
      name: 'FV Atlas Heavy',
      category: 'prototype',
      type: 'Heavy Payload',
      price: 'Request Quote',
      images: ['https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=800'],
      materials: [
        { name: 'Aluminum Composite' },
        { name: 'Flax Fiber Composite' }
      ],
      specs: {
        flightTime: '75 minutes',
        range: '12 km',
        weight: '2.2 kg',
        maxSpeed: '70 km/h'
      },
      features: ['Heavy Lift', 'Modular Design', 'Extended Battery', 'Professional Control'],
      applications: ['Heavy Delivery', 'Industrial', 'Research'],
      isNew: true,
      experimental: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'surveillance-aircraft', name: 'Surveillance Aircraft', count: products.filter(p => p.category === 'surveillance-aircraft').length },
    { id: 'surveillance-quad', name: 'Surveillance Quad', count: products.filter(p => p.category === 'surveillance-quad').length },
    { id: 'tactical', name: 'Tactical (Sub-200g)', count: products.filter(p => p.category === 'tactical').length },
    { id: 'high-speed', name: 'High-Speed', count: products.filter(p => p.category === 'high-speed').length },
    { id: 'surveillance-tube', name: 'Tube Design', count: products.filter(p => p.category === 'surveillance-tube').length },
    { id: 'prototype', name: 'Prototypes', count: products.filter(p => p.category === 'prototype').length }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.applications.some(app => app.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'under-200' && typeof product.price === 'number' && product.price < 200) ||
                        (priceRange === '200-300' && typeof product.price === 'number' && product.price >= 200 && product.price < 300) ||
                        (priceRange === '300-500' && typeof product.price === 'number' && product.price >= 300 && product.price <= 500) ||
                        (priceRange === 'quote' && product.price === 'Request Quote');
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Show admin login/panel
  if (showAdmin) {
    if (isAdminAuthenticated) {
      return <AdminPanel onLogout={handleAdminLogout} />;
    } else {
      return (
        <AdminLogin 
          onLoginSuccess={handleAdminLoginSuccess}
          onBack={() => setShowAdmin(false)}
        />
      );
    }
  }

  // Legacy admin view (remove this section)
  if (false) { // Disabled legacy admin
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => setShowAdmin(false)}
            className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shop
          </button>
          {/* <StockAdmin /> */}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        {/* Admin Access Button */}
        <div className="flex justify-end mb-4">
          {/* Admin access button removed - use /admin URL directly */}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FV Drones Shop</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover our complete range of sustainable UAV technology. From civilian surveillance 
            to tactical applications, find the perfect drone for your needs.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, type, or application..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Prices</option>
                <option value="under-200">Under €200</option>
                <option value="200-300">€200 - €300</option>
                <option value="300-500">€300 - €500</option>
                <option value="quote">Request Quote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const stockInfo = StockManager.getProductStock(product.id);
            const stockStatus = StockManager.getStockStatus(product.id);
            const isInStock = stockInfo.available > 0;
            
            return (
              <div 
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 group"
              >
                {/* Product Image */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        NEW
                      </span>
                    )}
                    {product.restricted && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        RESTRICTED
                      </span>
                    )}
                    {product.experimental && (
                      <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        PROTOTYPE
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isInStock 
                        ? stockInfo.available <= 2 
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isInStock ? stockStatus.text : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <div className="mb-2">
                    <h3 className="text-md font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.type}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    {typeof product.price === 'number' ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-500">€{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">€{product.originalPrice}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-md font-bold text-gray-900">{product.price}</span>
                    )}
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-2 gap-1 mb-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-700">{product.specs.flightTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-700">{product.specs.range}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-700">{product.specs.weight}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-700">{product.specs.maxSpeed}</span>
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">Available Materials:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.materials.map((material, index) => (
                        <span 
                          key={index}
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
                        >
                          {material.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <Link 
                      to={`/product/${product.id}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-2 rounded font-medium transition-colors text-center text-xs flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Link>
                    
                    {typeof product.price === 'number' && isInStock ? (
                      <Link 
                        to={`/checkout/${product.id}`}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded font-medium transition-colors text-center text-xs flex items-center justify-center space-x-1"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Buy</span>
                      </Link>
                    ) : (
                      <Link 
                        to={`/quote/${product.id}`}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded font-medium transition-colors text-center text-xs"
                      >
                        Quote
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <Filter className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Don't see exactly what you need? Our engineering team can develop custom UAV solutions 
            tailored to your specific requirements using our sustainable materials.
          </p>
          <Link 
            to="/#contact"
            className="text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors" 
            style={{backgroundColor: '#FFFF00'}} 
            onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#CCCC00'}} 
            onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = '#FFFF00'}}
          >
            Contact for Custom Project
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;