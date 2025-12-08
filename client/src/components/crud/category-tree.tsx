import { 
  useCollections, useCategories, useSubcollections, useSubcategories,
  useCreateCollection, useUpdateCollection, useDeleteCollection,
  useCreateCategory, useUpdateCategory, useDeleteCategory,
  useCreateSubcollection, useUpdateSubcollection, useDeleteSubcollection,
  useCreateSubcategory, useUpdateSubcategory, useDeleteSubcategory
} from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Folder, FolderOpen, Tag, Layers, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Collection, Category, Subcollection, Subcategory } from "@shared/schema";

type EntityType = "collection" | "category" | "subcollection" | "subcategory";

export default function CategoryTree() {
  const { data: collections = [] } = useCollections();
  const { data: categories = [] } = useCategories();
  const { data: subcollections = [] } = useSubcollections();
  const { data: subcategories = [] } = useSubcategories();
  
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  
  const createSubcollection = useCreateSubcollection();
  const updateSubcollection = useUpdateSubcollection();
  const deleteSubcollection = useDeleteSubcollection();
  
  const createSubcategory = useCreateSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();
  
  const { toast } = useToast();
  
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [entityType, setEntityType] = useState<EntityType>("collection");
  const [parentId, setParentId] = useState<string | number | null>(null);
  const [editingEntity, setEditingEntity] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
  });

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const resetForm = () => {
    setFormData({ name: "", slug: "", image: "" });
    setEditingEntity(null);
  };
  
  const openCreateDialog = (type: EntityType, parent?: string | number) => {
    setDialogMode("create");
    setEntityType(type);
    setParentId(parent || null);
    resetForm();
    setDialogOpen(true);
  };
  
  const openEditDialog = (type: EntityType, entity: any) => {
    setDialogMode("edit");
    setEntityType(type);
    setEditingEntity(entity);
    setFormData({
      name: entity.name,
      slug: entity.slug || "",
      image: entity.image || "",
    });
    setDialogOpen(true);
  };
  
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };
  
  const handleSave = async () => {
    try {
      if (dialogMode === "create") {
        switch (entityType) {
          case "collection":
            await createCollection.mutateAsync({
              name: formData.name,
              slug: formData.slug || generateSlug(formData.name),
            });
            break;
          case "category":
            await createCategory.mutateAsync({
              name: formData.name,
              slug: formData.slug || generateSlug(formData.name),
              collectionId: parentId as number,
              image: formData.image || null,
            });
            break;
          case "subcollection":
            await createSubcollection.mutateAsync({
              name: formData.name,
              categorySlug: parentId as string,
            });
            break;
          case "subcategory":
            await createSubcategory.mutateAsync({
              name: formData.name,
              slug: formData.slug || generateSlug(formData.name),
              subcollectionId: parentId as number,
              image: formData.image || null,
            });
            break;
        }
        toast({ title: "Created", description: `${entityType} created successfully` });
      } else {
        switch (entityType) {
          case "collection":
            await updateCollection.mutateAsync({
              id: editingEntity.id,
              data: { name: formData.name, slug: formData.slug },
            });
            break;
          case "category":
            await updateCategory.mutateAsync({
              slug: editingEntity.slug,
              data: { name: formData.name, image: formData.image || null },
            });
            break;
          case "subcollection":
            await updateSubcollection.mutateAsync({
              id: editingEntity.id,
              data: { name: formData.name },
            });
            break;
          case "subcategory":
            await updateSubcategory.mutateAsync({
              slug: editingEntity.slug,
              data: { name: formData.name, image: formData.image || null },
            });
            break;
        }
        toast({ title: "Updated", description: `${entityType} updated successfully` });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: `Failed to save ${entityType}` });
    }
  };
  
  const handleDelete = async (type: EntityType, entity: any) => {
    try {
      switch (type) {
        case "collection":
          await deleteCollection.mutateAsync(entity.id);
          break;
        case "category":
          await deleteCategory.mutateAsync(entity.slug);
          break;
        case "subcollection":
          await deleteSubcollection.mutateAsync(entity.id);
          break;
        case "subcategory":
          await deleteSubcategory.mutateAsync(entity.slug);
          break;
      }
      toast({ title: "Deleted", description: `${type} deleted successfully` });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: `Failed to delete ${type}` });
    }
  };
  
  const DeleteButton = ({ type, entity, label }: { type: EntityType; entity: any; label: string }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" data-testid={`button-delete-${type}-${entity.id || entity.slug}`}>
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {type}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{label}"? 
            {(type === "collection" || type === "category" || type === "subcollection") && 
              " This will also delete all child items."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(type, entity)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Catalog Hierarchy</h2>
        <Button onClick={() => openCreateDialog("collection")} data-testid="button-add-collection">
          <Plus className="w-4 h-4 mr-2" />
          Add Collection
        </Button>
      </div>

      <div className="grid gap-4">
        {collections.map(collection => (
          <Card key={collection.id} className="overflow-hidden">
            <div 
              className="flex items-center gap-2 p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggle(String(collection.id))}
            >
              {expanded[String(collection.id)] ? <FolderOpen className="w-5 h-5 text-primary" /> : <Folder className="w-5 h-5 text-primary" />}
              <span className="font-semibold">{collection.name}</span>
              <Badge variant="outline" className="ml-2 text-xs">Collection</Badge>
              <div className="ml-auto flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => openEditDialog("collection", collection)}
                  data-testid={`button-edit-collection-${collection.id}`}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <DeleteButton type="collection" entity={collection} label={collection.name} />
              </div>
            </div>
            
            {expanded[String(collection.id)] && (
              <div className="border-t">
                {categories
                  .filter(c => c.collectionId === collection.id)
                  .map(category => (
                    <div key={category.slug} className="pl-8 pr-4">
                      <div 
                        className="flex items-center gap-2 py-3 border-b last:border-0 cursor-pointer hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(category.slug);
                        }}
                      >
                        <ChevronRight className={`w-4 h-4 transition-transform ${expanded[category.slug] ? 'rotate-90' : ''}`} />
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{category.name}</span>
                        <div className="ml-auto flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={() => openEditDialog("category", category)}
                            data-testid={`button-edit-category-${category.slug}`}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <DeleteButton type="category" entity={category} label={category.name} />
                        </div>
                      </div>

                      {expanded[category.slug] && (
                        <div className="pl-8 space-y-2 py-2">
                          {subcollections
                            .filter(sc => sc.categorySlug === category.slug)
                            .map(subcol => (
                              <div key={subcol.id} className="border-l-2 border-muted pl-4 py-1">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                                  <Layers className="w-3 h-3" />
                                  {subcol.name}
                                  <div className="ml-auto flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 w-6 p-0"
                                      onClick={() => openEditDialog("subcollection", subcol)}
                                      data-testid={`button-edit-subcollection-${subcol.id}`}
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </Button>
                                    <DeleteButton type="subcollection" entity={subcol} label={subcol.name} />
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1 pl-4">
                                  {subcategories
                                    .filter(sub => sub.subcollectionId === subcol.id)
                                    .map(sub => (
                                      <Badge 
                                        key={sub.slug} 
                                        variant="secondary" 
                                        className="hover:bg-secondary/80 cursor-pointer flex items-center gap-1 pr-1"
                                      >
                                        {sub.name}
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-4 w-4 p-0 ml-1"
                                          onClick={() => openEditDialog("subcategory", sub)}
                                          data-testid={`button-edit-subcategory-${sub.slug}`}
                                        >
                                          <Pencil className="w-2 h-2" />
                                        </Button>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0" data-testid={`button-delete-subcategory-${sub.slug}`}>
                                              <Trash2 className="w-2 h-2 text-destructive" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to delete "{sub.name}"?
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => handleDelete("subcategory", sub)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </Badge>
                                    ))}
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 text-[10px] text-muted-foreground border border-dashed"
                                    onClick={() => openCreateDialog("subcategory", subcol.id)}
                                    data-testid={`button-add-subcategory-${subcol.id}`}
                                  >
                                    + Add Subcategory
                                  </Button>
                                </div>
                              </div>
                            ))}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-muted-foreground mt-2"
                            onClick={() => openCreateDialog("subcollection", category.slug)}
                            data-testid={`button-add-subcollection-${category.slug}`}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Subcollection to {category.name}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                <div className="p-3 pl-8">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground"
                    onClick={() => openCreateDialog("category", collection.id)}
                    data-testid={`button-add-category-${collection.id}`}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Category to {collection.name}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
        
        {collections.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            No collections yet. Click "Add Collection" to get started.
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create" : "Edit"} {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create" 
                ? `Add a new ${entityType} to your catalog structure`
                : `Update the ${entityType} information`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                data-testid="input-entity-name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder={`Enter ${entityType} name`}
              />
            </div>
            {(entityType === "collection" || entityType === "category" || entityType === "subcategory") && dialogMode === "create" && (
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input 
                  id="slug" 
                  data-testid="input-entity-slug"
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  placeholder="Auto-generated if empty"
                />
              </div>
            )}
            {(entityType === "category" || entityType === "subcategory") && (
              <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input 
                  id="image" 
                  data-testid="input-entity-image"
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSave} 
              data-testid="button-save-entity"
              disabled={!formData.name.trim()}
            >
              {dialogMode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
