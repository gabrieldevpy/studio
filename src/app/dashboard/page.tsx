"use client"
import Link from "next/link"
import { Plus, MoreHorizontal } from "lucide-react"
import React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

type Route = {
  id: string;
  slug: string;
  realUrl: string;
  fakeUrl: string;
  status: string;
  emergency: boolean;
  clicks: number;
  realClicks: number;
  fakeClicks: number;
};


const initialMockRoutes: Route[] = [
  { id: '1', slug: 'promo-abc', realUrl: 'https://real-product.com/offer', fakeUrl: 'https://google.com', status: 'ativo', emergency: false, clicks: 1204, realClicks: 980, fakeClicks: 224 },
  { id: '2', slug: 'campaign-xyz', realUrl: 'https://another-real-one.com/page', fakeUrl: 'https://bing.com', status: 'ativo', emergency: true, clicks: 873, realClicks: 650, fakeClicks: 223 },
  { id: '3', slug: 'lander-v2', realUrl: 'https://my-affiliate-link.com/product', fakeUrl: 'https://duckduckgo.com', status: 'inativo', emergency: false, clicks: 0, realClicks: 0, fakeClicks: 0 },
  { id: '4', slug: 'facebook-ad-1', realUrl: 'https://secret-landing-page.io/special', fakeUrl: 'https://yahoo.com', status: 'ativo', emergency: false, clicks: 5432, realClicks: 4987, fakeClicks: 445 },
]

export default function DashboardPage() {
  const [routes, setRoutes] = React.useState(initialMockRoutes);
  const [routeToDelete, setRouteToDelete] = React.useState<Route | null>(null);

  const handleEmergencyChange = (id: string, checked: boolean) => {
    const updatedRoutes = routes.map(route =>
      route.id === id ? { ...route, emergency: checked } : route
    );
    setRoutes(updatedRoutes);
    
    const currentRoute = routes.find(r => r.id === id);
    toast({
      title: `Modo de Emergência ${checked ? 'Ativado' : 'Desativado'}`,
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


  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Painel</h1>
          <p className="text-muted-foreground">Uma visão geral de suas rotas com cloaking.</p>
        </div>
        <Button asChild>
          <Link href="/routes/new">
            <Plus className="mr-2 h-4 w-4" /> Criar Nova Rota
          </Link>
        </Button>
      </div>
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
                <TableHead>URL Falsa</TableHead>
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
                  <TableCell>
                    <a href={route.fakeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-xs block">{route.fakeUrl}</a>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch 
                      checked={route.emergency} 
                      onCheckedChange={(checked) => handleEmergencyChange(route.id, checked)}
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
