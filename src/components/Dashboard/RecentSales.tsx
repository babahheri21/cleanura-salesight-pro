
import React from "react";
import { useData } from "../../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { formatDistance } from "date-fns";
import { id } from "date-fns/locale";

const RecentSales = () => {
  const { sales } = useData();
  
  // Get the five most recent sales
  const recentSales = [...sales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(sale.customer.name)}&background=1A6DF0&color=fff`}
                  alt={sale.customer.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">{sale.customer.name}</h3>
                  <p className="text-sm font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(sale.totalAmount)}
                  </p>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <p>{sale.items.length} items</p>
                  <p>
                    {formatDistance(new Date(sale.createdAt), new Date(), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSales;
