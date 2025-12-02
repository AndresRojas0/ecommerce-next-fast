import { useSuppliers, useCreateSupplier } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SupplierManager() {
  const { data: suppliers = [] } = useSuppliers();
  const createSupplier = useCreateSupplier();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    contact: ""
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.contact) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Name and Contact are required." });
      return;
    }

    try {
      await createSupplier.mutateAsync(formData);
      toast({ title: "Supplier Added", description: `${formData.name} has been created.` });
      setIsDialogOpen(false);
      setFormData({ name: "", contact: "" });
      setEditingId(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create supplier." });
    }
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
