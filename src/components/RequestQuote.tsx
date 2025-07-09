import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const RequestQuote = () => {
  const { modelName } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    quantity: '1',
    intendedUse: '',
    timeline: '',
    additionalRequirements: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const models = {
    'sentinel-pro': 'Sentinel Pro',
    'recon-elite': 'Recon Elite',
    'ecoscout': 'EcoScout',
    'prototype-x1': 'Prototype X1'
  };

  const modelDisplayName = models[modelName as keyof typeof models] || 'Unknown Model';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link with quote request data
    const subject = encodeURIComponent(`Quote Request: ${modelDisplayName}`);
    const body = encodeURIComponent(
      `QUOTE REQUEST FOR ${modelDisplayName.toUpperCase()}\n\n` +
      `Contact Information:\n` +
      `Name: ${formData.firstName} ${formData.lastName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Company: ${formData.company}\n\n` +
      `Project Details:\n` +
      `Quantity: ${formData.quantity}\n` +
      `Intended Use: ${formData.intendedUse}\n` +
      `Timeline: ${formData.timeline}\n` +
      `Budget Range: ${formData.budget}\n\n` +
      `Additional Requirements:\n${formData.additionalRequirements}\n\n` +
      `Please provide a detailed quote including pricing, delivery timeline, and any additional services available.`
    );
    
    const mailtoLink = `mailto:info@fvdrones.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="bg-gray-50 rounded-2xl shadow-xl p-8 border border-gray-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Quote Request Sent!</h1>
              <p className="text-gray-700 mb-6">
                Your email client should have opened with your quote request for the {modelDisplayName}. 
                If not, please send your request manually to info@fvdrones.com.
              </p>
              <p className="text-gray-700 mb-8">
                We'll review your requirements and get back to you within 24 hours with a detailed quote.
              </p>
              <div className="flex gap-4 justify-center">
                <Link 
                  to={`/model/${modelName}`}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Back to Model
                </Link>
                <Link 
                  to="/"
                  className="border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse More Models
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to={`/model/${modelName}`} 
          className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to {modelDisplayName}
        </Link>

        <div className="bg-gray-50 rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Quote</h1>
            <p className="text-xl text-gray-700">Get a personalized quote for the {modelDisplayName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    <option value="1">1 Unit</option>
                    <option value="2-5">2-5 Units</option>
                    <option value="6-10">6-10 Units</option>
                    <option value="11-25">11-25 Units</option>
                    <option value="25+">25+ Units</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline *
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Timeline</option>
                    <option value="immediate">Immediate (1-2 weeks)</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="2-3-months">2-3 months</option>
                    <option value="6-months">Within 6 months</option>
                    <option value="flexible">Flexible timeline</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="intendedUse" className="block text-sm font-medium text-gray-700 mb-2">
                    Intended Use *
                  </label>
                  <textarea
                    id="intendedUse"
                    name="intendedUse"
                    rows={3}
                    value={formData.intendedUse}
                    onChange={handleInputChange}
                    required
                    placeholder="Please describe how you plan to use the drone..."
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="under-5k">Under €5,000</option>
                    <option value="5k-10k">€5,000 - €10,000</option>
                    <option value="10k-25k">€10,000 - €25,000</option>
                    <option value="25k-50k">€25,000 - €50,000</option>
                    <option value="50k+">€50,000+</option>
                    <option value="discuss">Prefer to discuss</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <label htmlFor="additionalRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements or Questions
              </label>
              <textarea
                id="additionalRequirements"
                name="additionalRequirements"
                rows={4}
                value={formData.additionalRequirements}
                onChange={handleInputChange}
                placeholder="Any specific requirements, customizations, or questions..."
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Sending Quote Request...' : 'Request Quote'}</span>
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RequestQuote;