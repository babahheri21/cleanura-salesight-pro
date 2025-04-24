
import { User, Product, Customer, Sale, Expense, SaleItem } from "../types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Admin User",
    email: "admin@cleanura.com",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
  },
  {
    id: "user2",
    name: "Regular User",
    email: "user@cleanura.com",
    role: "user",
    avatar: "https://ui-avatars.com/api/?name=Regular+User&background=1A6DF0&color=fff"
  },
  {
    id: "user3",
    name: "Guest User",
    email: "guest@cleanura.com",
    role: "guest",
    avatar: "https://ui-avatars.com/api/?name=Guest+User&background=9FB8D1&color=fff"
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Cleanura Pro Detergent",
    description: "High-quality professional detergent for all types of surfaces",
    sellPrice: 150000,
    costPrice: 85000,
    stock: 245,
    category: "Cleaning Products",
    image: "https://placehold.co/300x300/1A6DF0/white?text=Cleanura+Pro",
    createdAt: new Date("2023-01-15")
  },
  {
    id: "prod2",
    name: "Cleanura Surface Cleaner",
    description: "All-purpose surface cleaner with fresh scent",
    sellPrice: 85000,
    costPrice: 45000,
    stock: 320,
    category: "Cleaning Products",
    image: "https://placehold.co/300x300/1A6DF0/white?text=Surface+Cleaner",
    createdAt: new Date("2023-02-10")
  },
  {
    id: "prod3",
    name: "Cleanura Glass Polish",
    description: "Premium glass polish for streak-free shine",
    sellPrice: 95000,
    costPrice: 52000,
    stock: 180,
    category: "Polishes",
    image: "https://placehold.co/300x300/1A6DF0/white?text=Glass+Polish",
    createdAt: new Date("2023-03-05")
  },
  {
    id: "prod4",
    name: "Cleanura Floor Cleaner",
    description: "Industrial strength floor cleaner for all floor types",
    sellPrice: 120000,
    costPrice: 65000,
    stock: 200,
    category: "Cleaning Products",
    image: "https://placehold.co/300x300/1A6DF0/white?text=Floor+Cleaner",
    createdAt: new Date("2023-03-20")
  },
  {
    id: "prod5",
    name: "Cleanura Microfiber Cloth",
    description: "High-quality microfiber cleaning cloth set (5pcs)",
    sellPrice: 75000,
    costPrice: 35000,
    stock: 150,
    category: "Accessories",
    image: "https://placehold.co/300x300/1A6DF0/white?text=Microfiber",
    createdAt: new Date("2023-04-01")
  }
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: "cust1",
    name: "PT Maju Bersama",
    phone: "+6281234567890",
    email: "purchasing@majubersama.com",
    address: "Jl. Raya Industri No. 45, Jakarta",
    createdAt: new Date("2023-01-20"),
    lastPurchase: new Date("2023-04-15")
  },
  {
    id: "cust2",
    name: "Hotel Nusantara",
    phone: "+6285678901234",
    email: "housekeeping@hotelnusantara.com",
    address: "Jl. Gatot Subroto No. 123, Jakarta",
    createdAt: new Date("2023-02-05"),
    lastPurchase: new Date("2023-04-10")
  },
  {
    id: "cust3",
    name: "Klinik Sehat Selalu",
    phone: "+6287890123456",
    email: "admin@kliniksehat.com",
    address: "Jl. Pahlawan No. 56, Bandung",
    createdAt: new Date("2023-02-15"),
    lastPurchase: new Date("2023-03-28")
  },
  {
    id: "cust4",
    name: "CV Berkah Jaya",
    phone: "+6289012345678",
    email: "procurement@berkah.com",
    address: "Jl. Merdeka No. 89, Surabaya",
    createdAt: new Date("2023-03-01"),
    lastPurchase: new Date("2023-04-05")
  },
  {
    id: "cust5",
    name: "Restoran Selera",
    phone: "+6282345678901",
    email: "manager@selera.com",
    address: "Jl. Diponegoro No. 34, Yogyakarta",
    createdAt: new Date("2023-03-10"),
    lastPurchase: new Date("2023-04-18")
  }
];

// Helper: Create mock sale items
function createMockSaleItems(customerId: string): SaleItem[] {
  // Create 1-3 random items
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items: SaleItem[] = [];
  
  for (let i = 0; i < numItems; i++) {
    const randomProductIndex = Math.floor(Math.random() * mockProducts.length);
    const product = mockProducts[randomProductIndex];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 20) * 1000 : 0;
    
    items.push({
      id: `item-${customerId}-${i}`,
      productId: product.id,
      productName: product.name,
      quantity,
      sellPrice: product.sellPrice,
      costPrice: product.costPrice,
      discount,
      total: (product.sellPrice * quantity) - discount
    });
  }
  
  return items;
}

// Mock Sales
export const mockSales: Sale[] = mockCustomers.flatMap(customer => {
  // Create 1-3 sales per customer
  const numSales = Math.floor(Math.random() * 3) + 1;
  const sales: Sale[] = [];
  
  for (let i = 0; i < numSales; i++) {
    const items = createMockSaleItems(customer.id);
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const totalCost = items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
    const profit = totalAmount - totalCost;
    
    // Random date in the last 3 months
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 3));
    date.setDate(Math.floor(Math.random() * 28) + 1);
    
    sales.push({
      id: `sale-${customer.id}-${i}`,
      customer,
      items,
      totalAmount,
      profit,
      paymentMethod: Math.random() > 0.5 ? "transfer" : "cash",
      status: "completed",
      createdAt: date,
      followedUp: Math.random() > 0.5,
      notes: Math.random() > 0.7 ? "Customer requested express delivery" : undefined
    });
  }
  
  return sales;
});

// Mock Expenses
export const mockExpenses: Expense[] = [
  {
    id: "exp1",
    description: "Office Rent",
    amount: 5000000,
    category: "Rent",
    date: new Date("2023-04-01")
  },
  {
    id: "exp2",
    description: "Utilities",
    amount: 1200000,
    category: "Utilities",
    date: new Date("2023-04-05")
  },
  {
    id: "exp3",
    description: "Internet and Phone",
    amount: 800000,
    category: "Utilities",
    date: new Date("2023-04-05")
  },
  {
    id: "exp4",
    description: "Staff Salaries",
    amount: 15000000,
    category: "Salary",
    date: new Date("2023-04-10")
  },
  {
    id: "exp5",
    description: "Product Delivery",
    amount: 2500000,
    category: "Logistics",
    date: new Date("2023-04-12")
  },
  {
    id: "exp6",
    description: "Marketing Materials",
    amount: 3000000,
    category: "Marketing",
    date: new Date("2023-04-15")
  },
  {
    id: "exp7",
    description: "Raw Materials",
    amount: 8500000,
    category: "Inventory",
    date: new Date("2023-04-18")
  }
];
