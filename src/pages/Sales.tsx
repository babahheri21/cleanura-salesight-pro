
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { format } from "date-fns";
import { MessageSquare, Edit, Trash2, Plus, Search } from "lucide-react";
import { Sale, Customer, Product } from "../types";

const Sales = () => {
  const { sales, customers, products, addSale, updateSale, deleteSale, markFollowedUp } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    productId: "",
    quantity: 1,
    totalPrice: 0,
    notes: "",
  });

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.product?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // If product is selected, update total price based on product price and quantity
    if (name === "productId") {
      const product = products.find(p => p.id === value);
      if (product) {
        setFormData(prev => ({
          ...prev,
          totalPrice: product.sellPrice * prev.quantity
        }));
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Number(e.target.value);
    setFormData(prev => {
      const product = products.find(p => p.id === prev.productId);
      return {
        ...prev,
        quantity,
        totalPrice: product ? product.sellPrice * quantity : prev.totalPrice
      };
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    const selectedProduct = products.find(p => p.id === formData.productId);
    
    if (selectedCustomer && selectedProduct) {
      addSale({
        customer: selectedCustomer,
        items: [{
          id: `item-${Date.now()}`,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity: formData.quantity,
          sellPrice: selectedProduct.sellPrice,
          costPrice: selectedProduct.costPrice,
          discount: 0,
          total: formData.totalPrice
        }],
        totalAmount: formData.totalPrice,
        profit: formData.totalPrice - (selectedProduct.costPrice * formData.quantity),
        paymentMethod: "cash",
        status: "completed",
        notes: formData.notes,
        followedUp: false
      });
      
      setFormData({
        customerId: "",
        productId: "",
        quantity: 1,
        totalPrice: 0,
        notes: "",
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSale) {
      const selectedCustomer = customers.find(c => c.id === formData.customerId);
      const selectedProduct = products.find(p => p.id === formData.productId);
      
      if (selectedCustomer && selectedProduct) {
        updateSale({
          ...selectedSale,
          customer: selectedCustomer,
          items: [{
            id: selectedSale.items[0]?.id || `item-${Date.now()}`,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            quantity: formData.quantity,
            sellPrice: selectedProduct.sellPrice,
            costPrice: selectedProduct.costPrice,
            discount: 0,
            total: formData.totalPrice
          }],
          totalAmount: formData.totalPrice,
          profit: formData.totalPrice - (selectedProduct.costPrice * formData.quantity),
          notes: formData.notes,
        });
        setIsEditDialogOpen(false);
      }
    }
  };

  const handleEditClick = (sale: Sale) => {
    setSelectedSale(sale);
    const productId = sale.items[0]?.productId || "";
    setFormData({
      customerId: sale.customer.id,
      productId: productId,
      quantity: sale.items[0]?.quantity || 1,
      totalPrice: sale.totalAmount,
      notes: sale.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSale) {
      deleteSale(selectedSale.id);
      setIsDeleteDialogOpen(false);
    }
  };

  // Helper function to get sale date
  const getSaleDate = (sale: Sale) => {
    return sale.date || sale.createdAt;
  };

  return (
    <MainLayout requiredRole="user">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-gray-500">Manage your sales transactions</p>
        </div>
        <Button
          onClick={() => {
            setFormData({
              customerId: "",
              productId: "",
              quantity: 1,
              totalPrice: 0,
              notes: "",
            });
            setIsAddDialogOpen(true);
          }}
          className="bg-cleanura-600 hover:bg-cleanura-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Sale
        </Button>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search sales by customer or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <MessageSquare className="w-6 h-6 mb-1" />
                    <span>No sales found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {format(new Date(getSaleDate(sale)), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <span>{sale.customer.name}</span>
                    {!sale.followedUp && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => {
                          window.open(
                            `https://wa.me/${sale.customer.phone.replace(/\+/g, "")}`
                          );
                          markFollowedUp(sale.id);
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{sale.items[0]?.productName || "N/A"}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {sale.items[0]?.quantity || 0}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(sale.totalAmount)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        sale.followedUp
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {sale.followedUp ? "Followed Up" : "Needs Follow-up"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(sale)}
                        className="h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(sale)}
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

      {/* Add Sale Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Sale</DialogTitle>
            <DialogDescription>
              Record a new sales transaction.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer</Label>
              <Select
                onValueChange={(value) => handleSelectChange("customerId", value)}
                value={formData.customerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productId">Product</Label>
              <Select
                onValueChange={(value) => handleSelectChange("productId", value)}
                value={formData.productId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.sellPrice)}
                      )
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalPrice">Total Price (Rp)</Label>
                <Input
                  id="totalPrice"
                  name="totalPrice"
                  type="number"
                  value={formData.totalPrice}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information"
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
                Add Sale
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Sale Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
            <DialogDescription>
              Update the sales transaction information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-customerId">Customer</Label>
              <Select
                onValueChange={(value) => handleSelectChange("customerId", value)}
                value={formData.customerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-productId">Product</Label>
              <Select
                onValueChange={(value) => handleSelectChange("productId", value)}
                value={formData.productId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.sellPrice)}
                      )
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-totalPrice">Total Price (Rp)</Label>
                <Input
                  id="edit-totalPrice"
                  name="totalPrice"
                  type="number"
                  value={formData.totalPrice}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Input
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information"
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
                Update Sale
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
              Are you sure you want to delete this sale record? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {selectedSale && (
            <div className="py-3">
              <p className="font-medium">
                {selectedSale.customer.name} - {selectedSale.items[0]?.productName || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(getSaleDate(selectedSale)), "dd MMM yyyy")} - 
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(selectedSale.totalAmount)}
              </p>
            </div>
          )}

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

export default Sales;
