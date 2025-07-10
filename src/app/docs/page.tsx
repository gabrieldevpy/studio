
"use client";

import { BookOpen } from "lucide-react";
import withAuth from "@/components/with-auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function DocsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><BookOpen className="h-8 w-8 text-primary"/> Documentação</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Em Construção</CardTitle>
          <CardDescription>
            Nossa documentação completa está sendo preparada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <p className="text-muted-foreground">Em breve, você encontrará aqui guias detalhados, exemplos de uso e a documentação completa da API.</p>
            <p className="mt-2 text-sm text-muted-foreground">Agradecemos a sua paciência!</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default withAuth(DocsPage);
