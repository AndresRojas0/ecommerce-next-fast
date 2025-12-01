import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Folder, FolderOpen, Tag, Layers } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function CategoryTree() {
  const { collections, categories, subcollections, subcategories } = useStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Catalog Hierarchy</h2>
        <Button variant="outline" onClick={() => alert("Full hierarchy editor coming in next sprint (Prototype Constraint)")}>Manage Hierarchy</Button>
      </div>

      <div className="grid gap-4">
        {collections.map(collection => (
          <Card key={collection.id} className="overflow-hidden">
            <div 
              className="flex items-center gap-2 p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggle(collection.id)}
            >
              {expanded[collection.id] ? <FolderOpen className="w-5 h-5 text-primary" /> : <Folder className="w-5 h-5 text-primary" />}
              <span className="font-semibold">{collection.name}</span>
              <Badge variant="outline" className="ml-auto text-xs">Collection</Badge>
            </div>
            
            {expanded[collection.id] && (
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
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1 pl-4">
                                  {subcategories
                                    .filter(sub => sub.subcollectionId === subcol.id)
                                    .map(sub => (
                                      <Badge key={sub.slug} variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                                        {sub.name}
                                      </Badge>
                                    ))}
                                    <Button variant="ghost" size="sm" className="h-5 text-[10px] text-muted-foreground border border-dashed">
                                      + Add Sub
                                    </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="p-3 pl-8">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                      + Add Category to {collection.name}
                    </Button>
                  </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
