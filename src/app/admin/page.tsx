
"use client";

import React from "react";
import { Users, Route, BarChart, ShieldCheck } from "lucide-react";

import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data, in a real app this would come from Firestore queries
const stats = {
  totalUsers: 125,
  totalRoutes: 432,
  totalClicks: "1.2M",
  activeSubscriptions: 98,
};

const recentUsers = [
  { id: 1, email: "user1@example.com", plan: "Pro", joinDate: "2024-07-31" },
  { id: 2, email: "user2@example.com", plan: "Iniciante", joinDate: "2024-07-31" },
  { id: 3, email: "user3@example.com", plan: "Pro", joinDate: "2024-07-30" },
  { id: 4, email: "user4@example.com", plan: "Empresarial", joinDate: "2024-07-29" },
  { id: 5, email: "user5@example.com", plan: "Iniciante", joinDate: "2024-07-29" },
];

function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+5 nos últimos 7 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Rotas</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoutes}</div>
            <p className="text-xs text-muted-foreground">+50 nos últimos 7 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
            <p className="text-xs text-muted-foreground">no último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">+2 cancelamentos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.plan === 'Pro' ? 'default' : (user.plan === 'Empresarial' ? 'destructive' : 'secondary')}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;
