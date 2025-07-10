import React from 'react';
import { Plane, Shield, Eye, Zap, Clock, Users, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
++
const Models = () => {
  const [showCustomProjectForm, setShowCustomProjectForm] = React.useState(false);

  const featuredModels = [
    {
      name: 'FV Eagle Quad',
      category: 'Surveillance Quad',
      image: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800',
      material: 'Paper Composite',
      specs: {
        flightTime: '28 minutes',
        range: '2.5 km',
        payload: '165g',
        maxSpeed: '45 km/h'
      },
      features: ['4K Camera', 'Obstacle Avoidance', 'Follow Mode', 'Night Vision'],
      applications: ['Surveillance', 'Photography', 'Research'],
      price: '€249',
      shopId: 'fv-eagle-quad'
    },
    {
      name: 'FV Hawk Surveillance',
      category: 'Surveillance Aircraft',
      image: 'https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=800',
      material: 'Flax Fiber Composite',
      specs: {
        flightTime: '35 minutes',
        range: '3 km',
        payload: '185g',
        maxSpeed: '55 km/h'
      },
      features: ['HD Camera', 'Real-time Streaming', 'GPS Return', 'Silent Mode'],
      applications: ['Security', 'Monitoring', 'Inspection'],
      price: '€299',
      shopId: 'fv-hawk-composite'
    },
    {
      name: 'FV Rocket Speed',
      category: 'High-Speed',
      image: 'https://images.pexels.com/photos/724921/pexels-photo-724921.jpeg?auto=compress&cs=tinysrgb&w=800',
      material: 'Aluminum Composite',
      specs: {
        flightTime: '15 minutes',
        range: '1.8 km',
        payload: '160g',
        maxSpeed: '120 km/h'
      },
      features: ['Helical Gear System', 'Foldable Props', 'Speed Mode', 'Aerodynamic Design'],
      applications: ['Racing', 'Speed Testing', 'Demonstration'],
      price: '€399',
      shopId: 'fv-rocket-speed'
    },
    {
      name: 'FV Tube Coax',
      category: 'Surveillance Tube',
      image: 'https://images.pexels.com/photos/2876511/pexels-photo-2876511.jpeg?auto=compress&cs=tinysrgb&w=800',
      material: '3D Printed PET',
      specs: {
        flightTime: '40 minutes',
        range: '3.5 km',
        payload: '170g',
        maxSpeed: '50 km/h'
      },
      features: ['Coaxial Propellers', 'Tube Design', 'Stealth Mode', 'Extended Range'],
      applications: ['Covert Surveillance', 'Urban Monitoring', 'Research'],
      price: '€329',
      shopId: 'fv-tube-coax'
    }
  ];

  const handleCustomProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const projectDetails = formData.get('projectDetails') as string;
    const contactInfo = formData.get('contactInfo') as string;

    const subject = encodeURIComponent('Custom Project Inquiry - FV Drones');
    const body = encodeURIComponent(
      `CUSTOM PROJECT INQUIRY\n\n` +
        `Contact Information: ${contactInfo}\n\n` +
        `Project Details:\n${projectDetails}\n\n` +
        `Please contact me to discuss this custom project opportunity.`
    );

    const mailtoLink = `mailto:info@fvdrones.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    setShowCustomProjectForm(false);
  };

  return (
    <section id="models" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Alpha Stage Models - Available Now
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
            Our surveillance drones are currently in alpha stage and available for purchase. 
            These models are fully functional and ready for deployment.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-4xl mx-auto">
            <p className="text-yellow-800 font-semibold">
              🎁 <strong>Special Offer:</strong> Alpha buyers will receive the final production model for FREE when it's released, 
              as our gift for supporting FV Drones during development!
            </p>
          </div>
        </div>

        {/* Responsive grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {featuredModels.map((model, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group h-fit"
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={model.image} 
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {model.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-gray-900 px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FFFF00' }}>
                    {model.material}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{model.name}</h3>
                  <div className="text-right">
                    <p className="text-md font-bold text-red-500">{model.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-3 w-3 text-gray-600" />
                    <span className="text-gray-700">{model.specs.flightTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Eye className="h-3 w-3 text-gray-600" />
                    <span className="text-gray-700">{model.specs.range}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="h-3 w-3 text-gray-600" />
                    <span className="text-gray-700">{model.specs.payload}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="h-3 w-3 text-gray-600" />
                    <span className="text-gray-700">{model.specs.maxSpeed}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">Key Features</h4>
                  <ul className="space-y-0.5">
                    {model.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">Applications</h4>
                  <div className="text-xs text-gray-700">
                    {model.applications.map((app, appIndex) => (
                      <span key={appIndex}>
                        {app}
                        {appIndex < model.applications.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link 
                    to={`/product/${model.shopId}`}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center text-sm"
                  >
                    View Details
                  </Link>
                  <Link 
                    to={`/checkout/${model.shopId}`}
                    className="flex-1 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 py-2 px-3 rounded-lg font-semibold transition-colors text-center text-sm"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shop All Models Button */}
        <div className="mt-6 text-center">
          <Link 
            to="/shop"
            className="inline-flex items-center text-gray-900 px-8 py-4 rounded-lg font-semibold transition-colors text-lg" 
            style={{ backgroundColor: '#FFFF00' }} 
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#CCCC00'; }} 
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFF00'; }}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Shop All Models
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Development Stage - Custom Solutions</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We're actively developing new models and can create custom solutions for early supporters. 
              Join us in revolutionizing sustainable UAV technology!
            </p>
            <button 
              onClick={() => setShowCustomProjectForm(true)}
              className="text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors" 
              style={{ backgroundColor: '#FFFF00' }} 
              onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = '#CCCC00'; }} 
              onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = '#FFFF00'; }}
            >
              Join Development Program
            </button>
          </div>
        </div>
      </div>

      {/* Custom Project Modal */}
      {showCustomProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Project Inquiry</h3>
            <form onSubmit={handleCustomProjectSubmit} className="space-y-4">
              <div>
                <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Contact Information *
                </label>
                <input
                  type="text"
                  id="contactInfo"
                  name="contactInfo"
                  required
                  placeholder="Name, email, phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label htmlFor="projectDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Details *
                </label>
                <textarea
                  id="projectDetails"
                  name="projectDetails"
                  rows={4}
                  required
                  placeholder="Describe your custom project requirements..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Send Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomProjectForm(false)}
                  className="flex-1 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Models;
