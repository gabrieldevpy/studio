
"use client";

import React, { useEffect, useState } from "react";
import UAParser from "ua-parser-js";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Globe, Bot, User, Computer, Smartphone, Tablet } from "lucide-react";
import { collection, query, orderBy, onSnapshot, limit, where } from "firebase/firestore";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import withAuth from "@/components/with-auth";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

type LogEntry = {
  id: string;
  slug: string;
  ip: string;
  country: string;
  userAgent: string;
  redirectedTo: 'real' | 'fake';
  timestamp: any; // Firestore timestamp
  isNew?: boolean;
};

const getDeviceInfo = (userAgent: string) => {
  if (!userAgent) return { icon: <Computer />, name: 'Desconhecido' };
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();

  if (device.type === 'mobile') return { icon: <Smartphone />, name: device.vendor ? `${device.vendor} ${device.model}` : 'Celular' };
  if (device.type === 'tablet') return { icon: <Tablet />, name: device.vendor ? `${device.vendor} ${device.model}` : 'Tablet' };
  
  return { icon: <Computer />, name: 'Computador' };
}

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function LiveFeedPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

    const logsCollection = collection(db, "logs");
    const q = query(
        logsCollection, 
        where("userId", "==", user.uid), 
        orderBy("timestamp", "desc"), 
        limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoading(false);
      setLogs(currentLogs => {
        const newLogs = snapshot.docs.map((doc: any) => {
          const data = doc.data();
          const log = {
            id: doc.id,
            ...data,
            timestamp: (data.timestamp && data.timestamp.toDate) ? data.timestamp.toDate() : new Date(),
          } as LogEntry;
          
          const isExisting = currentLogs.some(l => l.id === log.id);
          return { ...log, isNew: !isExisting };
        });

        const allLogs = [...newLogs, ...currentLogs.map(l => ({...l, isNew: false}))]
          .filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i) 
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 50);

        return allLogs;
      });
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <DashboardLayout>
       <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Live Feed</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Acessos em Tempo Real
          </CardTitle>
          <CardDescription>
            Acompanhe os visitantes chegando em seus links em tempo real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {loading && (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-card">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
              ))
            )}
            {!loading && logs.map((log) => {
              const deviceInfo = getDeviceInfo(log.userAgent);
              return (
                <div key={log.id} className={cn(
                  "flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border bg-background transition-all",
                  log.isNew ? "animate-in fade-in-0 slide-in-from-top-4 duration-500 bg-sidebar-accent border-primary/20" : ""
                  )}>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-full bg-muted">
                        {log.redirectedTo === 'real' ? <User className="w-5 h-5 text-green-400" /> : <Bot className="w-5 h-5 text-red-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          Visita de <span className="font-code">{log.ip}</span> em <span className="font-code text-primary">/{log.slug}</span>
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <span title={log.country}>{getFlagEmoji(log.country)}</span>
                          <span className="flex items-center gap-1">{deviceInfo.icon}{deviceInfo.name}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 text-sm">
                       <Badge variant={log.redirectedTo === 'real' ? 'default' : 'destructive'} className={log.redirectedTo === 'real' ? 'bg-green-500/20 text-green-400 border-green-500/20' : ''}>
                        {log.redirectedTo === 'real' ? 'Humano' : 'Suspeito'}
                      </Badge>
                      <div className="text-muted-foreground min-w-[100px] text-right">
                        {formatDistanceToNow(log.timestamp, { addSuffix: true, locale: ptBR })}
                      </div>
                    </div>
                </div>
              )
            })}
             {!loading && logs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <Globe className="w-12 h-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Aguardando o primeiro acesso...</p>
                </div>
             )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default withAuth(LiveFeedPage);
