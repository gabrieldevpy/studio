
"use client"
import Link from "next/link"
import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Users, BarChart, ShieldCheck, Settings, LayoutDashboard, AlertCircle, Loader2, CreditCard, Bot } from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Logo } from "./icons"
import { useUserData } from "@/hooks/use-user-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, loading: userLoading } = useUserData();
  const isActive = (path: string) => pathname === path

  const handleRedirectToLogin = () => {
    router.push('/login');
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verificando permissões...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Você não tem permissão para visualizar esta página. Por favor, faça login com uma conta de administrador.
            <button onClick={handleRedirectToLogin} className="font-bold underline ml-2">Ir para o Login</button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <Link href="/admin" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="text-lg font-semibold text-foreground">CloakDash Admin</span>
            </Link>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin" asChild isActive={isActive('/admin')} tooltip="Dashboard">
                <Link href="/admin"><LayoutDashboard /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/users" asChild isActive={isActive('/admin/users')} tooltip="Usuários">
                <Link href="/admin/users"><Users /><span>Usuários</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/admin/plans" asChild isActive={isActive('/admin/plans')} tooltip="Planos">
                 <Link href="/admin/plans"><ShieldCheck /><span>Planos e Assinaturas</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/analytics" asChild isActive={isActive('/admin/analytics')} tooltip="Análises">
                 <Link href="/admin/analytics"><BarChart /><span>Análises</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/admin/bot-wiki" asChild isActive={isActive('/admin/bot-wiki')} tooltip="Bot Wiki">
                 <Link href="/admin/bot-wiki"><Bot /><span>Bot Wiki</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/settings" asChild isActive={isActive('/admin/settings')} tooltip="Configurações">
                 <Link href="/admin/settings"><Settings /><span>Configurações</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/admin/checkout" asChild isActive={isActive('/admin/checkout')} tooltip="Checkout">
                 <Link href="/admin/checkout"><CreditCard /><span>Configurar Checkout</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" asChild tooltip="Voltar ao App">
                    <Link href="/dashboard"><LayoutDashboard /><span>Voltar ao App</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="sm-hidden" />
          <div className="flex-1"></div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
