
import React, { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { useData } from "../context/DataContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

const Settings = () => {
  const { currentUser } = useData();

  const [businessInfo, setBusinessInfo] = useState({
    name: "Cleanura",
    email: "contact@cleanura.com",
    phone: "+6281234567890",
    address: "Jl. Kebersihan No. 123, Bandung, Indonesia",
    website: "www.cleanura.com",
    logo: "",
    taxId: "12.345.678.9-012.000",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    saleAlerts: true,
    lowStockAlerts: true,
    dailySummary: false,
    monthlySummary: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordRequireSpecialChars: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
  });

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (field: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof notificationSettings],
    }));
  };

  const handleSecuritySwitchChange = (field: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof securitySettings],
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  const handleSaveBusinessInfo = () => {
    toast.success("Business information saved successfully");
    // In a real app, this would save to backend
  };

  const handleSaveNotificationSettings = () => {
    toast.success("Notification settings saved successfully");
    // In a real app, this would save to backend
  };

  const handleSaveSecuritySettings = () => {
    toast.success("Security settings saved successfully");
    // In a real app, this would save to backend
  };

  return (
    <MainLayout requiredRole="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Configure your application preferences</p>
      </div>

      <Tabs defaultValue="business" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="business">Business Information</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                Update your business information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="name"
                    value={businessInfo.name}
                    onChange={handleBusinessInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={businessInfo.taxId}
                    onChange={handleBusinessInfoChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Email</Label>
                  <Input
                    id="businessEmail"
                    name="email"
                    type="email"
                    value={businessInfo.email}
                    onChange={handleBusinessInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Phone</Label>
                  <Input
                    id="businessPhone"
                    name="phone"
                    value={businessInfo.phone}
                    onChange={handleBusinessInfoChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Address</Label>
                <Textarea
                  id="businessAddress"
                  name="address"
                  value={businessInfo.address}
                  onChange={handleBusinessInfoChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessWebsite">Website</Label>
                  <Input
                    id="businessWebsite"
                    name="website"
                    value={businessInfo.website}
                    onChange={handleBusinessInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLogo">Logo URL</Label>
                  <Input
                    id="businessLogo"
                    name="logo"
                    value={businessInfo.logo}
                    onChange={handleBusinessInfoChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <Button onClick={handleSaveBusinessInfo} className="bg-cleanura-600 hover:bg-cleanura-700">
                Save Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you want to be notified about your business events.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive updates and alerts via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleSwitchChange("emailNotifications")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sale Alerts</p>
                    <p className="text-sm text-gray-500">
                      Get notified when a new sale is recorded
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.saleAlerts}
                    onCheckedChange={() => handleSwitchChange("saleAlerts")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Stock Alerts</p>
                    <p className="text-sm text-gray-500">
                      Get notified when a product is running low on stock
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={() => handleSwitchChange("lowStockAlerts")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Summary</p>
                    <p className="text-sm text-gray-500">
                      Receive a daily summary of sales and expenses
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.dailySummary}
                    onCheckedChange={() => handleSwitchChange("dailySummary")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Monthly Summary</p>
                    <p className="text-sm text-gray-500">
                      Receive a monthly business performance report
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.monthlySummary}
                    onCheckedChange={() => handleSwitchChange("monthlySummary")}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotificationSettings} className="bg-cleanura-600 hover:bg-cleanura-700">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-factor Authentication</p>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleSecuritySwitchChange("twoFactorAuth")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Special Characters</p>
                    <p className="text-sm text-gray-500">
                      Force passwords to contain special characters
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.passwordRequireSpecialChars}
                    onCheckedChange={() => handleSecuritySwitchChange("passwordRequireSpecialChars")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      name="passwordMinLength"
                      type="number"
                      min={8}
                      value={securitySettings.passwordMinLength}
                      onChange={handleNumberInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      name="sessionTimeout"
                      type="number"
                      min={5}
                      value={securitySettings.sessionTimeout}
                      onChange={handleNumberInputChange}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveSecuritySettings} className="bg-cleanura-600 hover:bg-cleanura-700">
                    Save Security Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-none shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-500">Username</p>
              <p className="font-medium">{currentUser?.username || currentUser?.name}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-500">Role</p>
              <p className="font-medium capitalize">{currentUser?.role}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-500">Last Login</p>
              <p className="font-medium">Today, 09:45 AM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Settings;
