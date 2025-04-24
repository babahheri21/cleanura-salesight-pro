
import React from "react";
import { useData } from "../../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SalesChart = () => {
  const { sales } = useData();
  
  // Process sales data for chart
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  // Group sales by day
  const salesByDay: Record<string, number> = {};
  
  sales.forEach(sale => {
    const date = new Date(sale.createdAt);
    if (date >= last30Days) {
      const dateStr = date.toISOString().split('T')[0];
      if (salesByDay[dateStr]) {
        salesByDay[dateStr] += sale.totalAmount;
      } else {
        salesByDay[dateStr] = sale.totalAmount;
      }
    }
  });
  
  // Convert to array for chart
  const chartData = Object.entries(salesByDay)
    .map(([date, amount]) => ({
      date,
      amount,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Format for display
  const formattedData = chartData.map(item => ({
    date: new Date(item.date).toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric'
    }),
    amount: item.amount,
  }));

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Sales (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `Rp${value.toLocaleString('id-ID')}`}
            />
            <Tooltip
              formatter={(value) => [`Rp${Number(value).toLocaleString('id-ID')}`, 'Sales']}
            />
            <Bar 
              dataKey="amount" 
              fill="#1a6df0" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
