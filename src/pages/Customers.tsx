
import React, { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { useData } from "../context/DataContext";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { format } from "date-fns";
import { Users, Edit, Trash2, Plus, Search, MessageSquare } from "lucide-react";
import { Customer } from "../types";

const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(formData);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomer) {
      updateCustomer({
        ...selectedCustomer,
        ...formData,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <MainLayout requiredRole="user">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-gray-500">Manage your customer database</p>
        </div>
        <Button
          onClick={() => {
            setFormData({
              name: "",
              phone: "",
              email: "",
              address: "",
            });
            setIsAddDialogOpen(true);
          }}
          className="bg-cleanura-600 hover:bg-cleanura-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search customers by name, phone or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Registration Date</TableHead>
              <TableHead className="hidden md:table-cell">Last Purchase</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Users className="w-6 h-6 mb-1" />
                    <span>No customers found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <span>{customer.phone}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => window.open(`https://wa.me/${customer.phone.replace(/\+/g, "")}`)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.email || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(customer.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {customer.lastPurchase
                      ? format(new Date(customer.lastPurchase), "dd MMM yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(customer)}
                        className="h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(customer)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your database.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +628123456789"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="customer@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Customer address"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-cleanura-600 hover:bg-cleanura-700">
                Add Customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Customer Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +628123456789"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email (Optional)</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="customer@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address (Optional)</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Customer address"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-cleanura-600 hover:bg-cleanura-700">
                Update Customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <p className="font-medium">
              {selectedCustomer?.name}
            </p>
            <p className="text-sm text-gray-500">
              {selectedCustomer?.phone}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Customers;
