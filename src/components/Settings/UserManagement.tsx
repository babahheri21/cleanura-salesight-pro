
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "../ui/select";
import { useData } from "../../context/DataContext";
import { toast } from "sonner";
import { User } from "../../types";
import { Shield, UserPlus, User as UserIcon } from "lucide-react";

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useData();
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user" | "guest",
  });
  
  const [editUser, setEditUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: "admin" | "user" | "guest";
    resetPassword: boolean;
    newPassword: string;
  } | null>(null);
  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      resetPassword: false,
      newPassword: "",
    });
  };
  
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewUserRoleChange = (value: string) => {
    setNewUser(prev => ({
      ...prev,
      role: value as "admin" | "user" | "guest"
    }));
  };
  
  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editUser) return;
    
    const { name, value } = e.target;
    setEditUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value
      };
    });
  };
  
  const handleEditUserRoleChange = (value: string) => {
    if (!editUser) return;
    
    setEditUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        role: value as "admin" | "user" | "guest"
      };
    });
  };
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // In a real app, this would add the user to the database
    toast.success(`User ${newUser.name} added successfully`);
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user"
    });
    setIsAddingUser(false);
  };
  
  const handleUpdateUser = () => {
    if (!editUser || !editUser.name || !editUser.email) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (editUser.resetPassword && !editUser.newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    
    // In a real app, this would update the user in the database
    toast.success(`User ${editUser.name} updated successfully`);
    setSelectedUser(null);
    setEditUser(null);
  };
  
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // In a real app, this would delete the user from the database
    toast.success(`User ${selectedUser.name} deleted successfully`);
    setSelectedUser(null);
    setEditUser(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button 
          onClick={() => setIsAddingUser(true)}
          className="bg-cleanura-600 hover:bg-cleanura-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>
      
      {/* User List */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* In a real app, this would come from the backend */}
            {[
              { id: "user-1", name: "Admin User", email: "admin@cleanura.com", role: "admin" as const },
              { id: "user-2", name: "Staff User", email: "user@cleanura.com", role: "user" as const },
              { id: "user-3", name: "Guest Account", email: "guest@cleanura.com", role: "guest" as const },
            ].map((user) => (
              <div 
                key={user.id}
                className={`p-4 rounded-lg border ${
                  selectedUser?.id === user.id ? 'border-cleanura-500 bg-cleanura-50' : 'border-gray-200'
                } cursor-pointer hover:border-cleanura-300`}
                onClick={() => handleSelectUser(user)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'user'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <Shield className="mr-1 h-3 w-3" />
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Add New User Form */}
      {isAddingUser && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>
              Create a new user account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newName">Full Name</Label>
                <Input
                  id="newName"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newEmail">Email Address</Label>
                <Input
                  id="newEmail"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password</Label>
                <Input
                  id="newPassword"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newRole">Role</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={handleNewUserRoleChange}
                >
                  <SelectTrigger id="newRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddingUser(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddUser}
                className="bg-cleanura-600 hover:bg-cleanura-700"
              >
                Create User
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Edit User Form */}
      {selectedUser && editUser && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
            <CardDescription>
              Modify user account details and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditUserChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email Address</Label>
                <Input
                  id="editEmail"
                  name="email"
                  type="email"
                  value={editUser.email}
                  onChange={handleEditUserChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select 
                value={editUser.role} 
                onValueChange={handleEditUserRoleChange}
              >
                <SelectTrigger id="editRole">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="resetPassword"
                  checked={editUser.resetPassword}
                  onChange={(e) => {
                    setEditUser(prev => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        resetPassword: e.target.checked
                      };
                    });
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-cleanura-600 focus:ring-cleanura-500"
                />
                <Label htmlFor="resetPassword">Reset Password</Label>
              </div>
              
              {editUser.resetPassword && (
                <div className="mt-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={editUser.newPassword}
                    onChange={handleEditUserChange}
                    placeholder="Minimum 8 characters"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
              >
                Delete User
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedUser(null);
                    setEditUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateUser}
                  className="bg-cleanura-600 hover:bg-cleanura-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
