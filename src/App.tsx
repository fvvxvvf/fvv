import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Materials from './components/Materials';
import Models from './components/Models';
import Investment from './components/Investment';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ModelDetail from './components/ModelDetail';
import RequestQuote from './components/RequestQuote';
import MaterialsPage from './components/MaterialsPage';
import InvestmentPayment from './components/InvestmentPayment';
import DonationCenter from './components/DonationCenter';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { AdminSecurity } from './utils/adminSecurity';

function App() {
  // Initialize security measures on app start
  React.useEffect(() => {
    AdminSecurity.initSecurityMeasures();
  }, []);

  // Handle hash navigation when the app loads
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        // Wait for the page to fully render, then scroll to section
        const scrollToSection = () => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            // Add extra delay to ensure all components are mounted
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
          } else {
            // If element not found, try again after a longer delay
            setTimeout(scrollToSection, 300);
          }
        };
        
        // Initial attempt
        setTimeout(scrollToSection, 100);
      }
    };

    // Handle initial load
    handleHashNavigation();

    // Handle hash changes (when navigating with hash URLs)
    const handleHashChange = () => {
      handleHashNavigation();
    };

    window.addEventListener('hashchange', handleHashChange);

    // Also listen for page load events
    window.addEventListener('load', handleHashNavigation);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('load', handleHashNavigation);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <Materials />
              <Models />
              <Investment />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/model/:modelName" element={<ModelDetail />} />
          <Route path="/quote/:modelName" element={<RequestQuote />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/invest/:tierName" element={<InvestmentPayment />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/checkout/:productId" element={<Checkout />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/donate" element={
            <>
              <Header />
              <div className="py-20">
                <DonationCenter />
              </div>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

// Admin route component with authentication
const AdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if already authenticated
    const authenticated = AdminSecurity.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminPanel onLogout={handleLogout} />;
  } else {
    return (
      <AdminLogin 
        onLoginSuccess={handleLoginSuccess}
        onBack={() => window.location.href = '/'}
      />
    );
  }
};

export default App;