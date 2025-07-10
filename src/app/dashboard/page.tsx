
"use client"
import Link from "next/link"
import { Plus, MoreHorizontal, BrainCircuit, CalendarIcon } from "lucide-react"
import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/dashboard-layout"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DashboardTour } from "@/components/dashboard-tour"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StealthEvolution } from "@/components/stealth-evolution";

type Route = {
  id: string;
  slug: string;
  realUrl: string;
  fakeUrl: string;
  status: string;
  emergency: boolean;
  aiMode: boolean;
  clicks: number;
  realClicks: number;
  fakeClicks: number;
};

const initialMockRoutes: Route[] = [
  { id: '1', slug: 'promo-abc', realUrl: 'https://real-product.com/offer', fakeUrl: 'https://google.com', status: 'ativo', emergency: false, aiMode: true, clicks: 1204, realClicks: 980, fakeClicks: 224 },
  { id: '2', slug: 'campaign-xyz', realUrl: 'https://another-real-one.com/page', fakeUrl: 'https://bing.com', status: 'ativo', emergency: true, aiMode: false, clicks: 873, realClicks: 650, fakeClicks: 223 },
  { id: '3', slug: 'lander-v2', realUrl: 'https://my-affiliate-link.com/product', fakeUrl: 'https://duckduckgo.com', status: 'inativo', emergency: false, aiMode: true, clicks: 0, realClicks: 0, fakeClicks: 0 },
  { id: '4', slug: 'facebook-ad-1', realUrl: 'https://secret-landing-page.io/special', fakeUrl: 'https://yahoo.com', status: 'ativo', emergency: false, aiMode: true, clicks: 5432, realClicks: 4987, fakeClicks: 445 },
]

const analyticsData = {
  "24h": [{ name: 'Real', value: 320 }, { name: 'Suspeito', value: 85 }],
  "7d": [{ name: 'Real', value: 2450 }, { name: 'Suspeito', value: 680 }],
  "30d": [{ name: 'Real', value: 9800 }, { name: 'Suspeito', value: 2100 }],
}

const COLORS = {
  Real: '#22c55e',
  Suspeito: '#ef4444',
};

export default function DashboardPage() {
  const [routes, setRoutes] = React.useState(initialMockRoutes);
  const [routeToDelete, setRouteToDelete] = React.useState<Route | null>(null);
  const [timeRange, setTimeRange] = React.useState<keyof typeof analyticsData>("7d")

  const handleToggleChange = (id: string, field: 'emergency' | 'aiMode', checked: boolean) => {
    const updatedRoutes = routes.map(route =>
      route.id === id ? { ...route, [field]: checked } : route
    );
    setRoutes(updatedRoutes);
    
    const currentRoute = routes.find(r => r.id === id);
    const fieldName = field === 'emergency' ? 'Modo de Emergência' : 'Modo IA';

    toast({
      title: `${fieldName} ${checked ? 'Ativado' : 'Desativado'}`,
      description: `A rota /${currentRoute?.slug} foi atualizada.`,
    });
  };

  const handleDeleteRoute = () => {
    if (routeToDelete) {
      setRoutes(routes.filter(route => route.id !== routeToDelete.id));
      toast({
        title: "Rota Excluída",
        description: `A rota /${routeToDelete.slug} foi excluída com sucesso.`,
      });
      setRouteToDelete(null);
    }
  };

  const currentData = analyticsData[timeRange];
  const totalClicks = currentData.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <DashboardLayout>
      <DashboardTour />
      <div className="flex items-center mb-6" id="tour-step-1">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Painel</h1>
          <p className="text-muted-foreground">Uma visão geral de suas rotas com cloaking.</p>
        </div>
        <Button asChild id="tour-step-2">
          <Link href="/routes/new">
            <Plus className="mr-2 h-4 w-4" /> Criar Nova Rota
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques Reais</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.find(d => d.name === 'Real')?.value.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">vs {analyticsData['24h'].find(d => d.name === 'Real')?.value.toLocaleString('pt-BR')} (24h)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques Suspeitos</CardTitle>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.find(d => d.name === 'Suspeito')?.value.toLocaleString('pt-BR')}</div>
             <p className="text-xs text-muted-foreground">vs {analyticsData['24h'].find(d => d.name === 'Suspeito')?.value.toLocaleString('pt-BR')} (24h)</p>
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humanos vs. Bots</CardTitle>
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as keyof typeof analyticsData)}>
                <SelectTrigger className="h-7 w-[120px] text-xs">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0">
             <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={currentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="hsl(var(--background))"
                    strokeWidth={3}
                  >
                    {currentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ 
                      background: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: 'var(--radius)'
                    }}
                    formatter={(value, name) => [`${value} cliques`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
          </CardContent>
           <CardFooter className="text-xs text-muted-foreground pt-4 pb-4 justify-center">
              {totalClicks.toLocaleString('pt-BR')} cliques no total
            </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Suas Rotas</CardTitle>
              <CardDescription>Gerencie suas rotas e veja o desempenho delas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>URL Real</TableHead>
                    <TableHead className="text-center">Modo IA</TableHead>
                    <TableHead className="text-center">Modo de Emergência</TableHead>
                    <TableHead className="text-right">Cliques Totais</TableHead>
                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>
                        <Badge variant={route.status === 'ativo' ? 'default' : 'secondary'} className={route.status === 'ativo' ? 'bg-green-500/20 text-green-400 border-green-500/20' : ''}>{route.status}</Badge>
                      </TableCell>
                      <TableCell className="font-medium font-code">/{route.slug}</TableCell>
                      <TableCell>
                        <a href={route.realUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs block">{route.realUrl}</a>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={route.aiMode} 
                          onCheckedChange={(checked) => handleToggleChange(route.id, 'aiMode', checked)}
                          aria-label="Modo IA" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={route.emergency} 
                          onCheckedChange={(checked) => handleToggleChange(route.id, 'emergency', checked)}
                          aria-label="Modo de Emergência" 
                          className="data-[state=checked]:bg-destructive" />
                      </TableCell>
                      <TableCell className="text-right">{route.clicks.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Alternar menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem asChild><Link href={`/routes/${route.slug}/logs`}>Ver Logs</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/routes/${route.slug}/edit`}>Editar</Link></DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setRouteToDelete(route)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="xl:col-span-1">
          <StealthEvolution />
        </div>
      </div>

      <AlertDialog open={!!routeToDelete} onOpenChange={(open) => !open && setRouteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a rota 
              <span className="font-bold font-code text-foreground"> /{routeToDelete?.slug}</span> e todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoute} className="bg-destructive hover:bg-destructive/90">
              Sim, excluir rota
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
