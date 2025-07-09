import React, { useState } from 'react';
import { Menu, X, Heart, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
    setIsMenuOpen(false);
  };

  const handleDonateClick = () => {
    // Always reset and go to the beginning of the donation page
    if (location.pathname === '/donate') {
      // If already on donate page, force a full page reload to reset everything
      window.location.reload();
    } else {
      // Navigate to donate page (will start fresh)
      window.location.href = '/donate';
    }
    setIsMenuOpen(false);
  };

  const handleMaterialsClick = () => {
    setIsMenuOpen(false);
    
    if (isHomePage) {
      // If on home page, scroll to materials section
      scrollToSection('materials');
    } else {
      // If on other page, navigate to home page with materials hash
      window.location.assign('/#materials');
    }
  };

  const handleInvestClick = () => {
    setIsMenuOpen(false);
    
    if (isHomePage) {
      // If on home page, scroll to invest section
      const investSection = document.getElementById('invest');
      if (investSection) {
        investSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on other page, navigate to home page with hash
      // Use a more direct approach that forces the browser to handle the hash
      window.location.assign('/#invest');
    }
  };

  const handleModelsClick = () => {
    setIsMenuOpen(false);
    
    if (isHomePage) {
      scrollToSection('models');
    } else {
      window.location.href = '/#models';
    }
  };

  const handleContactClick = () => {
    setIsMenuOpen(false);
    
    if (isHomePage) {
      scrollToSection('contact');
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <header className="bg-white text-gray-900 sticky top-0 z-50 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={handleHomeClick} className="flex items-center space-x-3 cursor-pointer">
            <img 
              src="https://fvdrones.com/images/Logo.png" 
              alt="FV Drones Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                // Fallback to Lucide icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden h-8 w-8 text-yellow-400 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">FV Drones</h1>
              <p className="text-xs text-gray-600">fvdrones.com</p>
            </div>
          </button>
          
          <nav className="hidden md:block" role="navigation" aria-label="Main navigation">
            <ul className="flex space-x-8">
              <li>
                <button 
                  onClick={handleHomeClick} 
                  className="hover:text-red-500 transition-colors"
                  aria-label="Go to home page"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={handleMaterialsClick} 
                  className="hover:text-red-500 transition-colors"
                  aria-label="View materials section"
                >
                  Materials
                </button>
              </li>
              <li>
                <button 
                  onClick={handleModelsClick} 
                  className="hover:text-red-500 transition-colors"
                  aria-label="View UAV models"
                >
                  UAV Models
                </button>
              </li>
              <li>
                <button 
                  onClick={handleInvestClick} 
                  className="hover:text-red-500 transition-colors"
                  aria-label="View investment opportunities"
                >
                  Invest
                </button>
              </li>
              <li>
                <button 
                  onClick={handleContactClick} 
                  className="hover:text-red-500 transition-colors"
                  aria-label="Contact us"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={handleDonateClick} 
                  className="hover:text-red-500 transition-colors flex items-center space-x-1"
                  aria-label="Make a donation"
                >
                  <Heart className="w-4 h-4" />
                  <span>Donate</span>
                </button>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="hover:text-red-500 transition-colors font-bold flex items-center space-x-1"
                  aria-label="Visit shop"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Shop</span>
                </Link>
              </li>
            </ul>
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav role="navigation" aria-label="Mobile navigation">
              <ul className="flex flex-col space-y-2">
                <li>
                  <button 
                    onClick={handleHomeClick} 
                    className="hover:text-red-500 transition-colors py-2 text-left w-full"
                    aria-label="Go to home page"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleMaterialsClick} 
                    className="hover:text-red-500 transition-colors py-2 text-left w-full"
                    aria-label="View materials section"
                  >
                    Materials
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleModelsClick} 
                    className="hover:text-red-500 transition-colors py-2 text-left w-full"
                    aria-label="View UAV models"
                  >
                    UAV Models
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleInvestClick} 
                    className="hover:text-red-500 transition-colors py-2 text-left w-full"
                    aria-label="View investment opportunities"
                  >
                    Invest
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleContactClick} 
                    className="hover:text-red-500 transition-colors py-2 text-left w-full"
                    aria-label="Contact us"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleDonateClick} 
                    className="hover:text-red-500 transition-colors py-2 text-left flex items-center space-x-1"
                    aria-label="Make a donation"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Donate</span>
                  </button>
                </li>
                <li>
                  <Link 
                    to="/shop" 
                    className="hover:text-red-500 transition-colors py-2 text-left font-bold flex items-center space-x-1"
                    aria-label="Visit shop"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Shop</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;