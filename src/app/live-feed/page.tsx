
"use client";

import React, { useEffect, useState } from "react";
import UAParser from "ua-parser-js";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Globe, Bot, User, Computer, Smartphone, Tablet } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Mock Firestore onSnapshot
const onSnapshot = (collection: any, callback: (snapshot: any) => void) => {
  const mockLogs = [
    { id: '1', slug: 'promo-abc', ip: '123.45.67.89', country: 'US', timestamp: new Date(Date.now() - 10000), redirectedTo: 'real' as const, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' },
    { id: '2', slug: 'campaign-xyz', ip: '98.76.54.32', country: 'CA', timestamp: new Date(Date.now() - 30000), redirectedTo: 'fake' as const, userAgent: 'facebookexternalhit/1.1' },
    { id: '3', slug: 'promo-abc', ip: '203.0.113.55', country: 'AU', timestamp: new Date(Date.now() - 60000), redirectedTo: 'real' as const, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1' },
    { id: '5', slug: 'facebook-ad-1', ip: '8.8.8.8', country: 'US', timestamp: new Date(Date.now() - 120000), redirectedTo: 'fake' as const, userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)' },
  ];

  let i = 0;
  const interval = setInterval(() => {
    i++;
    const newLog = {
        id: (mockLogs.length + i).toString(),
        slug: 'promo-abc',
        ip: `192.168.1.${i}`,
        country: 'BR',
        timestamp: new Date(),
        redirectedTo: Math.random() > 0.5 ? 'real' : 'fake' as const,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    }
    const snapshot = {
      docs: [newLog, ...mockLogs.map(l => ({ id: l.id, data: () => l }))].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).map(d => ({id: d.id, data: () => ({...d, timestamp: { toDate: () => d.timestamp}})}))
    };
    callback(snapshot);
  }, 5000);

  // initial call
  const initialSnapshot = { docs: mockLogs.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).map(d => ({id: d.id, data: () => ({...d, timestamp: { toDate: () => d.timestamp}})})) };
  callback(initialSnapshot);

  return () => clearInterval(interval); // Unsubscribe function
};


type LogEntry = {
  id: string;
  slug: string;
  ip: string;
  country: string;
  userAgent: string;
  redirectedTo: 'real' | 'fake';
  timestamp: Date;
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

export default function LiveFeedPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would get the db instance from your firebase config
    const mockCollection = { name: "logs", orderBy: () => {}, limit: () => {} };

    const unsubscribe = onSnapshot(mockCollection, (snapshot: any) => {
      setLoading(false);
      setLogs(currentLogs => {
        const newLogs = snapshot.docs.map((doc: any) => {
          const data = doc.data();
          const log = {
            id: doc.id,
            ...data,
            timestamp: data.timestamp && data.timestamp.toDate ? data.timestamp.toDate() : new Date(),
          } as LogEntry;
          
          const isExisting = currentLogs.some(l => l.id === log.id);
          return { ...log, isNew: !isExisting };
        });

        // Merge and sort, keeping isNew status
        const allLogs = [...newLogs, ...currentLogs.map(l => ({...l, isNew: false}))]
          .filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i) // unique by id
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 50); // limit to 50 logs

        return allLogs;
      });
    });

    return () => unsubscribe();
  }, []);

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
