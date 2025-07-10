
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";
import withAuth from "@/components/with-auth";
import { Users, MoreHorizontal, AlertCircle } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

function AdminUsersPage() {
  const { userData, loading: userLoading } = useUserData();
  const [authUser] = useAuthState(auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userLoading) {
      if (userData?.admin) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    }
  }, [userData, userLoading]);

  useEffect(() => {
    if (isAuthorized && authUser) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
           const idToken = await authUser.getIdToken();
           const response = await fetch('/api/admin/users', {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          const usersData: User[] = await response.json();
          // Firestore Timestamps are serialized, so we need to convert them back
           setUsers(usersData.map(user => ({
            ...user,
            createdAt: user.createdAt ? new Date((user.createdAt as any)._seconds * 1000) : new Date()
          })));
        } catch (error) {
          console.error("Error fetching users:", error);
          toast({
            variant: "destructive",
            title: "Erro ao carregar usuários",
            description: "Não foi possível buscar a lista de usuários.",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isAuthorized, authUser]);

  if (userLoading || loading || isAuthorized === null) {
    return (
      <AdminLayout>
        <div className="flex items-center mb-6">
          <Users className="h-8 w-8 mr-2" />
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
        </div>
        <Card>
          <CardHeader>
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  if (!isAuthorized) {
    return (
      <AdminLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Você não tem permissão para visualizar esta página.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 mr-2" />
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os usuários cadastrados na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.plan === 'Pro' ? 'default' : user.plan === 'Basic' ? 'secondary' : 'outline'}>
                      {user.plan}
                    </Badge>
                  </TableCell>
                   <TableCell>
                     {user.admin ? <Badge>Sim</Badge> : <Badge variant="secondary">Não</Badge>}
                   </TableCell>
                  <TableCell>{user.createdAt?.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Alternar menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar Usuário</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Banir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default withAuth(AdminUsersPage);
