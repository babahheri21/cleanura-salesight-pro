
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sellPrice: number;
  costPrice: number;
  stock: number;
  category: string;
  image?: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: Date;
  lastPurchase?: Date;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  sellPrice: number;
  costPrice: number;
  discount: number;
  total: number;
}

export interface Sale {
  id: string;
  customer: Customer;
  items: SaleItem[];
  totalAmount: number;
  profit: number;
  paymentMethod: string;
  status: "completed" | "pending" | "cancelled";
  notes?: string;
  createdAt: Date;
  followedUp: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  receipt?: string;
}

export interface FinancialSummary {
  totalSales: number;
  totalExpenses: number;
  totalProfit: number;
  period: string;
}

export interface BalanceSheetItem {
  name: string;
  amount: number;
}

export interface BalanceSheet {
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
  date: Date;
}

export interface ProfitLossStatement {
  revenue: BalanceSheetItem[];
  expenses: BalanceSheetItem[];
  netIncome: number;
  period: {
    start: Date;
    end: Date;
  };
}
