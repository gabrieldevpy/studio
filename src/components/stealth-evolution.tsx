
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ShieldPlus, ShieldOff, BrainCircuit } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";


type Suggestion = {
  type: "ip";
  value: string;
  reason: string;
  count: number;
  slug: string;
};

type StealthEvolutionProps = {
    onBlockIp: (ip: string, slug: string) => void;
}

const SUSPICIOUS_IP_THRESHOLD = 3;

export function StealthEvolution({ onBlockIp }: StealthEvolutionProps) {
  const [ignoredSuggestions, setIgnoredSuggestions] = useState<string[]>([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user || !aiEnabled) {
      setLogs([]);
      return;
    };

    const q = query(
      collection(db, "logs"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(200) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => doc.data());
      setLogs(logsData);
    }, (error: any) => {
        if (error.code === 'failed-precondition') {
            console.warn("Firestore index missing. The AI engine might not work as expected. Please create the required index in your Firebase console.");
            toast({
                variant: "destructive",
                title: "Índice do Firestore Faltando",
                description: "A consulta para o motor de IA falhou. Verifique o console para o link de criação do índice."
            })
        } else {
            console.error("Error fetching logs for StealthEvolution:", error);
            toast({
                variant: "destructive",
                title: "Erro no Motor de IA",
                description: "Não foi possível carregar os dados para análise."
            });
        }
        setLogs([]);
    });

    return () => unsubscribe();
  }, [user, aiEnabled]);

  const suggestions = useMemo(() => {
    if (!aiEnabled) return [];

    const ipCounts: Record<string, { count: number; slug: string }> = {};
    
    const fakeLogs = logs.filter(log => log.redirectedTo === 'fake');

    fakeLogs.forEach(log => {
      if (!log.ip || log.ip === 'unknown') return;
        
      if (!ipCounts[log.ip]) {
        ipCounts[log.ip] = { count: 0, slug: log.slug };
      }
      ipCounts[log.ip].count++;
      ipCounts[log.ip].slug = log.slug; 
    });

    const newSuggestions: Suggestion[] = [];

    for (const ip in ipCounts) {
      if (ipCounts[ip].count >= SUSPICIOUS_IP_THRESHOLD) {
        newSuggestions.push({
          type: "ip",
          value: ip,
          count: ipCounts[ip].count,
          slug: ipCounts[ip].slug,
          reason: `Detectado ${ipCounts[ip].count} vezes na rota /${ipCounts[ip].slug}.`
        });
      }
    }
    
    return newSuggestions.sort((a, b) => b.count - a.count);
  }, [logs, aiEnabled]);

  const activeSuggestions = suggestions.filter(s => !ignoredSuggestions.includes(`${s.value}-${s.slug}`));
  
  const handleBlock = (suggestion: Suggestion) => {
    onBlockIp(suggestion.value, suggestion.slug);
    setIgnoredSuggestions(prev => [...prev, `${suggestion.value}-${suggestion.slug}`]);
  }
  
  const handleIgnore = (suggestion: Suggestion) => {
    setIgnoredSuggestions(prev => [...prev, `${suggestion.value}-${suggestion.slug}`]);
     toast({
        title: "Sugestão Ignorada",
        description: `Você não verá mais sugestões para ${suggestion.value} na rota /${suggestion.slug}.`
    })
  }

  const handleAiToggle = (enabled: boolean) => {
    setAiEnabled(enabled);
    toast({
      title: `Motor de IA ${enabled ? 'Ativado' : 'Desativado'}`,
      description: "O sistema de sugestões foi atualizado."
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="text-primary" />
                Motor de IA (StealthEvolution)
                </CardTitle>
                <CardDescription>
                Sugestões da IA para otimizar sua proteção.
                </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                <Switch 
                    id="ai-mode" 
                    checked={aiEnabled} 
                    onCheckedChange={handleAiToggle}
                />
                <Label htmlFor="ai-mode">Ativar</Label>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {aiEnabled && activeSuggestions.length > 0 ? (
          <div className="space-y-4">
            {activeSuggestions.map((suggestion, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-lg border p-3 bg-card-foreground/5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-semibold text-foreground">Bloquear IP Suspeito</p>
                        <p className="font-code text-sm text-primary">{suggestion.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.reason}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="w-full" onClick={() => handleBlock(suggestion)}>
                    <ShieldPlus className="mr-2 h-4 w-4" />
                    Bloquear IP
                  </Button>
                  <Button size="sm" variant="secondary" className="w-full" onClick={() => handleIgnore(suggestion)}>
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Ignorar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            <p>{aiEnabled ? 'Nenhuma nova sugestão no momento.' : 'O Motor de IA está desativado.'}</p>
            <p>{aiEnabled ? 'Continue monitorando!' : 'Ative para receber sugestões.'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
