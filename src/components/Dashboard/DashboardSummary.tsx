
import React from "react";
import { useData } from "../../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, Package, ShoppingCart, CreditCard } from "lucide-react";

const DashboardSummary = () => {
  const { customers, products, sales, expenses } = useData();
  
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const summaryItems = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: <Users className="h-6 w-6 text-cleanura-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="h-6 w-6 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Total Sales",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(totalSales),
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      title: "Total Expenses",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(totalExpenses),
      icon: <CreditCard className="h-6 w-6 text-red-600" />,
      color: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => (
        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold">{item.value}</p>
              <div className={`p-2 rounded-full ${item.color}`}>
                {item.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSummary;
