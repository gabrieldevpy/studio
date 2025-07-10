
"use client";

import { Settings } from "lucide-react";
import withAuth from "@/components/with-auth";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Settings className="h-8 w-8 text-primary"/> Configurações</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Em Construção</CardTitle>
          <CardDescription>
            Esta seção de configurações gerais do sistema está sendo preparada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <p className="text-muted-foreground">Em breve, você poderá gerenciar as configurações da aplicação aqui.</p>
            <p className="mt-2 text-sm text-muted-foreground">Agradecemos a sua paciência!</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default withAuth(AdminSettingsPage);
