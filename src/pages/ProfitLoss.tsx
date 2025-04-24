
import React, { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { useData } from "../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  getYear,
  getMonth,
  setMonth,
  setYear,
} from "date-fns";
import { Download, Printer } from "lucide-react";
import { Label } from "../components/ui/label";

const ProfitLoss = () => {
  const { sales, expenses } = useData();
  const currentDate = new Date();
  
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentDate));
  const [selectedYear, setSelectedYear] = useState(getYear(currentDate));
  
  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];
  
  // Create an array of years for the dropdown (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: getYear(currentDate) - i,
    label: String(getYear(currentDate) - i),
  }));
  
  // Set the start and end dates for the selected month and year
  const startDate = startOfMonth(setYear(setMonth(new Date(), selectedMonth), selectedYear));
  const endDate = endOfMonth(setYear(setMonth(new Date(), selectedMonth), selectedYear));
  
  // Filter sales and expenses for the selected period
  const filteredSales = sales.filter(
    (sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    }
  );
  
  const filteredExpenses = expenses.filter(
    (expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    }
  );
  
  // Calculate revenue
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  
  // Calculate cost of goods sold
  const costOfGoodsSold = filteredSales.reduce((sum, sale) => {
    const costPrice = sale.product.costPrice || 0;
    return sum + (costPrice * sale.quantity);
  }, 0);
  
  // Calculate expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate gross profit
  const grossProfit = totalRevenue - costOfGoodsSold;
  
  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate net profit
  const netProfit = grossProfit - totalExpenses;
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <MainLayout requiredRole="admin">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Profit & Loss Statement</h1>
          <p className="text-gray-500">Financial performance for the selected period</p>
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

      <div className="flex space-x-4 mb-6 print:hidden">
        <div className="w-40">
          <Label htmlFor="monthSelect" className="mb-2 block">Month</Label>
          <Select
            value={String(selectedMonth)}
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={String(month.value)}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-32">
          <Label htmlFor="yearSelect" className="mb-2 block">Year</Label>
          <Select
            value={String(selectedYear)}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={String(year.value)}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-none shadow-sm mb-6">
        <CardHeader className="pb-2 print:pb-0">
          <CardTitle className="text-xl">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-3">Sales Revenue</td>
                <td className="py-3 text-right font-medium">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalRevenue)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-3 font-semibold">Total Revenue</td>
                <td className="py-3 text-right font-semibold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalRevenue)}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm mb-6">
        <CardHeader className="pb-2 print:pb-0">
          <CardTitle className="text-xl">Cost of Goods Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-3">Product Costs</td>
                <td className="py-3 text-right font-medium">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(costOfGoodsSold)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-3 font-semibold">Total COGS</td>
                <td className="py-3 text-right font-semibold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(costOfGoodsSold)}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm mb-6 bg-gray-50">
        <CardHeader className="pb-2 print:pb-0">
          <CardTitle className="text-xl">Gross Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p className="font-semibold">Revenue - Cost of Goods Sold</p>
            <p className="font-bold text-xl">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(grossProfit)}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Gross Profit Margin: {((grossProfit / totalRevenue) * 100).toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm mb-6">
        <CardHeader className="pb-2 print:pb-0">
          <CardTitle className="text-xl">Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody>
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <tr key={category} className="border-b last:border-none">
                  <td className="py-3">{category}</td>
                  <td className="py-3 text-right font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="py-3 font-semibold">Total Expenses</td>
                <td className="py-3 text-right font-semibold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(totalExpenses)}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm mb-6 bg-gray-50">
        <CardHeader className="pb-2 print:pb-0">
          <CardTitle className="text-xl">Net Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p className="font-semibold">Gross Profit - Expenses</p>
            <p className={`font-bold text-xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(netProfit)}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Net Profit Margin: {((netProfit / totalRevenue) * 100).toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 px-4 py-3 bg-white border rounded-lg print:hidden">
        <p className="text-sm text-gray-500">
          This profit and loss statement represents the financial performance for the period from {format(startDate, "d MMMM yyyy")} to {format(endDate, "d MMMM yyyy")}. 
          For any discrepancies, please contact the accounting department.
        </p>
      </div>
    </MainLayout>
  );
};

export default ProfitLoss;
