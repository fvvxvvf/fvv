import React from 'react';
import { Shield, Lock, CreditCard, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">FV Drones</h3>
            <p className="text-sm text-gray-600 mb-4">
              Revolutionary UAV technology built from recycled materials. 
              Sustainable innovation for a better future.
            </p>
            <Link 
              to="/donate" 
              className="inline-flex items-center text-red-500 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <Heart className="w-4 h-4 mr-1" />
              Support Our Mission
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/materials" className="hover:text-red-500 transition-colors">Materials</Link></li>
              <li><Link to="/#models" className="hover:text-red-500 transition-colors">UAV Models</Link></li>
              <li><Link to="/shop" className="hover:text-red-500 transition-colors">Shop</Link></li>
              <li><Link to="/#invest" className="hover:text-red-500 transition-colors">Investment</Link></li>
              <li><Link to="/donate" className="hover:text-red-500 transition-colors">Donate</Link></li>
            </ul>
          </div>

          {/* Security & Trust */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Trust</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Shield className="w-4 h-4 text-green-500 mr-2" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center text-sm">
                <Lock className="w-4 h-4 text-green-500 mr-2" />
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center text-sm">
                <CreditCard className="w-4 h-4 text-green-500 mr-2" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>info@fvdrones.com</p>
              <p>donations@fvdrones.com</p>
              <p>+34 666 555 444</p>
              <p className="text-xs text-gray-500 mt-4">
                Madrid, España
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="border-t border-gray-300 pt-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-800 font-medium">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-800 font-medium">PCI DSS Compliant</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-800 font-medium">Fraud Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-300 pt-6">
          <p className="text-sm">&copy; 2024 FV Drones. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-2">
            Your data is protected by industry-leading security measures. 
            All transactions are encrypted and secure.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;