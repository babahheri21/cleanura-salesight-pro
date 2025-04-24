
import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import { useData } from "../context/DataContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { format } from "date-fns";
import { Download, Printer } from "lucide-react";

const BalanceSheet = () => {
  const { getBalanceSheet } = useData();
  const balanceSheet = getBalanceSheet();

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout requiredRole="admin">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Balance Sheet</h1>
          <p className="text-gray-500">Financial position as of {format(new Date(balanceSheet.date), "d MMMM yyyy")}</p>
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

      <Card className="border-none shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody>
              {balanceSheet.assets.map((item, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3 text-right font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item.amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="py-3 font-semibold">Total Assets</td>
                <td className="py-3 text-right font-semibold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(
                    balanceSheet.assets.reduce(
                      (sum, asset) => sum + asset.amount,
                      0
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody>
              {balanceSheet.liabilities.map((item, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3 text-right font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item.amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="py-3 font-semibold">Total Liabilities</td>
                <td className="py-3 text-right font-semibold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(
                    balanceSheet.liabilities.reduce(
                      (sum, liability) => sum + liability.amount,
                      0
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Equity</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody>
              {balanceSheet.equity.map((item, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3 text-right font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item.amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="py-3 font-semibold">Total Equity</td>
                <td className="py-3 text-right font-semibold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(
                    balanceSheet.equity.reduce(
                      (sum, equity) => sum + equity.amount,
                      0
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-gray-50 border rounded-lg">
        <div className="flex justify-between items-center">
          <p className="font-semibold">Total Liabilities and Equity</p>
          <p className="font-bold text-xl">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(
              balanceSheet.liabilities.reduce(
                (sum, liability) => sum + liability.amount,
                0
              ) +
                balanceSheet.equity.reduce(
                  (sum, equity) => sum + equity.amount,
                  0
                )
            )}
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default BalanceSheet;
