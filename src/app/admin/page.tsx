
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, getCountFromServer } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";
import withAuth from "@/components/with-auth";
import { Users, BarChart, FileText } from "lucide-react";
import { db } from "@/lib/firebase";
import { useUserData } from "@/hooks/use-user-data";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

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

function AdminPage() {
  const { userData, loading: userLoading } = useUserData();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && userData && !userData.admin) {
      router.replace('/dashboard');
      toast({
        variant: 'destructive',
        title: 'Acesso Negado',
        description: 'Você não tem permissão para acessar esta página.',
      });
    }
  }, [userData, userLoading, router]);

  useEffect(() => {
    if (userData?.admin) {
      const fetchAdminData = async () => {
        setLoading(true);
        try {
          // Fetch Users
          const usersSnapshot = await getDocs(collection(db, "users"));
          const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
          setUsers(usersData);

          // Fetch Stats
          const usersCount = (await getCountFromServer(collection(db, "users"))).data().count;
          const routesCount = (await getCountFromServer(collection(db, "routes"))).data().count;
          
          let proPlans = 0;
          let basicPlans = 0;
          let freePlans = 0;
          usersData.forEach(user => {
            if (user.plan === 'Pro') proPlans++;
            else if (user.plan === 'Basic') basicPlans++;
            else freePlans++;
          });

          setStats({
            totalUsers: usersCount,
            totalRoutes: routesCount,
            proPlans,
            basicPlans,
            freePlans,
          });

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
  }, [userData]);
  
  const recentUsers = users.sort((a,b) => b.createdAt?.toDate() - a.createdAt?.toDate()).slice(0, 5);

  if (userLoading || loading || !userData?.admin) {
     return (
        <AdminLayout>
             <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold">Painel do Administrador</h1>
             </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
             </div>
             <Skeleton className="h-96" />
        </AdminLayout>
     )
  }

  return (
    <AdminLayout>
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
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.proPlans || 0 + stats?.basicPlans || 0}</div>
            <p className="text-xs text-muted-foreground">Pro: {stats?.proPlans || 0}, Basic: {stats?.basicPlans || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Rotas Criadas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRoutes}</div>
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
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.plan === 'Pro' ? 'default' : user.plan === 'Basic' ? 'secondary' : 'outline'}>
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt?.toDate().toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
              ))}
               {recentUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">Nenhum usuário encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default withAuth(AdminPage);
