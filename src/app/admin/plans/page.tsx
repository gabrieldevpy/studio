
"use client";

import { ShieldCheck } from "lucide-react";
import withAuth from "@/components/with-auth";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function AdminPlansPage() {
  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><ShieldCheck className="h-8 w-8 text-primary"/> Planos e Assinaturas</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Em Construção</CardTitle>
          <CardDescription>
            Esta seção para gerenciamento de planos e assinaturas está sendo preparada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <p className="text-muted-foreground">Em breve, você poderá visualizar e gerenciar os planos dos usuários e as assinaturas.</p>
            <p className="mt-2 text-sm text-muted-foreground">Agradecemos a sua paciência!</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default withAuth(AdminPlansPage);
