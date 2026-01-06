
export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ScannedReceipt {
  id: string;
  date: string;
  merchantName: string;
  items: ReceiptItem[];
  grandTotal: number;
  category: 'Fresh' | 'Dry' | 'Beverage' | 'Other';
}

export interface StockRecommendation {
  itemName: string;
  action: 'Restock' | 'Reduce' | 'Maintain';
  reason: string;
  confidence: number;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export type AppView = 'dashboard' | 'scanner' | 'recommender' | 'history' | 'chatbot';
export type TimePeriod = 'weekly' | 'monthly' | 'yearly';
