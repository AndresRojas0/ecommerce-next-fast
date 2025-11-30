import { Layout } from "@/components/layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileSpreadsheet, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import * as XLSX from 'xlsx';

export default function AdminInventory() {
  const { products, bulkUpsertProducts } = useStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        // Map Spanish columns to English schema
        const mappedData = data.map((row: any) => ({
          supplierId: row['Proveedor'] || 'unknown',
          article: row['Artículo'],
          code: row['Código'],
          name: row['Descripción'],
          categoryTags: row['Categoría'] ? String(row['Categoría']).split(',').map(s => s.trim()) : [],
          imageId: row['Imagen'],
          price: 0, // Default, as price wasn't in the requested excel spec
          description: row['Descripción']
        }));

        bulkUpsertProducts(mappedData);

        toast({
          title: "Import Successful",
          description: `Processed ${mappedData.length} products from ${file.name}`,
        });
      } catch (err) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "Could not parse the Excel file. Please check the format.",
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">Bulk upload and manage product catalog</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            <Button onClick={triggerFileInput}>
              <Upload className="w-4 h-4 mr-2" />
              Upload .xlsx
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Instructions</CardTitle>
            <CardDescription>
              Upload an Excel file with the following headers: 
              <span className="font-mono text-xs bg-muted px-1 rounded ml-1">Proveedor</span>,
              <span className="font-mono text-xs bg-muted px-1 rounded ml-1">Artículo</span>,
              <span className="font-mono text-xs bg-muted px-1 rounded ml-1">Código</span>,
              <span className="font-mono text-xs bg-muted px-1 rounded ml-1">Descripción</span>,
              <span className="font-mono text-xs bg-muted px-1 rounded ml-1">Categoría</span>,
              <span className="font-mono text-xs bg-muted px-1 rounded ml-1">Imagen</span>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Inventory ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Subcategory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.code || '-'}</TableCell>
                    <TableCell>{p.article || '-'}</TableCell>
                    <TableCell>{p.subcategorySlug}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
