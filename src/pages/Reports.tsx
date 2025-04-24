
import React, { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { useData } from "../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Printer } from "lucide-react";
import { Button } from "../components/ui/button";

const Reports = () => {
  const { sales, expenses, products } = useData();
  const [activeTab, setActiveTab] = useState("sales");
  
  // Get data for the current month
  const currentDate = new Date();
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  
  // Get data for the last month
  const startOfLastMonth = startOfMonth(subMonths(currentDate, 1));
  const endOfLastMonth = endOfMonth(subMonths(currentDate, 1));
  
  // Filter sales data for current and last month
  const currentMonthSales = sales.filter(
    (sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= startOfCurrentMonth && saleDate <= endOfCurrentMonth;
    }
  );
  
  const lastMonthSales = sales.filter(
    (sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= startOfLastMonth && saleDate <= endOfLastMonth;
    }
  );
  
  // Calculate total sales for current and last month
  const currentMonthTotalSales = currentMonthSales.reduce(
    (total, sale) => total + sale.totalPrice,
    0
  );
  
  const lastMonthTotalSales = lastMonthSales.reduce(
    (total, sale) => total + sale.totalPrice,
    0
  );
  
  // Filter expenses data for current and last month
  const currentMonthExpenses = expenses.filter(
    (expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfCurrentMonth && expenseDate <= endOfCurrentMonth;
    }
  );
  
  const lastMonthExpenses = expenses.filter(
    (expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfLastMonth && expenseDate <= endOfLastMonth;
    }
  );
  
  // Calculate total expenses for current and last month
  const currentMonthTotalExpenses = currentMonthExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  
  const lastMonthTotalExpenses = lastMonthExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  
  // Calculate profit for current and last month
  const currentMonthProfit = currentMonthTotalSales - currentMonthTotalExpenses;
  const lastMonthProfit = lastMonthTotalSales - lastMonthTotalExpenses;
  
  // Prepare data for sales by product chart
  const productSalesData = products.map((product) => {
    const productSales = sales.filter((sale) => sale.product.id === product.id);
    const totalSales = productSales.reduce((total, sale) => total + sale.totalPrice, 0);
    const totalQuantity = productSales.reduce((total, sale) => total + sale.quantity, 0);
    
    return {
      name: product.name,
      sales: totalSales,
      quantity: totalQuantity,
    };
  });
  
  // Sort product sales data by sales amount (descending)
  productSalesData.sort((a, b) => b.sales - a.sales);
  
  // Prepare data for expenses by category chart
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const expensesByCategoryData = Object.keys(expensesByCategory).map((category) => ({
    name: category,
    value: expensesByCategory[category],
  }));
  
  // Prepare data for monthly comparison chart
  const monthlyComparisonData = [
    {
      name: "Last Month",
      sales: lastMonthTotalSales,
      expenses: lastMonthTotalExpenses,
      profit: lastMonthProfit,
    },
    {
      name: "This Month",
      sales: currentMonthTotalSales,
      expenses: currentMonthTotalExpenses,
      profit: currentMonthProfit,
    },
  ];
  
  // Pie chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"];
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-500">View and analyze your business performance</p>
        </div>
        <div className="flex space-x-2 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(currentMonthTotalSales)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {currentMonthTotalSales > lastMonthTotalSales ? (
                <span className="text-green-600">
                  +
                  {Math.round(
                    ((currentMonthTotalSales - lastMonthTotalSales) / lastMonthTotalSales) * 100
                  )}
                  % vs last month
                </span>
              ) : (
                <span className="text-red-600">
                  {Math.round(
                    ((currentMonthTotalSales - lastMonthTotalSales) / lastMonthTotalSales) * 100
                  )}
                  % vs last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(currentMonthTotalExpenses)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {currentMonthTotalExpenses < lastMonthTotalExpenses ? (
                <span className="text-green-600">
                  -
                  {Math.round(
                    ((lastMonthTotalExpenses - currentMonthTotalExpenses) / lastMonthTotalExpenses) * 100
                  )}
                  % vs last month
                </span>
              ) : (
                <span className="text-red-600">
                  +
                  {Math.round(
                    ((currentMonthTotalExpenses - lastMonthTotalExpenses) / lastMonthTotalExpenses) * 100
                  )}
                  % vs last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(currentMonthProfit)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {currentMonthProfit > lastMonthProfit ? (
                <span className="text-green-600">
                  +
                  {Math.round(
                    ((currentMonthProfit - lastMonthProfit) / Math.abs(lastMonthProfit)) * 100
                  )}
                  % vs last month
                </span>
              ) : (
                <span className="text-red-600">
                  {Math.round(
                    ((currentMonthProfit - lastMonthProfit) / Math.abs(lastMonthProfit)) * 100
                  )}
                  % vs last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sales" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Monthly Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Sales by Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productSalesData.slice(0, 10)}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 80,
                    }}
                  >
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      height={80}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("id-ID", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(value))
                      }
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#22c55e" name="Total Sales (Rp)" />
                    <Bar dataKey="quantity" fill="#3b82f6" name="Quantity Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expensesByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(value))
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Month-to-Month Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyComparisonData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("id-ID", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(Number(value))
                      }
                    />
                    <Legend />
                    <Bar dataKey="sales" name="Sales" fill="#3b82f6" />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    <Bar dataKey="profit" name="Profit" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="border-none shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Your sales are showing a {currentMonthTotalSales > lastMonthTotalSales ? "positive" : "negative"} trend compared to last month.
            {currentMonthTotalSales > lastMonthTotalSales
              ? " Keep up the good work!"
              : " Let's focus on increasing sales for next month."}
          </p>
          <p className="text-sm text-gray-500">
            Report generated on {format(new Date(), "dd MMMM yyyy")}
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Reports;
