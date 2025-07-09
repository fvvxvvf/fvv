// Stock management system for FV Drones
export interface StockData {
  [productId: string]: {
    inStock: number;
    reserved: number;
    lastUpdated: string;
  };
}

export class StockManager {
  private static STORAGE_KEY = 'fvdrones-stock-data';
  
  // Default stock levels for all products
  private static DEFAULT_STOCK: StockData = {
    'fv-hawk-composite': { inStock: 12, reserved: 2, lastUpdated: new Date().toISOString() },
    'fv-eagle-quad': { inStock: 8, reserved: 1, lastUpdated: new Date().toISOString() },
    'fv-stinger-taser': { inStock: 0, reserved: 0, lastUpdated: new Date().toISOString() },
    'fv-guardian-rubber': { inStock: 0, reserved: 0, lastUpdated: new Date().toISOString() },
    'fv-carrier-payload': { inStock: 15, reserved: 3, lastUpdated: new Date().toISOString() },
    'fv-rocket-speed': { inStock: 5, reserved: 1, lastUpdated: new Date().toISOString() },
    'fv-tube-coax': { inStock: 7, reserved: 0, lastUpdated: new Date().toISOString() },
    'fv-titan-ic': { inStock: 0, reserved: 0, lastUpdated: new Date().toISOString() },
    'fv-atlas-heavy': { inStock: 0, reserved: 0, lastUpdated: new Date().toISOString() }
  };

  // Get current stock data from localStorage or defaults
  static getStockData(): StockData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all products exist
        return { ...this.DEFAULT_STOCK, ...parsed };
      }
    } catch (error) {
      console.warn('Error loading stock data:', error);
    }
    return { ...this.DEFAULT_STOCK };
  }

  // Save stock data to localStorage
  static saveStockData(stockData: StockData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stockData));
    } catch (error) {
      console.error('Error saving stock data:', error);
    }
  }

  // Get stock for a specific product
  static getProductStock(productId: string): { inStock: number; reserved: number; available: number } {
    const stockData = this.getStockData();
    const product = stockData[productId] || { inStock: 0, reserved: 0, lastUpdated: new Date().toISOString() };
    
    return {
      inStock: product.inStock,
      reserved: product.reserved,
      available: Math.max(0, product.inStock - product.reserved)
    };
  }

  // Update stock for a product
  static updateProductStock(productId: string, inStock: number, reserved: number = 0): void {
    const stockData = this.getStockData();
    stockData[productId] = {
      inStock: Math.max(0, inStock),
      reserved: Math.max(0, reserved),
      lastUpdated: new Date().toISOString()
    };
    this.saveStockData(stockData);
  }

  // Reserve stock (when someone starts checkout)
  static reserveStock(productId: string, quantity: number = 1): boolean {
    const stockData = this.getStockData();
    const product = stockData[productId];
    
    if (!product) return false;
    
    const available = product.inStock - product.reserved;
    if (available >= quantity) {
      product.reserved += quantity;
      product.lastUpdated = new Date().toISOString();
      this.saveStockData(stockData);
      return true;
    }
    
    return false;
  }

  // Release reserved stock (when checkout is cancelled)
  static releaseReservedStock(productId: string, quantity: number = 1): void {
    const stockData = this.getStockData();
    const product = stockData[productId];
    
    if (product) {
      product.reserved = Math.max(0, product.reserved - quantity);
      product.lastUpdated = new Date().toISOString();
      this.saveStockData(stockData);
    }
  }

  // Complete purchase (remove from stock and reserved)
  static completePurchase(productId: string, quantity: number = 1): void {
    const stockData = this.getStockData();
    const product = stockData[productId];
    
    if (product) {
      product.inStock = Math.max(0, product.inStock - quantity);
      product.reserved = Math.max(0, product.reserved - quantity);
      product.lastUpdated = new Date().toISOString();
      this.saveStockData(stockData);
    }
  }

  // Get all stock data for admin view
  static getAllStock(): StockData {
    return this.getStockData();
  }

  // Reset to default stock (for demo purposes)
  static resetToDefaults(): void {
    this.saveStockData({ ...this.DEFAULT_STOCK });
  }

  // Get stock status text
  static getStockStatus(productId: string): { text: string; color: string; available: boolean } {
    const stock = this.getProductStock(productId);
    
    if (stock.available === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', available: false };
    } else if (stock.available <= 2) {
      return { text: `Only ${stock.available} left`, color: 'text-orange-600', available: true };
    } else if (stock.available <= 5) {
      return { text: `${stock.available} in stock`, color: 'text-yellow-600', available: true };
    } else {
      return { text: `${stock.available} in stock`, color: 'text-green-600', available: true };
    }
  }

  // Check if product is in stock
  static isInStock(productId: string): boolean {
    const stock = this.getProductStock(productId);
    return stock.available > 0;
  }
}