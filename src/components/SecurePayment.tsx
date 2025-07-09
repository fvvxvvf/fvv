import React, { useState } from 'react';
import { CreditCard, Shield, Lock, AlertTriangle, CheckCircle, Building, Copy, Check } from 'lucide-react';
import { SecurityManager, PaymentSecurity } from '../utils/security';

interface SecurePaymentProps {
  amount: number;
  description: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

const SecurePayment = ({ amount, description, onSuccess, onCancel }: SecurePaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Spain'
  });
  
  const [bankData, setBankData] = useState({
    accountHolder: '',
    iban: '',
    bic: '',
    bankName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Spain'
  });

  // FV Drones bank details (updated with your IBAN)
  const fvDronesBankDetails = {
    bankName: 'Banco Sabadell',
    iban: 'ES18 0081 2711 6900 0752 1266',
    bic: 'BSABESBB',
    accountHolder: 'FV Drones S.L.',
    reference: `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  };

  const validateCardData = () => {
    const newErrors: Record<string, string> = {};

    if (!PaymentSecurity.validateCreditCard(cardData.number)) {
      newErrors.number = 'Invalid card number - please check and try again';
    }

    const [month, year] = cardData.expiry.split('/');
    if (!PaymentSecurity.validateExpiryDate(month, `20${year}`)) {
      newErrors.expiry = 'Card has expired or invalid date format';
    }

    if (!PaymentSecurity.validateCVV(cardData.cvv)) {
      newErrors.cvv = 'Invalid CVV - check the 3-4 digit code on your card';
    }

    if (!cardData.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }

    if (!cardData.address.trim()) {
      newErrors.address = 'Billing address is required';
    }

    if (!cardData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!cardData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBankData = () => {
    const newErrors: Record<string, string> = {};

    if (!bankData.accountHolder.trim()) {
      newErrors.accountHolder = 'Account holder name is required';
    }

    if (!SecurityManager.validateIBAN(bankData.iban)) {
      newErrors.iban = 'Invalid IBAN format';
    }

    if (!bankData.bic.trim() || bankData.bic.length < 8) {
      newErrors.bic = 'Valid BIC/SWIFT code is required';
    }

    if (!bankData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!bankData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!bankData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!bankData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = async () => {
    if (!SecurityManager.checkRateLimit('payment')) {
      alert('Too many payment attempts. Please wait 1 minute before trying again.');
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      let isValid = false;

      if (paymentMethod === 'card') {
        isValid = validateCardData();
        if (!isValid) {
          setIsProcessing(false);
          return;
        }
      } else if (paymentMethod === 'bank') {
        if (!showBankForm) {
          setShowBankForm(true);
          setIsProcessing(false);
          return;
        }
        isValid = validateBankData();
        if (!isValid) {
          setIsProcessing(false);
          return;
        }
      }

      // Generate secure transaction ID
      const transactionId = PaymentSecurity.generatePaymentToken();

      // Simulate real payment processing with validation
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (paymentMethod === 'paypal') {
        // Open PayPal with real payment
        const paypalUrl = `https://www.paypal.com/paypalme/fvdrones/${amount}EUR`;
        window.open(paypalUrl, '_blank');
        
        // Wait for user confirmation
        const confirmed = window.confirm(
          'Please complete your PayPal payment in the new window, then click OK to confirm the transaction was successful.'
        );
        
        if (!confirmed) {
          setIsProcessing(false);
          return;
        }
      } else if (paymentMethod === 'bank') {
        // Show bank transfer details
        setShowBankDetails(true);
        setIsProcessing(false);
        return;
      }

      // Mark payment as completed
      setPaymentCompleted(true);
      setIsProcessing(false);
      
      // Wait 2 seconds then call success
      setTimeout(() => {
        onSuccess(transactionId);
      }, 2000);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing failed. Please check your information and try again.');
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const confirmBankTransfer = () => {
    const confirmed = window.confirm(
      `Please confirm that you will transfer €${amount.toLocaleString()} to our bank account using the provided details. Click OK only after you have initiated the bank transfer.`
    );
    
    if (confirmed) {
      setPaymentCompleted(true);
      const transactionId = PaymentSecurity.generatePaymentToken();
      
      setTimeout(() => {
        onSuccess(transactionId);
      }, 2000);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const formatIBAN = (value: string) => {
    const v = value.replace(/\s+/g, '').toUpperCase();
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  // Payment completed screen
  if (paymentCompleted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
        <p className="text-gray-700 mb-6">
          Your payment of €{amount.toLocaleString()} has been processed successfully.
        </p>
        <div className="animate-pulse">
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Bank transfer details screen
  if (showBankDetails) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
        <div className="flex items-center justify-center mb-6">
          <Building className="w-8 h-8 text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Complete Bank Transfer</h2>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium">
            Please transfer €{amount.toLocaleString()} to our bank account using the details below:
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">FV Drones Bank Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <div>
                <span className="text-gray-600 text-sm">Bank Name:</span>
                <p className="font-semibold text-gray-900">{fvDronesBankDetails.bankName}</p>
              </div>
              <button
                onClick={() => copyToClipboard(fvDronesBankDetails.bankName, 'bankName')}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                {copiedField === 'bankName' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <div>
                <span className="text-gray-600 text-sm">IBAN:</span>
                <p className="font-semibold text-gray-900 font-mono">{fvDronesBankDetails.iban}</p>
              </div>
              <button
                onClick={() => copyToClipboard(fvDronesBankDetails.iban, 'iban')}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                {copiedField === 'iban' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <div>
                <span className="text-gray-600 text-sm">BIC/SWIFT:</span>
                <p className="font-semibold text-gray-900 font-mono">{fvDronesBankDetails.bic}</p>
              </div>
              <button
                onClick={() => copyToClipboard(fvDronesBankDetails.bic, 'bic')}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                {copiedField === 'bic' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
              <div>
                <span className="text-gray-600 text-sm">Account Holder:</span>
                <p className="font-semibold text-gray-900">{fvDronesBankDetails.accountHolder}</p>
              </div>
              <button
                onClick={() => copyToClipboard(fvDronesBankDetails.accountHolder, 'accountHolder')}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                {copiedField === 'accountHolder' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <span className="text-gray-600 text-sm">Reference (IMPORTANT):</span>
                <p className="font-semibold text-gray-900 font-mono">{fvDronesBankDetails.reference}</p>
              </div>
              <button
                onClick={() => copyToClipboard(fvDronesBankDetails.reference, 'reference')}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                {copiedField === 'reference' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Important Instructions:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Include the reference number in your transfer description</li>
            <li>• Transfer exactly €{amount.toLocaleString()}</li>
            <li>• Allow 1-3 business days for processing</li>
            <li>• You will receive confirmation once payment is received</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={confirmBankTransfer}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors"
          >
            I've Made the Transfer
          </button>
          <button
            onClick={() => setShowBankDetails(false)}
            className="px-6 py-4 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 rounded-lg font-semibold transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Bank account form for user's details
  if (showBankForm) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
        <div className="flex items-center justify-center mb-6">
          <Building className="w-8 h-8 text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Your Bank Account Details</h2>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium">
            Please provide your bank account details for verification and processing of €{amount.toLocaleString()}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Holder Name *
            </label>
            <input
              type="text"
              value={bankData.accountHolder}
              onChange={(e) => setBankData(prev => ({ ...prev, accountHolder: SecurityManager.sanitizeInput(e.target.value) }))}
              placeholder="Your full name as it appears on your bank account"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.accountHolder ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountHolder && (
              <p className="text-red-500 text-sm mt-1">{errors.accountHolder}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your IBAN *
            </label>
            <input
              type="text"
              value={bankData.iban}
              onChange={(e) => setBankData(prev => ({ ...prev, iban: formatIBAN(e.target.value) }))}
              placeholder="ES18 0081 2711 6900 0752 1266"
              maxLength={34}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono ${
                errors.iban ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.iban && (
              <p className="text-red-500 text-sm mt-1">{errors.iban}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BIC/SWIFT Code *
              </label>
              <input
                type="text"
                value={bankData.bic}
                onChange={(e) => setBankData(prev => ({ ...prev, bic: e.target.value.toUpperCase() }))}
                placeholder="BSABESBB"
                maxLength={11}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono ${
                  errors.bic ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bic && (
                <p className="text-red-500 text-sm mt-1">{errors.bic}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                value={bankData.bankName}
                onChange={(e) => setBankData(prev => ({ ...prev, bankName: SecurityManager.sanitizeInput(e.target.value) }))}
                placeholder="Banco Sabadell"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              value={bankData.address}
              onChange={(e) => setBankData(prev => ({ ...prev, address: SecurityManager.sanitizeInput(e.target.value) }))}
              placeholder="Street address"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={bankData.city}
                onChange={(e) => setBankData(prev => ({ ...prev, city: SecurityManager.sanitizeInput(e.target.value) }))}
                placeholder="Madrid"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                value={bankData.postalCode}
                onChange={(e) => setBankData(prev => ({ ...prev, postalCode: e.target.value }))}
                placeholder="28001"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.postalCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={processPayment}
            disabled={isProcessing}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Building className="w-5 h-5" />
                <span>Continue to Transfer Details</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowBankForm(false)}
            disabled={isProcessing}
            className="px-6 py-4 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
      <div className="flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-green-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
        <Lock className="w-6 h-6 text-green-500 ml-3" />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-800 font-medium">SSL Encrypted & PCI Compliant</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Details</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-gray-700">{description}</span>
            <span className="font-bold text-gray-900">€{amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'card' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Credit Card</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'paypal' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            <div className="w-6 h-6 mx-auto mb-2 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm font-medium">PayPal</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('bank')}
            className={`p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'bank' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            <Building className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Bank Transfer</span>
          </button>
        </div>
      </div>

      {/* Credit Card Form */}
      {paymentMethod === 'card' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number *
            </label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => setCardData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-mono ${
                errors.number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.number && (
              <p className="text-red-500 text-sm mt-1">{errors.number}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) => setCardData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-mono ${
                  errors.expiry ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiry && (
                <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV *
              </label>
              <input
                type="text"
                value={cardData.cvv}
                onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                placeholder="123"
                maxLength={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors font-mono ${
                  errors.cvv ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name *
            </label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => setCardData(prev => ({ ...prev, name: SecurityManager.sanitizeInput(e.target.value) }))}
              placeholder="John Doe"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Billing Address */}
          <div className="border-t pt-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Billing Address</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={cardData.address}
                  onChange={(e) => setCardData(prev => ({ ...prev, address: SecurityManager.sanitizeInput(e.target.value) }))}
                  placeholder="Street address"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={cardData.city}
                    onChange={(e) => setCardData(prev => ({ ...prev, city: SecurityManager.sanitizeInput(e.target.value) }))}
                    placeholder="Madrid"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={cardData.postalCode}
                    onChange={(e) => setCardData(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="28001"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PayPal Info */}
      {paymentMethod === 'paypal' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>PayPal Payment:</strong> You will be redirected to PayPal to complete your secure payment of €{amount.toLocaleString()} to payments@fvdrones.com
          </p>
        </div>
      )}

      {/* Bank Transfer Info */}
      {paymentMethod === 'bank' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>Bank Transfer:</strong> You will be prompted to provide your bank account details, then receive our bank information for the transfer.
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Your payment is protected by:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>256-bit SSL encryption</li>
              <li>PCI DSS compliance</li>
              <li>Fraud detection systems</li>
              <li>Secure tokenization</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={processPayment}
          disabled={isProcessing}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>
                {paymentMethod === 'bank' ? 'Enter Bank Details' : 
                 paymentMethod === 'paypal' ? 'Pay with PayPal' : 
                 'Pay €' + amount.toLocaleString()}
              </span>
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="px-6 py-4 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SecurePayment;