import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus, RotateCcw, Save, AlertTriangle } from 'lucide-react';
import { StockManager, StockData } from '../utils/stockManager';

const StockAdmin = () => {
  const [stockData, setStockData] = useState<StockData>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const productNames: { [key: string]: string } = {
    'fv-hawk-composite': 'FV Hawk Surveillance',
    'fv-eagle-quad': 'FV Eagle Quad',
    'fv-stinger-taser': 'FV Stinger Taser',
    'fv-guardian-rubber': 'FV Guardian Rubber',
    'fv-carrier-payload': 'FV Carrier Payload',
    'fv-rocket-speed': 'FV Rocket Speed',
    'fv-tube-coax': 'FV Tube Coax',
    'fv-titan-ic': 'FV Titan IC Engine',
    'fv-atlas-heavy': 'FV Atlas Heavy'
  };

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = () => {
    const data = StockManager.getAllStock();
    setStockData(data);
    setHasChanges(false);
  };

  const updateStock = (productId: string, field: 'inStock' | 'reserved', value: number) => {
    setStockData(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: Math.max(0, value),
        lastUpdated: new Date().toISOString()
      }
    }));
    setHasChanges(true);
  };

  const adjustStock = (productId: string, field: 'inStock' | 'reserved', delta: number) => {
    const current = stockData[productId]?.[field] || 0;
    updateStock(productId, field, current + delta);
  };

  const saveChanges = () => {
    Object.entries(stockData).forEach(([productId, data]) => {
      StockManager.updateProductStock(productId, data.inStock, data.reserved);
    });
    setHasChanges(false);
    alert('Stock levels updated successfully!');
  };

  const resetToDefaults = () => {
    StockManager.resetToDefaults();
    loadStockData();
    setShowResetConfirm(false);
    alert('Stock levels reset to defaults!');
  };

  const getAvailable = (productId: string) => {
    const product = stockData[productId];
    if (!product) return 0;
    return Math.max(0, product.inStock - product.reserved);
  };

  const getStatusColor = (available: number) => {
    if (available === 0) return 'text-red-600';
    if (available <= 2) return 'text-orange-600';
    if (available <= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Package className="w-8 h-8 text-blue-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">Stock Management</h2>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <button
              onClick={saveChanges}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          )}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-800 font-medium">You have unsaved changes. Click "Save Changes" to apply them.</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(stockData).map(([productId, data]) => {
          const available = getAvailable(productId);
          return (
            <div key={productId} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="grid lg:grid-cols-4 gap-6 items-center">
                {/* Product Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {productNames[productId] || productId}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {productId}</p>
                  <p className={`text-sm font-medium ${getStatusColor(available)}`}>
                    {available} available
                  </p>
                </div>

                {/* In Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Stock
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => adjustStock(productId, 'inStock', -1)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={data.inStock}
                      onChange={(e) => updateStock(productId, 'inStock', parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                    <button
                      onClick={() => adjustStock(productId, 'inStock', 1)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reserved */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reserved
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => adjustStock(productId, 'reserved', -1)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={data.reserved}
                      onChange={(e) => updateStock(productId, 'reserved', parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max={data.inStock}
                    />
                    <button
                      onClick={() => adjustStock(productId, 'reserved', 1)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                      disabled={data.reserved >= data.inStock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Last Updated */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-600">
                    {new Date(data.lastUpdated).toLocaleDateString()} at{' '}
                    {new Date(data.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Reset Stock Levels?</h3>
            <p className="text-gray-700 mb-6">
              This will reset all stock levels to their default values. Any unsaved changes will be lost.
            </p>
            <div className="flex gap-4">
              <button
                onClick={resetToDefaults}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-500 py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Total Stock:</strong> The total number of units available</li>
          <li>• <strong>Reserved:</strong> Units temporarily held during checkout process</li>
          <li>• <strong>Available:</strong> Total Stock - Reserved = Units customers can purchase</li>
          <li>• Use +/- buttons or type directly to adjust quantities</li>
          <li>• Click "Save Changes" to apply your updates</li>
          <li>• Stock levels are automatically updated when purchases are completed</li>
        </ul>
      </div>
    </div>
  );
};

export default StockAdmin;