
"use client"
import Link from "next/link"
import React from "react"
import { ArrowLeft, ShieldAlert, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
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
import { toast } from "@/hooks/use-toast"
import withAuth from "@/components/with-auth"

type BlockedIp = {
  id: string
  ip: string
  routeSlug: string
  source: 'manual' | 'ia'
  createdAt: string
}

// Mock data representing IPs blocked across different routes
const initialMockBlockedIps: BlockedIp[] = [
  { id: '1', ip: '101.102.103.104', routeSlug: 'promo-abc', source: 'ia', createdAt: '2024-07-31 10:00:00 UTC' },
  { id: '2', ip: '45.56.67.78', routeSlug: 'campaign-xyz', source: 'ia', createdAt: '2024-07-31 09:45:12 UTC' },
  { id: '3', ip: '8.8.8.8', routeSlug: 'promo-abc', source: 'manual', createdAt: '2024-07-30 14:23:05 UTC' },
  { id: '4', ip: '208.67.222.222', routeSlug: 'lander-v2', source: 'manual', createdAt: '2024-07-29 18:01:50 UTC' },
]

function BlockedIpsPage() {
  const [blockedIps, setBlockedIps] = React.useState(initialMockBlockedIps)
  const [ipToUnblock, setIpToUnblock] = React.useState<BlockedIp | null>(null)

  const handleUnblockIp = () => {
    if (ipToUnblock) {
      setBlockedIps(blockedIps.filter(ip => ip.id !== ipToUnblock.id))
      toast({
        title: "IP Desbloqueado",
        description: `O IP ${ipToUnblock.ip} foi removido da lista de bloqueio.`,
      })
      setIpToUnblock(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:grow-0">
            <ShieldAlert className="h-5 w-5 text-primary"/>
            Gerenciamento de IPs Bloqueados
          </h1>
          <p className="text-muted-foreground text-sm">
            Visualize e gerencie todos os IPs bloqueados em suas rotas.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de IPs Bloqueados</CardTitle>
          <CardDescription>
            IPs nesta lista são automaticamente redirecionados para a URL Falsa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endereço IP</TableHead>
                <TableHead>Rota Afetada</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Data do Bloqueio</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockedIps.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell className="font-medium font-code">{ip.ip}</TableCell>
                  <TableCell className="font-code text-muted-foreground">/{ip.routeSlug}</TableCell>
                  <TableCell>
                    <Badge variant={ip.source === 'ia' ? 'destructive' : 'secondary'}>
                      {ip.source === 'ia' ? 'Sugestão da IA' : 'Manual'}
                    </Badge>
                  </TableCell>
                  <TableCell>{ip.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setIpToUnblock(ip)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Desbloquear</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {blockedIps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum IP bloqueado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!ipToUnblock} onOpenChange={(open) => !open && setIpToUnblock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá o IP <span className="font-bold font-code text-foreground">{ipToUnblock?.ip}</span> da lista de bloqueio.
              Visitantes deste IP poderão acessar sua URL Real novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnblockIp} className="bg-destructive hover:bg-destructive/90">
              Sim, desbloquear IP
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}

export default withAuth(BlockedIpsPage);
