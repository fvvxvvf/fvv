import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Package, BarChart3, Users, Settings, AlertTriangle, Key } from 'lucide-react';
import { AdminSecurity } from '../utils/adminSecurity';
import StockAdmin from './StockAdmin';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel = ({ onLogout }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('stock');
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    document.body.classList.add('admin-page');
    const session = AdminSecurity.getCurrentSession();
    setSessionInfo(session);

    const checkSession = () => {
      if (!AdminSecurity.isAuthenticated()) {
        onLogout();
      }
    };

    const interval = setInterval(checkSession, 30000);
    return () => {
      document.body.classList.remove('admin-page');
      clearInterval(interval);
    };
  }, [onLogout]);

  const handleLogout = () => {
    AdminSecurity.logout();
    onLogout();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeRemaining = (expiresAt: number) => {
    const remaining = Math.max(0, expiresAt - Date.now());
    const minutes = Math.floor(remaining / 60000);
    return `${minutes} minutes`;
  };

  const tabs = [
    { id: 'stock', name: 'Stock Management', icon: Package },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'users', name: 'User Activity', icon: Users },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">FV Drones Admin</h1>
              <span className="ml-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Secure Session
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {sessionInfo && (
                <div className="text-sm text-gray-600">
                  <span>Session expires in: </span>
                  <span className="font-medium text-orange-600">
                    {getTimeRemaining(sessionInfo.expiresAt)}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-blue-500 mr-2" />
            <div className="text-blue-800">
              <p className="font-medium">Secure Admin Environment</p>
              <p className="text-sm">This session is encrypted and monitored. All actions are logged for security purposes.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <nav className="flex space-x-8 px-6" aria-label="Admin navigation">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'stock' && <StockAdmin />}

          {activeTab === 'analytics' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Products</h3>
                  <p className="text-3xl font-bold text-blue-600">9</p>
                  <p className="text-sm text-blue-700">Active in catalog</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">In Stock</h3>
                  <p className="text-3xl font-bold text-green-600">47</p>
                  <p className="text-sm text-green-700">Units available</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">Reserved</h3>
                  <p className="text-3xl font-bold text-orange-600">7</p>
                  <p className="text-sm text-orange-700">Units in checkout</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Out of Stock</h3>
                  <p className="text-3xl font-bold text-red-600">3</p>
                  <p className="text-sm text-red-700">Products unavailable</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Activity</h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600">User activity tracking would be implemented here in a production environment.</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li>• Page views and navigation patterns</li>
                  <li>• Product interest and engagement</li>
                  <li>• Checkout abandonment analysis</li>
                  <li>• Geographic distribution of visitors</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Overview</h2>
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Current Session</h3>
                  {sessionInfo && (
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Session Token:</span> {sessionInfo.sessionToken.substring(0, 16)}...</p>
                      <p><span className="font-medium">Started:</span> {formatTime(sessionInfo.lastActivity)}</p>
                      <p><span className="font-medium">Expires:</span> {formatTime(sessionInfo.expiresAt)}</p>
                      <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Active & Secure</span></p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Security Features Active</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>✅ Password-based authentication</li>
                    <li>✅ Encrypted password storage</li>
                    <li>✅ Session timeout protection</li>
                    <li>✅ Rate limiting enabled</li>
                    <li>✅ Anti-scraping measures</li>
                    <li>✅ Developer tools detection</li>
                    <li>✅ CSRF protection</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">Security Recommendations</h3>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li>• Always logout when finished</li>
                    <li>• Don't share admin credentials</li>
                    <li>• Use this panel only on secure networks</li>
                    <li>• Report any suspicious activity immediately</li>
                    <li>• Change password regularly</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Settings</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Password Management
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Change your admin password or reset authentication settings.
                  </p>
                  <button
                    onClick={() => {
                      const confirmed = confirm('Are you sure you want to reset your password? You will need to set up a new password.');
                      if (confirmed) {
                        AdminSecurity.resetPassword();
                        alert('Password reset. You will be logged out and need to set up a new password.');
                        handleLogout();
                      }
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Reset Password
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Settings</h3>
                  <p className="text-gray-600 mb-4">
                    Current session timeout: 60 minutes of inactivity
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>• Sessions automatically expire after 60 minutes of inactivity</p>
                    <p>• All admin actions are logged for security</p>
                    <p>• Multiple failed login attempts will lock the account</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;