import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AdminSecurity } from '../utils/adminSecurity';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack?: () => void;
}

const AdminLogin = ({ onLoginSuccess, onBack }: AdminLoginProps) => {
  const [step, setStep] = useState<'setup' | 'login'>('login');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!AdminSecurity.isPasswordSetup()) {
      setStep('setup');
    }
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    const result = await AdminSecurity.setupPassword(password);
    if (result.success) {
      alert('Password setup successful! You can now log in.');
      setStep('login');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error || 'Setup failed');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await AdminSecurity.verifyPassword(password);
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Authentication failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {onBack && (
          <button 
            onClick={onBack}
            className="inline-flex items-center text-gray-700 hover:text-red-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shop
          </button>
        )}

        <div className="flex items-center mb-6">
          <Shield className="w-8 h-8 text-red-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'setup' ? 'Setup Admin Password' : 'Admin Login'}
          </h2>
        </div>

        {step === 'setup' ? (
          <form onSubmit={handleSetup}>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 border border-gray-300 rounded pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Enter a strong password (min 8 characters)"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 border border-gray-300 rounded pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>Password Requirements:</strong>
                </p>
                <ul className="text-blue-700 text-xs mt-1 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Mix of uppercase and lowercase letters</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting up...' : 'Set Password'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 border border-gray-300 rounded pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your admin password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  const confirmed = confirm('Are you sure you want to reset the admin password? This will require setting up a new password.');
                  if (confirmed) {
                    AdminSecurity.resetPassword();
                    setStep('setup');
                    setPassword('');
                    setError('');
                  }
                }}
                className="text-sm text-gray-600 hover:text-red-500 transition-colors"
              >
                Forgot password? Reset it here
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center">
            <Lock className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-600 text-sm">Secure admin access with encrypted storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;