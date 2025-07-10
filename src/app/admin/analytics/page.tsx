
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, FileText, Activity } from "lucide-react";
import withAuth from "@/components/with-auth";

// Mock data for demonstration
const analyticsData = {
    totalUsers: 148,
    totalRoutes: 213,
    activeSubscriptions: 42,
    monthlyRecurringRevenue: 2858,
    dailyActiveUsers: 97,
    newUsersToday: 5,
};

function AdminAnalyticsPage() {
    return (
        <AdminLayout>
            <div className="flex items-center mb-6">
                <BarChart className="h-8 w-8 mr-2" />
                <h1 className="text-3xl font-bold">Análises</h1>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">+{analyticsData.newUsersToday} hoje</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rotas Totais</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.totalRoutes}</div>
                         <p className="text-xs text-muted-foreground">Em todas as contas</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Recorrente Mensal</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {analyticsData.monthlyRecurringRevenue.toFixed(2).replace('.',',')}</div>
                        <p className="text-xs text-muted-foreground">Baseado em {analyticsData.activeSubscriptions} assinaturas</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Ativos (DAU)</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.dailyActiveUsers}</div>
                        <p className="text-xs text-muted-foreground">Usuários ativos nas últimas 24h</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral do Tráfego</CardTitle>
                    <CardDescription>Gráficos detalhados sobre o uso da plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Gráficos e métricas em desenvolvimento.</p>
                        <p className="text-muted-foreground">Em breve, aqui você verá análises visuais detalhadas.</p>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}

export default withAuth(AdminAnalyticsPage);
