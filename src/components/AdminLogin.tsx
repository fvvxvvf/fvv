import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, ArrowLeft, Key } from 'lucide-react';
import { AdminSecurity } from '../utils/adminSecurity';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
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
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="flex items-center mb-4">
              <button
                type="button"
                className="mr-2 text-gray-600 hover:text-gray-900"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              {loading ? 'Setting up...' : 'Set Password'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center mb-4">
              <button
                type="button"
                className="mr-2 text-gray-600 hover:text-gray-900"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
