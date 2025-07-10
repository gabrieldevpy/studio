
"use client"
import Link from "next/link"
import React from "react"
import { usePathname } from "next/navigation"
import { Home, Plus, Book, Settings, Activity, Webhook, ShieldAlert, CalendarClock, Crown, Shield } from "lucide-react"
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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isAdmin } = useUserData();
  const isActive = (path: string) => pathname === path
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="text-lg font-semibold text-foreground">CloakDash</span>
            </Link>
          </SidebarHeader>
          <SidebarMenu>
            {isAdmin && (
               <SidebarMenuItem>
                <SidebarMenuButton href="/admin" asChild isActive={pathname.startsWith('/admin')} tooltip="Admin">
                    <Link href="/admin"><Shield /><span>Admin</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard" asChild isActive={isActive('/dashboard')} tooltip="Painel">
                <Link href="/dashboard"><Home /><span>Painel</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/routes/new" asChild isActive={isActive('/routes/new')} tooltip="Nova Rota">
                <Link href="/routes/new"><Plus /><span>Nova Rota</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/live-feed" asChild isActive={isActive('/live-feed')} tooltip="Live Feed">
                 <Link href="/live-feed"><Activity /><span>Live Feed</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/scheduling" asChild isActive={isActive('/scheduling')} tooltip="Agendamentos">
                 <Link href="/scheduling"><CalendarClock /><span>Agendamentos</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/blocked-ips" asChild isActive={isActive('/blocked-ips')} tooltip="IPs Bloqueados">
                 <Link href="/blocked-ips"><ShieldAlert /><span>IPs Bloqueados</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/webhooks" asChild isActive={isActive('/webhooks')} tooltip="Webhooks">
                 <Link href="/webhooks"><Webhook /><span>Webhooks</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/docs" asChild isActive={isActive('/docs')} tooltip="Documentação" >
                 <Link href="/docs"><Book /><span>Documentação</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/settings" asChild isActive={isActive('/settings')} tooltip="Assinatura">
                 <Link href="/settings"><Crown /><span>Assinatura</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/account" asChild isActive={isActive('/account')} tooltip="Configurações da Conta">
                 <Link href="/account"><Settings /><span>Conta</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <div className="flex-1"></div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
