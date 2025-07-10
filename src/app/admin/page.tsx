
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";
import withAuth from "@/components/with-auth";
import { Users, BarChart, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

type User = {
  id: string;
  name: string;
  email: string;
  plan: string;
  createdAt: any; 
  admin?: boolean;
};

type Stats = {
  totalUsers: number;
  totalRoutes: number;
  proPlans: number;
  basicPlans: number;
  freePlans: number;
};

type AdminData = {
    stats: Stats;
    recentUsers: User[];
}

function AdminPage() {
  const [authUser, authLoading] = useAuthState(auth);
  const router = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const fetchAdminData = async () => {
        setLoading(true);
        try {
          const idToken = await authUser.getIdToken();
          const response = await fetch('/api/admin/stats', {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            // The layout will handle the visual "Access Denied" part
            // We can just stop loading here.
            if (response.status === 403) {
              setLoading(false);
              return;
            }
            throw new Error('Failed to fetch admin data');
          }
          const data: AdminData = await response.json();
          // Firestore Timestamps are serialized, so we need to convert them back
          data.recentUsers = data.recentUsers.map(user => ({
            ...user,
            createdAt: user.createdAt ? new Date((user.createdAt as any)._seconds * 1000) : new Date()
          }));
          setAdminData(data);
        } catch (error) {
          console.error("Error fetching admin data:", error);
           toast({
            variant: "destructive",
            title: "Erro ao carregar dados",
            description: "Não foi possível buscar as informações do painel de administração.",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchAdminData();
    }
  }, [authUser]);

  const PageContent = () => {
    if (authLoading || loading) {
       return (
          <>
               <div className="flex items-center mb-6">
                  <h1 className="text-3xl font-bold">Painel do Administrador</h1>
               </div>
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
               </div>
               <Skeleton className="h-96" />
          </>
       )
    }

    return (
      <>
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold">Painel do Administrador</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData?.stats?.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(adminData?.stats?.proPlans || 0) + (adminData?.stats?.basicPlans || 0)}</div>
              <p className="text-xs text-muted-foreground">Pro: {adminData?.stats?.proPlans || 0}, Basic: {adminData?.stats?.basicPlans || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Rotas Criadas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData?.stats?.totalRoutes}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
            <CardDescription>
              Lista dos últimos usuários que se cadastraram.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminData?.recentUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.plan === 'Pro' ? 'default' : user.plan === 'Basic' ? 'secondary' : 'outline'}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.createdAt?.toLocaleDateString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
                 {(adminData?.recentUsers?.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">Nenhum usuário encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <AdminLayout>
      <PageContent />
    </AdminLayout>
  );
}

export default withAuth(AdminPage);
