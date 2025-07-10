
"use client"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { ArrowLeft, Search } from "lucide-react"
import UAParser from "ua-parser-js"
import { collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore"

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
import withAuth from "@/components/with-auth"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

type LogEntry = {
  id: string;
  ip: string;
  country: string;
  timestamp: any; // Firestore timestamp object
  redirectedTo: 'real' | 'fake';
  userAgent: string;
};

const getDeviceInfo = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  
  const browserName = browser.name || 'Desconhecido';
  const osName = os.name ? `${os.name} ${os.version || ''}`.trim() : 'Desconhecido';

  return { browser: browserName, os: osName };
}

function LogsPage({ params }: { params: { slug: string } }) {
  const [search, setSearch] = React.useState("")
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "logs"), 
      where("slug", "==", params.slug),
      where("userId", "==", user.uid), // Security: only get logs for the current user
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const logsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry));
      setLogs(logsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching logs: ", error);
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar os logs." });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, params.slug]);

  const filteredLogs = logs.filter(log => log.ip.includes(search))

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
          <p className="text-muted-foreground text-sm">Mostrando logs para a rota: <span className="font-code text-foreground">/{params.slug}</span></p>
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
              {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={5}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const { browser, os } = getDeviceInfo(log.userAgent);
                  const dateTime = log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString('pt-BR') : 'Data inválida';
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium font-code">{log.ip}</TableCell>
                      <TableCell>{log.country}</TableCell>
                      <TableCell>
                        <div className="font-medium">{browser}</div>
                        <div className="text-xs text-muted-foreground">{os}</div>
                      </TableCell>
                      <TableCell>{dateTime}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={log.redirectedTo === 'real' ? 'default' : 'destructive'} className={log.redirectedTo === 'real' ? 'bg-green-500/20 text-green-400 border-green-500/20' : ''}>
                          {log.redirectedTo}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
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

export default withAuth(LogsPage);
