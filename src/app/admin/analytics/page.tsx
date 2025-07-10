
"use client";

import { BarChart as BarChartIcon, Users, Route } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import withAuth from "@/components/with-auth";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data, in a real app this would come from Firestore aggregations
const newUsersData = [
  { name: 'Jan', value: 12 },
  { name: 'Fev', value: 19 },
  { name: 'Mar', value: 30 },
  { name: 'Abr', value: 58 },
  { name: 'Mai', value: 45 },
  { name: 'Jun', value: 73 },
];

const planDistributionData = [
    { name: 'Iniciante', value: 65, fill: 'hsl(var(--chart-1))' },
    { name: 'Pro', value: 45, fill: 'hsl(var(--chart-2))' },
    { name: 'Empresarial', value: 15, fill: 'hsl(var(--chart-3))' },
]

function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><BarChartIcon className="h-8 w-8 text-primary"/> Análises Gerais</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
         <Card>
          <CardHeader>
            <CardTitle className="text-lg">Novos Usuários (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={250}>
                <LineChart data={newUsersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Novos Usuários" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Planos</CardTitle>
             <CardDescription>Usuários ativos por tipo de plano.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={250}>
                <BarChart data={planDistributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12}/>
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80}/>
                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Bar dataKey="value" name="Usuários" barSize={30} radius={[0, 4, 4, 0]}/>
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Métricas de Engajamento</CardTitle>
             <CardDescription>Em breve...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[250px] border-2 border-dashed rounded-lg text-center">
                <Route className="h-10 w-10 text-muted-foreground mb-2"/>
                <p className="text-sm text-muted-foreground">Rotas criadas por dia</p>
                <p className="text-sm text-muted-foreground">Cliques processados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AdminAnalyticsPage);
