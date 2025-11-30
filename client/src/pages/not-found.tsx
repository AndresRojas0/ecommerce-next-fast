import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md border-destructive/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Page Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            The page you are looking for does not exist or you do not have permission to view it.
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
