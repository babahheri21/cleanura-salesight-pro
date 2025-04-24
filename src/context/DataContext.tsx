
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { 
  User, Product, Customer, Sale, Expense, 
  BalanceSheet, ProfitLossStatement, FinancialSummary 
} from "../types";
import { toast } from "sonner";

// Mock data
import { 
  mockUsers, 
  mockProducts, 
  mockCustomers, 
  mockSales, 
  mockExpenses 
} from "../data/mockData";

interface DataContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "lastPurchase">) => Customer;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  
  // Sales
  sales: Sale[];
  addSale: (sale: Omit<Sale, "id" | "createdAt">) => void;
  updateSale: (sale: Sale) => void;
  deleteSale: (id: string) => void;
  markFollowedUp: (id: string) => void;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id" | "date">) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  
  // Reports
  getFinancialSummary: (period: string) => FinancialSummary;
  getBalanceSheet: () => BalanceSheet;
  getProfitLossStatement: (startDate: Date, endDate: Date) => ProfitLossStatement;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  
  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem("cleanura_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Auth functions
  const login = async (email: string, password: string) => {
    // Simulating API call
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem("cleanura_user", JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
      return true;
    } else {
      toast.error("Invalid credentials");
      return false;
    }
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cleanura_user");
    toast.info("You have been logged out");
  };

  // Product functions
  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date()
    };
    
    setProducts([...products, newProduct]);
    toast.success("Product added successfully");
  };
  
  const updateProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    toast.success("Product updated successfully");
  };
  
  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted successfully");
  };

  // Customer functions
  const addCustomer = (customer: Omit<Customer, "id" | "createdAt" | "lastPurchase">) => {
    const newCustomer = {
      ...customer,
      id: `customer-${Date.now()}`,
      createdAt: new Date()
    };
    
    setCustomers([...customers, newCustomer]);
    toast.success("Customer added successfully");
    
    return newCustomer; // Return the newly created customer
  };
  
  const updateCustomer = (customer: Customer) => {
    setCustomers(customers.map(c => c.id === customer.id ? customer : c));
    toast.success("Customer updated successfully");
  };
  
  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    toast.success("Customer deleted successfully");
  };

  // Sales functions
  const addSale = (sale: Omit<Sale, "id" | "createdAt">) => {
    const newSale = {
      ...sale,
      id: `sale-${Date.now()}`,
      createdAt: new Date(),
      followedUp: false
    };
    
    // Update customer's last purchase date
    const updatedCustomers = customers.map(c => {
      if (c.id === sale.customer.id) {
        return { ...c, lastPurchase: new Date() };
      }
      return c;
    });
    
    setCustomers(updatedCustomers);
    setSales([...sales, newSale]);
    toast.success("Sale recorded successfully");
  };
  
  const updateSale = (sale: Sale) => {
    setSales(sales.map(s => s.id === sale.id ? sale : s));
    toast.success("Sale updated successfully");
  };
  
  const deleteSale = (id: string) => {
    setSales(sales.filter(s => s.id !== id));
    toast.success("Sale deleted successfully");
  };
  
  const markFollowedUp = (id: string) => {
    setSales(sales.map(s => {
      if (s.id === id) {
        return { ...s, followedUp: true };
      }
      return s;
    }));
    toast.success("Customer marked as followed up");
  };

  // Expense functions
  const addExpense = (expense: Omit<Expense, "id" | "date">) => {
    const newExpense = {
      ...expense,
      id: `expense-${Date.now()}`,
      date: new Date()
    };
    
    setExpenses([...expenses, newExpense]);
    toast.success("Expense recorded successfully");
  };
  
  const updateExpense = (expense: Expense) => {
    setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
    toast.success("Expense updated successfully");
  };
  
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success("Expense deleted successfully");
  };

  // Report functions
  const getFinancialSummary = (period: string): FinancialSummary => {
    // Filter sales and expenses by period
    let filteredSales = [...sales];
    let filteredExpenses = [...expenses];
    
    const now = new Date();
    
    if (period === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filteredSales = sales.filter(s => new Date(s.createdAt) >= weekAgo);
      filteredExpenses = expenses.filter(e => new Date(e.date) >= weekAgo);
    } else if (period === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filteredSales = sales.filter(s => new Date(s.createdAt) >= monthAgo);
      filteredExpenses = expenses.filter(e => new Date(e.date) >= monthAgo);
    } else if (period === "year") {
      const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      filteredSales = sales.filter(s => new Date(s.createdAt) >= yearAgo);
      filteredExpenses = expenses.filter(e => new Date(e.date) >= yearAgo);
    }
    
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0) - totalExpenses;
    
    return {
      totalSales,
      totalExpenses,
      totalProfit,
      period
    };
  };
  
  const getBalanceSheet = (): BalanceSheet => {
    // Simple balance sheet calculation
    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const inventory = products.reduce((sum, product) => sum + (product.costPrice * product.stock), 0);
    
    return {
      assets: [
        { name: "Cash from Sales", amount: totalSales - totalExpenses },
        { name: "Inventory", amount: inventory }
      ],
      liabilities: [
        { name: "Accounts Payable", amount: totalExpenses * 0.3 } // Mock data
      ],
      equity: [
        { name: "Owner's Equity", amount: (totalSales - totalExpenses) + inventory - (totalExpenses * 0.3) }
      ],
      date: new Date()
    };
  };
  
  const getProfitLossStatement = (startDate: Date, endDate: Date): ProfitLossStatement => {
    // Filter sales and expenses by period
    const filteredSales = sales.filter(s => {
      const date = new Date(s.createdAt);
      return date >= startDate && date <= endDate;
    });
    
    const filteredExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date >= startDate && date <= endDate;
    });
    
    // Group expenses by category
    const expensesByCategory: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += expense.amount;
      } else {
        expensesByCategory[expense.category] = expense.amount;
      }
    });
    
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      revenue: [
        { name: "Sales", amount: totalRevenue }
      ],
      expenses: Object.entries(expensesByCategory).map(([name, amount]) => ({ name, amount })),
      netIncome: totalRevenue - totalExpenses,
      period: {
        start: startDate,
        end: endDate
      }
    };
  };
  
  const value = {
    // Auth
    currentUser,
    login,
    logout,
    
    // Products
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Customers
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    // Sales
    sales,
    addSale,
    updateSale,
    deleteSale,
    markFollowedUp,
    
    // Expenses
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Reports
    getFinancialSummary,
    getBalanceSheet,
    getProfitLossStatement
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
