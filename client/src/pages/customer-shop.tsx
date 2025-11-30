import { Layout } from "@/components/layout";
import { useStore, Product } from "@/lib/store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerShop() {
  const { 
    products, 
    collections, 
    categories, 
    subcollections, 
    subcategories,
    addToCart 
  } = useStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                            product.description.toLowerCase().includes(search.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory !== "all") {
        // Direct match or check via subcategory->subcollection->category
        const subcat = subcategories.find(s => s.slug === product.subcategorySlug);
        const subcol = subcat ? subcollections.find(s => s.id === subcat.subcollectionId) : null;
        matchesCategory = subcol?.categorySlug === selectedCategory;
      } else if (selectedCollection !== "all") {
        // Check via collection
        const subcat = subcategories.find(s => s.slug === product.subcategorySlug);
        const subcol = subcat ? subcollections.find(s => s.id === subcat.subcollectionId) : null;
        const cat = subcol ? categories.find(c => c.slug === subcol.categorySlug) : null;
        matchesCategory = cat?.collectionId === selectedCollection;
      }

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCollection, selectedCategory, subcategories, subcollections, categories]);

  const handleAddToCart = (product: Product) => {
    addToCart(product.id, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
            <p className="text-muted-foreground">Browse our complete catalog</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-8" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {collections.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground relative">
                {/* Placeholder for Image */}
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                  <span className="text-4xl font-thin text-secondary-foreground/20">IMG</span>
                </div>
                <Badge variant="secondary" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
                  {subcategories.find(s => s.slug === product.subcategorySlug)?.name}
                </Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg line-clamp-1" title={product.name}>{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {product.description}
                </p>
                <div className="text-xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => handleAddToCart(product)}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
