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
import { exportToCSV } from "../utils/csvExport";

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
  
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: getYear(currentDate) - i,
    label: String(getYear(currentDate) - i),
  }));
  
  const startDate = startOfMonth(setYear(setMonth(new Date(), selectedMonth), selectedYear));
  const endDate = endOfMonth(setYear(setMonth(new Date(), selectedMonth), selectedYear));
  
  const getSaleDate = (sale: any) => sale.date || sale.createdAt;
  
  const filteredSales = sales.filter(
    (sale) => {
      const saleDate = new Date(getSaleDate(sale));
      return saleDate >= startDate && saleDate <= endDate;
    }
  );
  
  const filteredExpenses = expenses.filter(
    (expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    }
  );
  
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + (sale.totalPrice || sale.totalAmount), 0);
  
  const costOfGoodsSold = filteredSales.reduce((sum, sale) => {
    if (sale.items && sale.items.length > 0) {
      return sum + sale.items.reduce((itemSum, item) => itemSum + (item.costPrice * item.quantity), 0);
    } else if (sale.product) {
      const costPrice = sale.product.costPrice || 0;
      return sum + (costPrice * (sale.quantity || 1));
    }
    return sum;
  }, 0);
  
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const grossProfit = totalRevenue - costOfGoodsSold;
  
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const netProfit = grossProfit - totalExpenses;
  
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const exportData = [
      { section: 'Revenue', item: '', amount: '' },
      { section: '', item: 'Sales Revenue', amount: totalRevenue },
      { section: 'Total Revenue', item: '', amount: totalRevenue },
      { section: '', item: '', amount: '' },
      
      { section: 'Cost of Goods Sold', item: '', amount: '' },
      { section: '', item: 'Product Costs', amount: costOfGoodsSold },
      { section: 'Total COGS', item: '', amount: costOfGoodsSold },
      { section: '', item: '', amount: '' },
      
      { section: 'Gross Profit', item: '', amount: grossProfit },
      { 
        section: 'Gross Profit Margin', 
        item: '', 
        amount: `${totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) : "0.00"}%` 
      },
      { section: '', item: '', amount: '' },
      
      { section: 'Expenses', item: '', amount: '' },
      ...Object.entries(expensesByCategory).map(([category, amount]) => ({
        section: '',
        item: category,
        amount: amount
      })),
      { section: 'Total Expenses', item: '', amount: totalExpenses },
      { section: '', item: '', amount: '' },
      
      { section: 'Net Profit', item: '', amount: netProfit },
      { 
        section: 'Net Profit Margin', 
        item: '', 
        amount: `${totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : "0.00"}%` 
      }
    ];

    exportToCSV(exportData, `profit-loss-${format(startDate, "yyyy-MM")}`);
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
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
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
            Gross Profit Margin: {totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(2) : "0.00"}%
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
            Net Profit Margin: {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : "0.00"}%
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
