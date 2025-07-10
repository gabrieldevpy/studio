
"use client"
import Link from "next/link"
import { Plus, MoreHorizontal, CalendarIcon, Crown, AlertCircle } from "lucide-react"
import React, { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import withAuth from "@/components/with-auth";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";


type Route = {
  id: string;
  slug: string;
  realUrl: string;
  fakeUrl: string;
  status: string; // This might need to be derived or stored
  emergency: boolean;
  aiMode: boolean;
  clicks?: number; // These will be calculated
  realClicks?: number;
  fakeClicks?: number;
};

// Mock user plan and limits - in a real app, this would come from Firestore
const userPlan = {
  name: "Iniciante",
  routeLimit: 5
};

const analyticsData = {
  "24h": [{ name: 'Real', value: 320 }, { name: 'Suspeito', value: 85 }],
  "7d": [{ name: 'Real', value: 2450 }, { name: 'Suspeito', value: 680 }],
  "30d": [{ name: 'Real', value: 9800 }, { name: 'Suspeito', value: 2100 }],
}

const COLORS = {
  Real: '#22c55e',
  Suspeito: '#ef4444',
};

function DashboardPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routeToDelete, setRouteToDelete] = React.useState<Route | null>(null);
  const [timeRange, setTimeRange] = React.useState<keyof typeof analyticsData>("7d")
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "routes"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const routesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), status: 'ativo' } as Route));
      setRoutes(routesData);
      setRoutesLoading(false);
    }, (error) => {
      console.error("Error fetching routes: ", error);
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar suas rotas." });
      setRoutesLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const hasReachedLimit = routes.length >= userPlan.routeLimit;

  const handleToggleChange = async (routeId: string, field: 'emergency' | 'aiMode', checked: boolean) => {
    if (!routeId) {
        toast({ variant: "destructive", title: "Erro", description: "ID da rota não encontrado." });
        return;
    }
    const routeRef = doc(db, "routes", routeId);
    try {
        await updateDoc(routeRef, { [field]: checked });
        
        // Optimistic update
        setRoutes(prevRoutes => prevRoutes.map(r => r.id === routeId ? {...r, [field]: checked} : r));

        const fieldName = field === 'emergency' ? 'Modo de Emergência' : 'Modo IA';
        toast({
            title: `${fieldName} ${checked ? 'Ativado' : 'Desativado'}`,
            description: `A rota foi atualizada.`,
        });
    } catch (error) {
        console.error("Error updating route: ", error);
        // Revert optimistic update on error
        setRoutes(prevRoutes => prevRoutes.map(r => r.id === routeId ? {...r, [field]: !checked} : r));
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar a rota." });
    }
  };

  const handleDeleteRoute = async () => {
    if (!routeToDelete || !routeToDelete.id) {
         toast({ variant: "destructive", title: "Erro", description: "Nenhuma rota selecionada para exclusão." });
        return;
    }

    const routeIdToDelete = routeToDelete.id;
    const originalRoutes = routes;
    
    // Optimistic update
    setRoutes(prevRoutes => prevRoutes.filter(r => r.id !== routeIdToDelete));
    setRouteToDelete(null);
    
    try {
        await deleteDoc(doc(db, "routes", routeIdToDelete));
        toast({
            title: "Rota Excluída",
            description: `A rota /${routeToDelete.slug} foi excluída com sucesso.`,
        });
    } catch (error) {
        console.error("Error deleting route: ", error);
        setRoutes(originalRoutes); // Revert on error
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir a rota." });
    }
  };
  
  const currentData = analyticsData[timeRange];
  const totalClicks = currentData.reduce((acc, entry) => acc + entry.value, 0);
  
  const CreateRouteButton = () => (
    <Button asChild id="tour-step-2" disabled={hasReachedLimit}>
        <Link href="/routes/new">
            <Plus className="mr-2 h-4 w-4" /> Criar Nova Rota
        </Link>
    </Button>
  );

  return (
    <DashboardLayout>
      <DashboardTour />
      <div className="flex items-center mb-6" id="tour-step-1">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Painel</h1>
          <p className="text-muted-foreground">Bem-vindo, {user?.displayName || user?.email || 'usuário'}!</p>
        </div>
        <div className="flex items-center gap-4">
             <Button variant="outline" asChild>
                <Link href="/settings">
                    <Crown className="mr-2 h-4 w-4" /> Gerenciar Assinatura
                </Link>
            </Button>
            {hasReachedLimit ? (
                <TooltipProvider>
                    <UiTooltip>
                        <TooltipTrigger asChild>
                            <span tabIndex={0}><CreateRouteButton /></span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Você atingiu o limite de rotas do plano {userPlan.name}.
                            </p>
                        </TooltipContent>
                    </UiTooltip>
                </TooltipProvider>
            ) : (
                <CreateRouteButton />
            )}
        </div>
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

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="col-span-1">
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Suas Rotas</CardTitle>
                        <CardDescription>Gerencie suas rotas e veja o desempenho delas.</CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Uso de Rotas</p>
                        <p className="text-lg font-bold">{routes.length}<span className="text-base font-normal text-muted-foreground">/{userPlan.routeLimit}</span></p>
                    </div>
                </div>
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
                  {routesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : routes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">Nenhuma rota encontrada. Crie sua primeira rota!</TableCell>
                    </TableRow>
                  ) : (
                    routes.map((route) => (
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
                        <TableCell className="text-right">{(route.clicks || 0).toLocaleString('pt-BR')}</TableCell>
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
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => setRouteToDelete(route)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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

export default withAuth(DashboardPage);
