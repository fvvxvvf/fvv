import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle, Package, Truck, AlertTriangle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import SecurePayment from './SecurePayment';
import { AdminSecurity } from '../utils/adminSecurity';
import { StockManager } from '../utils/stockManager';

const Checkout = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedMaterial = searchParams.get('material') || '';
  
  const [showPayment, setShowPayment] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stockReserved, setStockReserved] = useState(false);
  const [stockError, setStockError] = useState('');
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Spain',
    shippingMethod: 'standard'
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check stock availability when component mounts
    if (productId) {
      const stockInfo = StockManager.getProductStock(productId);
      if (stockInfo.available === 0) {
        setStockError('This item is currently out of stock.');
      }
    }
  }, []);

  // Reserve stock when proceeding to payment
  useEffect(() => {
    if (showPayment && productId && !stockReserved) {
      const reserved = StockManager.reserveStock(productId, 1);
      if (reserved) {
        setStockReserved(true);
      } else {
        setStockError('Unable to reserve stock. Item may be out of stock.');
        setShowPayment(false);
      }
    }
  }, [showPayment, productId, stockReserved]);

  // Release reserved stock if user leaves checkout
  useEffect(() => {
    return () => {
      if (stockReserved && productId && !isCompleted) {
        StockManager.releaseReservedStock(productId, 1);
      }
    };
  }, [stockReserved, productId, isCompleted]);

  // Product data (simplified version from ProductDetail)
  const products = {
    'fv-hawk-composite': {
      id: 'fv-hawk-composite',
      name: 'FV Hawk Surveillance',
      type: 'Helicopter Style',
      image: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200',
      materials: [
        { name: 'Flax Fiber Composite', price: 299 },
        { name: 'Aluminum Composite', price: 329 }
      ]
    },
    'fv-eagle-quad': {
      id: 'fv-eagle-quad',
      name: 'FV Eagle Quad',
      type: 'Quadcopter',
      image: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExajJ4YTlnODRvZHNrcmNoc3hvZDZ3cDU4ajhpaTU4anp4dWh5OGJvNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hR0jSqWtRNovStbMep/giphy.gif',
      materials: [
        { name: 'Paper Composite', price: 249 },
        { name: 'Flax Fiber Composite', price: 279 }
      ]
    },
    'fv-carrier-payload': {
      id: 'fv-carrier-payload',
      name: 'FV Carrier Payload',
      type: 'Payload Delivery',
      image: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDd6NmlmZ2d6YmZhc2R3dHFkOXBwYWwwdTVqN3JseXU3OHRmY2JlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QURevAwNku3IYI1wWz/giphy.gif',
      materials: [
        { name: 'Flax Fiber Composite', price: 199 },
        { name: '3D Printed PET', price: 219 }
      ]
    },
    'fv-rocket-speed': {
      id: 'fv-rocket-speed',
      name: 'FV Rocket Speed',
      type: 'Racing/Speed',
      image: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExajJ4YTlnODRvZHNrcmNoc3hvZDZ3cDU4ajhpaTU4anp4dWh5OGJvNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hR0jSqWtRNovStbMep/giphy.gif',
      materials: [
        { name: 'Aluminum Composite', price: 399 }
      ]
    },
    'fv-tube-coax': {
      id: 'fv-tube-coax',
      name: 'FV Tube Coax',
      type: 'Coaxial Design',
      image: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDd6NmlmZ2d6YmZhc2R3dHFkOXBwYWwwdTVqN3JseXU3OHRmY2JlcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QURevAwNku3IYI1wWz/giphy.gif',
      materials: [
        { name: '3D Printed PET', price: 329 },
        { name: 'Flax Fiber Composite', price: 359 }
      ]
    }
  };

  const product = products[productId as keyof typeof products];
  
  const getSelectedMaterial = () => {
    if (!product) return null;
    return product.materials.find(m => m.name === selectedMaterial) || product.materials[0];
  };

  const material = getSelectedMaterial();
  const basePrice = material?.price || 0;
  
  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 15, days: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 25, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 45, days: '1 business day' }
  ];

  const selectedShipping = shippingOptions.find(s => s.id === shippingData.shippingMethod) || shippingOptions[0];
  const totalPrice = basePrice + selectedShipping.price;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: AdminSecurity.sanitizeInput(value)
    }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!AdminSecurity.validateEmail(shippingData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (shippingData.phone && !AdminSecurity.validatePhone(shippingData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    // Complete the purchase (removes from stock)
    if (productId) {
      StockManager.completePurchase(productId, 1);
    }
    
    // Send order confirmation email
    const subject = encodeURIComponent(`Order Confirmation - ${product?.name} - FV Drones`);
    const body = encodeURIComponent(
      `ORDER CONFIRMATION\n\n` +
      `Transaction ID: ${transactionId}\n` +
      `Product: ${product?.name} (${product?.type})\n` +
      `Material: ${material?.name}\n` +
      `Price: €${basePrice}\n` +
      `Shipping: ${selectedShipping.name} - €${selectedShipping.price}\n` +
      `Total: €${totalPrice}\n\n` +
      `Shipping Address:\n` +
      `${shippingData.firstName} ${shippingData.lastName}\n` +
      `${shippingData.address}\n` +
      `${shippingData.city}, ${shippingData.postalCode}\n` +
      `${shippingData.country}\n\n` +
      `Contact:\n` +
      `Email: ${shippingData.email}\n` +
      `Phone: ${shippingData.phone}\n\n` +
      `Expected Delivery: ${selectedShipping.days}\n\n` +
      `Please process this order and arrange shipping.`
    );
    
    const mailtoLink = `mailto:orders@fvdrones.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    setShowPayment(false);
    setIsCompleted(true);
  };

  const handlePaymentCancel = () => {
    // Release reserved stock when payment is cancelled
    if (stockReserved && productId) {
      StockManager.releaseReservedStock(productId, 1);
      setStockReserved(false);
    }
    setShowPayment(false);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-xl text-gray-700 mb-8">The requested product could not be found.</p>
            <Link to="/shop" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Back to Shop
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
          <Link to={`/checkout/${productId}?material=${encodeURIComponent(selectedMaterial)}`} className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Checkout
          </Link>
          
          <SecurePayment
            amount={totalPrice}
            description={`${product.name} (${material?.name}) + Shipping`}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
              <p className="text-gray-700 mb-6">
                Thank you for your purchase! Your {product.name} will be shipped to your address within {selectedShipping.days}.
              </p>
              
              <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-gray-600">Product:</span>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Material:</span>
                    <p className="font-semibold text-gray-900">{material?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Shipping:</span>
                    <p className="font-semibold text-gray-900">{selectedShipping.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Paid:</span>
                    <p className="font-semibold text-red-500">€{totalPrice}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-8">
                You will receive a tracking number via email once your order ships. 
                Expected delivery: {selectedShipping.days}.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Link 
                  to="/shop"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Continue Shopping
                </Link>
                <a 
                  href="mailto:orders@fvdrones.com?subject=Order Support"
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/product/${productId}`} className="inline-flex items-center text-gray-700 hover:text-red-500 mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Product
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-700">Complete your purchase of the {product.name}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Stock Error Alert */}
          {stockError && (
            <div className="lg:col-span-2 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-800 font-medium">{stockError}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Product Info */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600">{product.type}</p>
                <p className="text-sm text-gray-600">Material: {material?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-500">€{basePrice}</p>
              </div>
            </div>

            {/* Shipping Options */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h3>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      shippingData.shippingMethod === option.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={option.id}
                        checked={shippingData.shippingMethod === option.id}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{option.name}</p>
                        <p className="text-sm text-gray-600">{option.days}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">€{option.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Product Price:</span>
                  <span className="font-semibold">€{basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping:</span>
                  <span className="font-semibold">€{selectedShipping.price}</span>
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-red-500">€{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
            
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={shippingData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  >
                    <option value="Spain">Spain</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Other EU">Other EU</option>
                  </select>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Shipping Information:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Free shipping on orders over €500</li>
                      <li>All drones are carefully packaged and insured</li>
                      <li>Tracking information provided via email</li>
                      <li>Signature required for delivery</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!!stockError}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {stockError ? 'Out of Stock' : `Proceed to Payment - €${totalPrice}`}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;