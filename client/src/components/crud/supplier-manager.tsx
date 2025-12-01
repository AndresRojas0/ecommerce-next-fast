import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

export default function SupplierManager() {
  const { suppliers, addSupplier } = useStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    contact: ""
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.contact) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Name and Contact are required." });
      return;
    }

    if (editingId) {
      // In a real app we would have an update action, for now we can use a store hack or add an update action
      // For prototype speed, we'll just assume add works for new ones. 
      // TO DO: Add updateSupplier to store.
      toast({ title: "Not Implemented", description: "Update logic would go here." });
    } else {
      addSupplier({
        id: `sup-${nanoid(4)}`,
        ...formData
      });
      toast({ title: "Supplier Added", description: `${formData.name} has been created.` });
    }
    
    setIsDialogOpen(false);
    setFormData({ name: "", contact: "" });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setFormData({ name: "", contact: "" }); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. TechGiant Corp"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Email/Phone</Label>
                <Input 
                  value={formData.contact} 
                  onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                  placeholder="e.g. sales@techgiant.com"
                />
              </div>
              <Button className="w-full" onClick={handleSubmit}>
                {editingId ? "Save Changes" : "Create Supplier"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{supplier.id}</TableCell>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => {
                    setEditingId(supplier.id);
                    setFormData({ name: supplier.name, contact: supplier.contact });
                    setIsDialogOpen(true);
                  }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
