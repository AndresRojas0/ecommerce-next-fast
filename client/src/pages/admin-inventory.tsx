import { Layout } from "@/components/layout";
import {
  useProducts,
  useBulkCreateProducts,
  useSuppliers,
  useSubcategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/lib/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Upload, Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import type { InsertProduct, Product } from "@shared/schema";

export default function AdminInventory() {
  const { data: products = [] } = useProducts();
  const { data: suppliers = [] } = useSuppliers();
  const { data: subcategories = [] } = useSubcategories();
  const bulkCreateProducts = useBulkCreateProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<InsertProduct>>({
    name: "",
    description: "",
    price: 0,
    supplierId: suppliers[0]?.id,
    subcategorySlug: subcategories[0]?.slug,
    article: "",
    code: "",
    slug: "",
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(search.toLowerCase())) ||
      (p.article && p.article.toLowerCase().includes(search.toLowerCase())),
  );

  const getFieldValue = (row: any, ...keys: string[]): string | undefined => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return String(row[key]);
      }
    }
    return undefined;
  };

  const getNameFromDescription = (description: string): string => {
    if (!description) return "Imported Product";
    const words = description.trim().split(/\s+/);
    return words.slice(0, 3).join(' ') || "Imported Product";
  };

  const findSupplierByName = (name: string | undefined): number => {
    if (!name) return suppliers[0]?.id || 1;
    const found = suppliers.find(s => 
      s.name.toLowerCase() === name.toLowerCase() ||
      s.name.toLowerCase().includes(name.toLowerCase())
    );
    return found?.id || suppliers[0]?.id || 1;
  };

  const findSubcategoryByCategory = (category: string | undefined): string => {
    if (!category) return subcategories[0]?.slug || "default";
    const categoryLower = category.toLowerCase().trim();
    const found = subcategories.find(s => 
      s.slug.toLowerCase() === categoryLower ||
      s.name.toLowerCase() === categoryLower ||
      s.slug.toLowerCase().includes(categoryLower) ||
      s.name.toLowerCase().includes(categoryLower)
    );
    return found?.slug || subcategories[0]?.slug || "default";
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const mappedData: InsertProduct[] = data.map((row: any) => {
          const proveedor = getFieldValue(row, 'Proveedor', 'proveedor', 'PROVEEDOR');
          const articulo = getFieldValue(row, 'Artículo', 'Articulo', 'Art', 'ART', 'art', 'articulo', 'ARTICULO');
          const codigo = getFieldValue(row, 'Código', 'Codigo', 'Cod', 'COD', 'cod', 'codigo', 'CODIGO');
          const categoria = getFieldValue(row, 'Categoría', 'Categoria', 'Categorías', 'Categorias', 'categoria', 'categoría', 'CATEGORIA');
          const imagen = getFieldValue(row, 'Imagen', 'imagen', 'IMAGEN', 'Image', 'image');
          const descripcion = getFieldValue(row, 'Descripción', 'Descripcion', 'descripcion', 'descripción', 'DESCRIPCION');
          const precio = getFieldValue(row, 'Precio', 'precio', 'PRECIO', 'Price', 'price');

          return {
            slug: `product-${Math.random().toString(36).substr(2, 9)}`,
            supplierId: findSupplierByName(proveedor),
            article: articulo || undefined,
            code: codigo || undefined,
            categoryTags: categoria ? [categoria.trim()] : undefined,
            name: getNameFromDescription(descripcion || ''),
            description: descripcion || "",
            price: precio ? parseFloat(precio.replace(',', '.')) || 0 : 0,
            subcategorySlug: findSubcategoryByCategory(categoria),
          };
        });

        await bulkCreateProducts.mutateAsync(mappedData);

        toast({
          title: "Import Successful",
          description: `Processed ${mappedData.length} products from ${file.name}`,
        });
      } catch (err) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description:
            "Could not parse the Excel file. Please check the format.",
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      supplierId: suppliers[0]?.id,
      subcategorySlug: subcategories[0]?.slug,
      article: "",
      code: "",
      slug: "",
    });
  };

  const handleCreate = async () => {
    try {
      await createProduct.mutateAsync({
        ...formData,
        slug:
          formData.slug || `product-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name || "New Product",
        description: formData.description || "",
        price: formData.price || 0,
        supplierId: formData.supplierId || suppliers[0]?.id || 1,
        subcategorySlug:
          formData.subcategorySlug || subcategories[0]?.slug || "default",
      } as InsertProduct);
      toast({
        title: "Product Created",
        description: "New product added successfully",
      });
      setCreateOpen(false);
      resetForm();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product",
      });
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      supplierId: product.supplierId,
      subcategorySlug: product.subcategorySlug,
      article: product.article || "",
      code: product.code || "",
      slug: product.slug,
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        data: formData,
      });
      toast({
        title: "Product Updated",
        description: "Changes saved successfully",
      });
      setEditOpen(false);
      setEditingProduct(null);
      resetForm();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({
        title: "Product Deleted",
        description: "Product removed from inventory",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product",
      });
    }
  };

  const ProductForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            data-testid="input-product-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            data-testid="input-product-price"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          data-testid="input-product-description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            data-testid="input-product-code"
            value={formData.code || ""}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="article">Article</Label>
          <Input
            id="article"
            data-testid="input-product-article"
            value={formData.article || ""}
            onChange={(e) =>
              setFormData({ ...formData, article: e.target.value })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Select
            value={String(formData.supplierId)}
            onValueChange={(v) =>
              setFormData({ ...formData, supplierId: parseInt(v) })
            }
          >
            <SelectTrigger data-testid="select-supplier">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Select
            value={formData.subcategorySlug}
            onValueChange={(v) =>
              setFormData({ ...formData, subcategorySlug: v })
            }
          >
            <SelectTrigger data-testid="select-subcategory">
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Inventory Management
            </h1>
            <p className="text-muted-foreground">
              Bulk upload and manage product catalog
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              onClick={triggerFileInput}
              data-testid="button-upload-xlsx"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload .xlsx
            </Button>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  data-testid="button-create-product"
                  onClick={() => resetForm()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your inventory
                  </DialogDescription>
                </DialogHeader>
                <ProductForm />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    data-testid="button-confirm-create"
                    disabled={createProduct.isPending}
                  >
                    {createProduct.isPending ? "Creating..." : "Create Product"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Instructions</CardTitle>
            <CardDescription className="space-y-2">
              <p>Upload an Excel file with the following headers:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Proveedor</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Artículo / Art</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Código / Cod</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Descripción</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Categoría</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Precio</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Imagen</span>
              </div>
              <p className="text-xs mt-2">Product name is generated from the first 3 words of Descripción. Categoría is used to match the subcategory.</p>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Inventory ({products.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                data-testid="input-search-products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((p) => (
                  <TableRow key={p.id} data-testid={`row-product-${p.id}`}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.code || "-"}</TableCell>
                    <TableCell>{p.article || "-"}</TableCell>
                    <TableCell>${p.price.toFixed(2)}</TableCell>
                    <TableCell>{p.subcategorySlug}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(p)}
                        data-testid={`button-edit-product-${p.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-delete-product-${p.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{p.name}"? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(p.id)}
                              data-testid={`button-confirm-delete-${p.id}`}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-8"
                    >
                      {search
                        ? "No products match your search"
                        : "No products in inventory yet"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product information</DialogDescription>
            </DialogHeader>
            <ProductForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                data-testid="button-confirm-update"
                disabled={updateProduct.isPending}
              >
                {updateProduct.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
