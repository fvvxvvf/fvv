import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Globe, Target, Award, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import CallRequest from './CallRequest';

const Investment = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isCallRequestOpen, setIsCallRequestOpen] = useState(false);
  const [showCustomProjectForm, setShowCustomProjectForm] = useState(false);
  const [currentFunding, setCurrentFunding] = useState(250);

  // Load funding amount from localStorage on component mount
  useEffect(() => {
    const savedFunding = localStorage.getItem('fvdrones-funding');
    if (savedFunding) {
      setCurrentFunding(parseInt(savedFunding));
    }
  }, []);

  const targetAmount = 10000;
  const fundingPercentage = (currentFunding / targetAmount) * 100;

  const investmentHighlights = [
    {
      icon: TrendingUp,
      title: 'Market Growth',
      value: '15.2%',
      description: 'Annual UAV market growth rate through 2030'
    },
    {
      icon: DollarSign,
      title: 'Target Amount',
      value: '€10K',
      description: 'Initial funding target for prototype development'
    },
    {
      icon: Globe,
      title: 'Market Reach',
      value: '12',
      description: 'Countries with active interest in our technology'
    },
    {
      icon: Target,
      title: 'Focus Area',
      value: 'Sub-200g',
      description: 'Specialized in lightweight drone technology'
    }
  ];

  const investmentTiers = [
    {
      name: 'Early Supporter',
      slug: 'early-supporter',
      amount: '€1K - €3K',
      equity: '0.2% - 0.6%',
      benefits: [
        'Early access to new models',
        'Quarterly progress reports',
        'Product discounts for personal use',
        'Recognition as founding supporter'
      ],
      highlight: false
    },
    {
      name: 'Strategic Partner',
      slug: 'strategic-partner',
      amount: '€3K - €7K',
      equity: '0.6% - 1.4%',
      benefits: [
        'All Early Supporter benefits',
        'Monthly progress calls',
        'Input on product development roadmap',
        'Priority access to limited production runs',
        'Co-marketing opportunities'
      ],
      highlight: true
    },
    {
      name: 'Lead Investor',
      slug: 'lead-investor',
      amount: '€7K - €50K',
      equity: '1.4% - 10%',
      benefits: [
        'All Strategic Partner benefits',
        'Direct access to founder',
        'Custom development considerations',
        'Exclusive territory licensing options',
        'Advisory role in business decisions'
      ],
      highlight: false
    }
  ];

  const handleTierSelection = (tierSlug: string) => {
    setSelectedTier(tierSlug);
    // Navigate to payment page
    window.location.href = `/invest/${tierSlug}`;
  };

  const handleCustomProjectClick = () => {
    setShowCustomProjectForm(true);
  };

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
    <section id="invest" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Investment Opportunity
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Join me in revolutionizing the UAV industry through sustainable innovation. 
            Be part of the future where environmental responsibility meets cutting-edge technology.
          </p>
        </div>

        {/* Investment Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {investmentHighlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center shadow-lg border border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{highlight.value}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                <p className="text-gray-700 text-sm">{highlight.description}</p>
              </div>
            );
          })}
        </div>

        {/* Value Proposition */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16 shadow-lg border border-gray-200">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Invest in FV Drones?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">First-Mover Advantage</h4>
                    <p className="text-gray-700">Leading the sustainable UAV revolution with proven recycled material technology.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Proven Performance</h4>
                    <p className="text-gray-700">Our prototypes have demonstrated performance matching traditional materials.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Global Market Demand</h4>
                    <p className="text-gray-700">Increasing demand for sustainable solutions in defense and civilian sectors.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Current Funding Round</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Target Amount:</span>
                  <span className="font-semibold">€{targetAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Raised:</span>
                  <span className="font-semibold text-yellow-400">€{currentFunding.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valuation:</span>
                  <span className="font-semibold">€500,000</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                  <div 
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min(fundingPercentage, 100)}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  {fundingPercentage.toFixed(1)}% funded • 12 months remaining
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Tiers */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Investment Tiers</h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {investmentTiers.map((tier, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 hover:border-red-500 ${
                  tier.highlight 
                    ? 'bg-red-500 text-white shadow-2xl transform scale-105 border-red-500' 
                    : 'bg-white shadow-lg border-gray-200'
                } ${selectedTier === tier.slug ? 'ring-4 ring-yellow-400' : ''}`}
                onClick={() => handleTierSelection(tier.slug)}
              >
                {tier.highlight && (
                  <div className="text-center mb-4">
                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h4 className={`text-2xl font-bold mb-2 ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {tier.name}
                  </h4>
                  <div className={`text-3xl font-bold mb-2 ${tier.highlight ? 'text-yellow-400' : 'text-red-500'}`}>
                    {tier.amount}
                  </div>
                  <p className={`${tier.highlight ? 'text-red-100' : 'text-gray-700'}`}>
                    Equity: {tier.equity}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        tier.highlight ? 'bg-yellow-400' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm ${tier.highlight ? 'text-red-100' : 'text-gray-700'}`}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  tier.highlight 
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}>
                  Invest Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Invest?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Contact me directly to discuss investment opportunities and get access to detailed business plan and financial projections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:info@fvdrones.com?subject=Investment Inquiry"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Email for Investment</span>
              </a>
              <button 
                onClick={() => setIsCallRequestOpen(true)}
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Request Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CallRequest 
        isOpen={isCallRequestOpen} 
        onClose={() => setIsCallRequestOpen(false)} 
      />

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

export default Investment;