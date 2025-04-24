
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useData } from "../../context/DataContext";
import { User } from "../../types";
import { toast } from "sonner";
import { Shield, Key } from "lucide-react";

interface AccountSettingsProps {
  currentUser: User | null;
}

const AccountSettings = ({ currentUser }: AccountSettingsProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpdateProfile = () => {
    // In a real app, this would update the user's profile in the backend
    toast.success("Profile updated successfully");
  };
  
  const handlePasswordChange = () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    // In a real app, this would check the current password and update to the new one
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal information and account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="profileName">Full Name</Label>
              <Input
                id="profileName"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileEmail">Email Address</Label>
              <Input
                id="profileEmail"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profileAvatar">Profile Picture URL</Label>
            <Input
              id="profileAvatar"
              name="avatar"
              placeholder="https://..."
              value={profile.avatar}
              onChange={handleProfileChange}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm font-medium">Role</p>
              <p className="text-sm text-gray-500 capitalize">{currentUser?.role}</p>
            </div>
            <Shield className="ml-2 text-blue-500" />
          </div>
          
          <Button onClick={handleUpdateProfile} className="bg-cleanura-600 hover:bg-cleanura-700">
            Update Profile
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Change Password</CardTitle>
            <Key className="text-yellow-500" />
          </div>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handlePasswordChange} className="bg-cleanura-600 hover:bg-cleanura-700">
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
