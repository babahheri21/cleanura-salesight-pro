
import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import DashboardSummary from "../components/Dashboard/DashboardSummary";
import SalesChart from "../components/Dashboard/SalesChart";
import RecentSales from "../components/Dashboard/RecentSales";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useData } from "../context/DataContext";
import { WhatsApp } from "lucide-react";
import { Button } from "../components/ui/button";

const Dashboard = () => {
  const { sales, markFollowedUp } = useData();
  
  // Get sales that need follow-up (not followed up yet)
  const needsFollowUp = sales
    .filter((sale) => !sale.followedUp)
    .slice(0, 3);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back to your sales dashboard</p>
      </div>

      <DashboardSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentSales />
        </div>
      </div>

      <div className="mt-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Customer Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            {needsFollowUp.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No customers need follow-up at the moment</p>
            ) : (
              <div className="space-y-4">
                {needsFollowUp.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{sale.customer.name}</p>
                      <p className="text-sm text-gray-500">{sale.customer.phone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => {
                          window.open(
                            `https://wa.me/${sale.customer.phone.replace(/\+/g, "")}`
                          );
                          markFollowedUp(sale.id);
                        }}
                      >
                        <WhatsApp className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markFollowedUp(sale.id)}
                      >
                        Mark Done
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
