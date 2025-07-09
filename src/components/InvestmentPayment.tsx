import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import SecurePayment from './SecurePayment';
import { AdminSecurity } from '../utils/adminSecurity';

const InvestmentPayment = () => {
  const { tierName } = useParams();
  const [isCompleted, setIsCompleted] = useState(false);
  const [equityWarning, setEquityWarning] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    amount: '',
    investmentGoals: ''
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const investmentTiers = {
    'early-supporter': {
      name: 'Early Supporter',
      minAmount: 1000,
      maxAmount: 3000,
      equity: '0.2% - 0.6%',
      benefits: [
        'Early access to new models',
        'Quarterly progress reports',
        'Product discounts for personal use',
        'Recognition as founding supporter'
      ]
    },
    'strategic-partner': {
      name: 'Strategic Partner',
      minAmount: 3000,
      maxAmount: 7000,
      equity: '0.6% - 1.4%',
      benefits: [
        'All Early Supporter benefits',
        'Monthly progress calls',
        'Input on product development roadmap',
        'Priority access to limited production runs',
        'Co-marketing opportunities'
      ]
    },
    'lead-investor': {
      name: 'Lead Investor',
      minAmount: 7000,
      maxAmount: 50000,
      equity: '1.4% - 10%',
      benefits: [
        'All Strategic Partner benefits',
        'Direct access to founder',
        'Custom development considerations',
        'Exclusive territory licensing options',
        'Advisory role in business decisions'
      ]
    }
  };

  const tier = investmentTiers[tierName as keyof typeof investmentTiers];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = AdminSecurity.sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Check equity limits when amount changes
    if (name === 'amount' && value) {
      checkEquityLimits(parseInt(value));
    }
  };

  const calculateEquity = (amount: number) => {
    const valuation = 500000; // €500,000 valuation
    return ((amount / valuation) * 100);
  };

  const getCurrentTotalEquity = () => {
    const currentEquity = parseFloat(localStorage.getItem('fvdrones-total-equity') || '0');
    return currentEquity;
  };

  const checkEquityLimits = (investmentAmount: number) => {
    const newEquity = calculateEquity(investmentAmount);
    const currentTotalEquity = getCurrentTotalEquity();
    const projectedTotal = currentTotalEquity + newEquity;

    if (projectedTotal > 49) {
      setEquityWarning(true);
      const maxAllowedEquity = 49 - currentTotalEquity;
      const maxAllowedAmount = Math.floor((maxAllowedEquity / 100) * 500000);
      return { allowed: false, maxAmount: maxAllowedAmount, projectedTotal };
    } else {
      setEquityWarning(false);
      return { allowed: true, projectedTotal };
    }
  };

  const updateFundingAmount = (investmentAmount: number) => {
    const currentFunding = parseInt(localStorage.getItem('fvdrones-funding') || '250');
    const newFunding = currentFunding + investmentAmount;
    localStorage.setItem('fvdrones-funding', newFunding.toString());

    const newEquity = calculateEquity(investmentAmount);
    const currentTotalEquity = getCurrentTotalEquity();
    const newTotalEquity = currentTotalEquity + newEquity;
    localStorage.setItem('fvdrones-total-equity', newTotalEquity.toString());
  };

  const handleInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!AdminSecurity.validateEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (formData.phone && !AdminSecurity.validatePhone(formData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    if (!AdminSecurity.validateAmount(formData.amount)) {
      alert('Please enter a valid investment amount');
      return;
    }

    const investmentAmount = parseInt(formData.amount);
    const equityCheck = checkEquityLimits(investmentAmount);
    
    if (!equityCheck.allowed) {
      alert(`Investment amount too high! This would exceed the 49% equity limit. Maximum allowed investment: €${equityCheck.maxAmount}`);
      return;
    }

    if (investmentAmount < tier.minAmount || investmentAmount > tier.maxAmount) {
      alert(`Investment amount must be between €${tier.minAmount} and €${tier.maxAmount} for this tier`);
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    const investmentAmount = parseInt(formData.amount);
    updateFundingAmount(investmentAmount);
    
    // Send confirmation email
    const subject = encodeURIComponent(`Investment Confirmation - ${tier?.name} - FV Drones`);
    const equity = calculateEquity(parseInt(formData.amount)).toFixed(4);
    const body = encodeURIComponent(
      `INVESTMENT CONFIRMATION\n\n` +
      `Transaction ID: ${transactionId}\n` +
      `Investor Details:\n` +
      `Name: ${formData.firstName} ${formData.lastName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Company: ${formData.company}\n\n` +
      `Investment Details:\n` +
      `Tier: ${tier?.name}\n` +
      `Amount: €${formData.amount}\n` +
      `Equity Percentage: ${equity}%\n\n` +
      `Investment Goals: ${formData.investmentGoals}\n\n` +
      `This investor has completed their investment and should receive:\n` +
      `- Investment confirmation documentation\n` +
      `- Equity certificate\n` +
      `- Access to investor portal\n` +
      `- Welcome package with tier benefits\n\n` +
      `Please process this investment and send appropriate documentation.`
    );
    
    const mailtoLink = `mailto:info@fvdrones.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    setShowPayment(false);
    setIsCompleted(true);
  };

  if (!tier) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Tier Not Found</h1>
            <p className="text-xl text-gray-700 mb-8">The requested investment tier could not be found.</p>
            <Link to="/#invest" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Return to Investment Page
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Link to={`/invest/${tierName}`} className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Investment Form
          </Link>
          
          <SecurePayment
            amount={parseInt(formData.amount)}
            description={`${tier.name} Investment - ${formData.firstName} ${formData.lastName}`}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="bg-gray-50 rounded-2xl shadow-xl p-8 border border-gray-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to FV Drones!</h1>
              <p className="text-gray-700 mb-6">
                Congratulations! You are now officially an investor in FV Drones with {calculateEquity(parseInt(formData.amount)).toFixed(4)}% equity.
              </p>
              <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Investment Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-gray-600">Investment Tier:</span>
                    <p className="font-semibold text-gray-900">{tier.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount Invested:</span>
                    <p className="font-semibold text-gray-900">€{formData.amount}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Equity Percentage:</span>
                    <p className="font-semibold text-red-500">{calculateEquity(parseInt(formData.amount)).toFixed(4)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Valuation:</span>
                    <p className="font-semibold text-gray-900">€500,000</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-8">
                You will receive a confirmation email with your investment documentation, equity certificate, 
                and access to our investor portal within 24 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <Link 
                  to="/"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Return Home
                </Link>
                <a 
                  href="mailto:info@fvdrones.com?subject=Investor Portal Access"
                  className="border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentTotalEquity = getCurrentTotalEquity();
  const remainingEquity = 49 - currentTotalEquity;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/#invest" className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Investment Tiers
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Investment Summary */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{tier.name}</h2>
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-gray-600">Investment Range:</span>
                <p className="font-semibold text-gray-900">€{tier.minAmount.toLocaleString()} - €{tier.maxAmount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Equity Range:</span>
                <p className="font-semibold text-red-500">{tier.equity}</p>
              </div>
              <div>
                <span className="text-gray-600">Company Valuation:</span>
                <p className="font-semibold text-gray-900">€500,000</p>
              </div>
            </div>

            {/* Equity Protection Display */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🛡️ Equity Protection</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Total Equity:</span>
                  <span className="font-semibold text-gray-900">{currentTotalEquity.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Available:</span>
                  <span className="font-semibold text-green-600">{remainingEquity.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum Limit:</span>
                  <span className="font-semibold text-red-500">49%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-300" 
                  style={{width: `${(currentTotalEquity / 49) * 100}%`}}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Founder maintains majority control at all times
              </p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Benefits</h3>
            <ul className="space-y-2">
              {tier.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            {formData.amount && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Your Investment</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">€{formData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equity:</span>
                    <span className="font-semibold text-red-500">{calculateEquity(parseInt(formData.amount)).toFixed(4)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Total:</span>
                    <span className="font-semibold text-gray-900">
                      {(currentTotalEquity + calculateEquity(parseInt(formData.amount))).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Investment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Investment</h2>
            
            <form onSubmit={handleInvestmentSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Investment Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (€) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min={tier.minAmount}
                  max={Math.min(tier.maxAmount, Math.floor((remainingEquity / 100) * 500000))}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                    equityWarning ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={`€${tier.minAmount} - €${Math.min(tier.maxAmount, Math.floor((remainingEquity / 100) * 500000))}`}
                />
                {equityWarning && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-800 font-semibold text-sm">Equity Limit Exceeded!</p>
                        <p className="text-red-700 text-sm">
                          This investment would exceed the 49% equity limit. 
                          Maximum allowed: €{Math.floor((remainingEquity / 100) * 500000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Investment Goals */}
              <div>
                <label htmlFor="investmentGoals" className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Goals (Optional)
                </label>
                <textarea
                  id="investmentGoals"
                  name="investmentGoals"
                  rows={3}
                  value={formData.investmentGoals}
                  onChange={handleInputChange}
                  placeholder="What are your goals for this investment?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!formData.amount || parseInt(formData.amount) < tier.minAmount || equityWarning}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Proceed to Secure Payment
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InvestmentPayment;