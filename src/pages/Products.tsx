
import React, { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { useData } from "../context/DataContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Package, Edit, Trash2, Plus } from "lucide-react";
import { Product } from "../types";

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sellPrice: 0,
    costPrice: 0,
    stock: 0,
    category: "",
    image: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "sellPrice" || name === "costPrice" || name === "stock" ? Number(value) : value,
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(formData);
    setFormData({
      name: "",
      description: "",
      sellPrice: 0,
      costPrice: 0,
      stock: 0,
      category: "",
      image: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      updateProduct({
        ...selectedProduct,
        ...formData,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      sellPrice: product.sellPrice,
      costPrice: product.costPrice,
      stock: product.stock,
      category: product.category,
      image: product.image || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <MainLayout requiredRole="user">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Button
          onClick={() => {
            setFormData({
              name: "",
              description: "",
              sellPrice: 0,
              costPrice: 0,
              stock: 0,
              category: "",
              image: "",
            });
            setIsAddDialogOpen(true);
          }}
          className="bg-cleanura-600 hover:bg-cleanura-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="border-none shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-100 relative">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{product.name}</span>
                <span className="text-sm font-semibold bg-cleanura-50 text-cleanura-700 px-2 py-1 rounded">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(product.sellPrice)}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-500 h-12 overflow-hidden">
                {product.description}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Cost Price</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(product.costPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Stock</p>
                  <p className="font-medium">{product.stock} units</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(product)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(product)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sellPrice">Selling Price (Rp)</Label>
                <Input
                  id="sellPrice"
                  name="sellPrice"
                  type="number"
                  value={formData.sellPrice}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price (Rp)</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Cleaning Products"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://..."
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
                Add Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sellPrice">Selling Price (Rp)</Label>
                <Input
                  id="edit-sellPrice"
                  name="sellPrice"
                  type="number"
                  value={formData.sellPrice}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-costPrice">Cost Price (Rp)</Label>
                <Input
                  id="edit-costPrice"
                  name="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Cleaning Products"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL (Optional)</Label>
              <Input
                id="edit-image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://..."
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
                Update Product
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
              Are you sure you want to delete this product? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <p className="font-medium">
              {selectedProduct?.name}
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

export default Products;
