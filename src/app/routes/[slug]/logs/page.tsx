"use client"
import Link from "next/link"
import React from "react"
import { ArrowLeft, Search } from "lucide-react"
import UAParser from "ua-parser-js"

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
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"

const mockLogs = [
  { id: '1', ip: '123.45.67.89', country: 'Estados Unidos', dateTime: '2024-07-29 10:00:00 UTC', redirectedTo: 'real' as const, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' },
  { id: '2', ip: '98.76.54.32', country: 'Canadá', dateTime: '2024-07-29 10:01:15 UTC', redirectedTo: 'fake' as const, userAgent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' },
  { id: '3', ip: '203.0.113.55', country: 'Austrália', dateTime: '2024-07-29 10:02:30 UTC', redirectedTo: 'real' as const, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1' },
  { id: '4', ip: '198.51.100.12', country: 'Alemanha', dateTime: '2024-07-29 10:03:45 UTC', redirectedTo: 'real' as const, userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-A536U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36' },
  { id: '5', ip: '8.8.8.8', country: 'Estados Unidos', dateTime: '2024-07-29 10:05:00 UTC', redirectedTo: 'fake' as const, userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)' },
  { id: '6', ip: '1.1.1.1', country: 'Austrália', dateTime: '2024-07-29 10:06:15 UTC', redirectedTo: 'fake' as const, userAgent: 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)' },
  { id: '7', ip: '123.45.67.90', country: 'Estados Unidos', dateTime: '2024-07-29 10:07:30 UTC', redirectedTo: 'real' as const, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' },
]

const getDeviceInfo = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  
  const browserName = browser.name || 'Desconhecido';
  const osName = os.name ? `${os.name} ${os.version || ''}`.trim() : 'Desconhecido';

  return { browser: browserName, os: osName };
}

export default function LogsPage({ params }: { params: { slug: string } }) {
  const [search, setSearch] = React.useState("")
  const routeParams = React.use(params)

  const filteredLogs = mockLogs.filter(log => log.ip.includes(search))

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
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Logs de Acesso
          </h1>
          <p className="text-muted-foreground text-sm">Mostrando logs para a rota: <span className="font-code text-foreground">/{routeParams.slug}</span></p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Últimos 100 Acessos</CardTitle>
          <CardDescription>
            Aqui estão os visitantes mais recentes do seu link com cloaking.
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar por endereço IP..." 
                className="w-full pl-8 sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endereço IP</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Data e Hora</TableHead>
                <TableHead className="text-right">Redirecionado Para</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const { browser, os } = getDeviceInfo(log.userAgent);
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium font-code">{log.ip}</TableCell>
                    <TableCell>{log.country}</TableCell>
                    <TableCell>
                      <div className="font-medium">{browser}</div>
                      <div className="text-xs text-muted-foreground">{os}</div>
                    </TableCell>
                    <TableCell>{log.dateTime}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={log.redirectedTo === 'real' ? 'default' : 'destructive'} className={log.redirectedTo === 'real' ? 'bg-green-500/20 text-green-400 border-green-500/20' : ''}>
                        {log.redirectedTo}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum log encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
