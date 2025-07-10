
"use client";

import { Users } from "lucide-react";
import withAuth from "@/components/with-auth";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="h-8 w-8 text-primary"/> Usuários</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Em Construção</CardTitle>
          <CardDescription>
            Esta seção para gerenciamento de usuários está sendo preparada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <p className="text-muted-foreground">Em breve, você poderá visualizar, editar e gerenciar todos os usuários do sistema aqui.</p>
            <p className="mt-2 text-sm text-muted-foreground">Agradecemos a sua paciência!</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default withAuth(AdminUsersPage);
