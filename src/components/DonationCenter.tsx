import React, { useState, useEffect } from 'react';
import { Heart, Gift, Printer, Package, Euro, CreditCard, Send, CheckCircle } from 'lucide-react';
import { SecurityManager } from '../utils/security';
import SecurePayment from './SecurePayment';

const DonationCenter = () => {
  const [donationType, setDonationType] = useState<'money' | 'equipment'>('money');
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    name: '',
    email: '',
    message: '',
    equipmentType: '',
    equipmentDescription: '',
    contactInfo: ''
  });

  // Scroll to top when component mounts or when returning from payment
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset to top when returning from payment or submission
  useEffect(() => {
    if (!showPayment && !isSubmitted) {
      window.scrollTo(0, 0);
    }
  }, [showPayment, isSubmitted]);

  const donationAmounts = [50, 100, 250, 500, 1000];
  const equipmentTypes = [
    { id: '3d-printer', name: '3D Printers', icon: Printer, description: 'FDM/SLA printers for prototyping' },
    { id: 'materials', name: 'Raw Materials', icon: Package, description: 'PET filament, paper, aluminum, flax fiber' },
    { id: 'electronics', name: 'Electronics', icon: Gift, description: 'Flight controllers, sensors, cameras' },
    { id: 'tools', name: 'Tools & Equipment', icon: Gift, description: 'Manufacturing and testing equipment' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: SecurityManager.sanitizeInput(value)
    }));
  };

  const handleMoneyDonation = () => {
    if (!formData.amount || !SecurityManager.validateAmount(formData.amount)) {
      alert('Please enter a valid donation amount');
      return;
    }

    if (!SecurityManager.validateEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setShowPayment(true);
  };

  const handleEquipmentDonation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!SecurityManager.validateEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Create mailto link for equipment donation
    const subject = encodeURIComponent('Equipment Donation Offer - FV Drones');
    const body = encodeURIComponent(
      `EQUIPMENT DONATION OFFER\n\n` +
      `Donor Information:\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Contact Info: ${formData.contactInfo}\n\n` +
      `Equipment Details:\n` +
      `Type: ${formData.equipmentType}\n` +
      `Description: ${formData.equipmentDescription}\n\n` +
      `Message: ${formData.message}\n\n` +
      `Please contact me to arrange the equipment donation.`
    );
    
    const mailtoLink = `mailto:donations@fvdrones.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    setIsSubmitted(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    // Send donation confirmation email
    const subject = encodeURIComponent('Donation Confirmation - FV Drones');
    const body = encodeURIComponent(
      `DONATION CONFIRMATION\n\n` +
      `Transaction ID: ${transactionId}\n` +
      `Donor: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Amount: €${formData.amount}\n` +
      `Message: ${formData.message}\n\n` +
      `Thank you for supporting sustainable drone technology!`
    );
    
    const mailtoLink = `mailto:donations@fvdrones.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    setShowPayment(false);
    setIsSubmitted(true);
  };

  const handleBackToDonation = () => {
    setShowPayment(false);
    // Scroll to top when returning to donation form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  if (showPayment) {
    return (
      <div className="max-w-2xl mx-auto">
        <SecurePayment
          amount={parseInt(formData.amount)}
          description={`Donation to FV Drones - ${formData.name}`}
          onSuccess={handlePaymentSuccess}
          onCancel={handleBackToDonation}
        />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-700 mb-6">
            {donationType === 'money' 
              ? 'Your donation has been processed successfully. You will receive a confirmation email shortly.'
              : 'Your equipment donation offer has been sent. We will contact you soon to arrange the donation.'
            }
          </p>
          <button 
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                amount: '',
                name: '',
                email: '',
                message: '',
                equipmentType: '',
                equipmentDescription: '',
                contactInfo: ''
              });
              // Scroll to top when making another donation
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-12 h-12 text-red-500 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">Support Our Mission</h1>
        </div>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Help us revolutionize the drone industry through sustainable innovation. 
          Your support enables us to develop cutting-edge UAV technology from recycled materials.
        </p>
      </div>

      {/* Donation Type Selection */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <button
          onClick={() => setDonationType('money')}
          className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
            donationType === 'money'
              ? 'border-red-500 bg-red-50 shadow-lg'
              : 'border-gray-300 hover:border-red-300 hover:shadow-md'
          }`}
        >
          <Euro className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Financial Donation</h3>
          <p className="text-gray-700">
            Support our research and development with a monetary contribution. 
            Every euro helps us advance sustainable drone technology.
          </p>
        </button>

        <button
          onClick={() => setDonationType('equipment')}
          className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
            donationType === 'equipment'
              ? 'border-red-500 bg-red-50 shadow-lg'
              : 'border-gray-300 hover:border-red-300 hover:shadow-md'
          }`}
        >
          <Gift className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Equipment Donation</h3>
          <p className="text-gray-700">
            Donate 3D printers, materials, or other equipment to directly support 
            our manufacturing and prototyping capabilities.
          </p>
        </button>
      </div>

      {/* Money Donation Form */}
      {donationType === 'money' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Financial Donation</h2>
          
          <div className="space-y-6">
            {/* Preset Amounts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Amount or Enter Custom
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {donationAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                    className={`p-3 border-2 rounded-lg font-semibold transition-colors ${
                      formData.amount === amount.toString()
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-gray-300 hover:border-red-300 text-gray-700'
                    }`}
                  >
                    €{amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Custom amount"
                min="1"
                max="1000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Donor Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="Tell us what motivates your donation..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
              ></textarea>
            </div>

            <button
              onClick={handleMoneyDonation}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Secure Payment</span>
            </button>
          </div>
        </div>
      )}

      {/* Equipment Donation Form */}
      {donationType === 'equipment' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Donate Equipment</h2>
          
          <form onSubmit={handleEquipmentDonation} className="space-y-6">
            {/* Equipment Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Equipment Type *
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {equipmentTypes.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, equipmentType: type.name }))}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        formData.equipmentType === type.name
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-300'
                      }`}
                    >
                      <IconComponent className="w-6 h-6 text-red-500 mb-2" />
                      <h4 className="font-semibold text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Equipment Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Description *
              </label>
              <textarea
                name="equipmentDescription"
                value={formData.equipmentDescription}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Please describe the equipment you'd like to donate (model, condition, specifications, etc.)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
              ></textarea>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information *
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                required
                placeholder="Phone number, address, or preferred contact method"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional information about the donation..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Submit Equipment Donation</span>
            </button>
          </form>
        </div>
      )}

      {/* Impact Information */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Impact</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-red-500 p-4 rounded-full inline-flex mb-4">
              <Printer className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Research & Development</h4>
            <p className="text-gray-700">Fund new sustainable materials research and prototype development</p>
          </div>
          <div className="text-center">
            <div className="bg-red-500 p-4 rounded-full inline-flex mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Manufacturing</h4>
            <p className="text-gray-700">Support production of eco-friendly drones and scaling operations</p>
          </div>
          <div className="text-center">
            <div className="bg-red-500 p-4 rounded-full inline-flex mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Environmental Impact</h4>
            <p className="text-gray-700">Reduce waste and promote sustainable aerospace technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationCenter;