
"use client";

import React, { useMemo, useState } from "react";
import { Lightbulb, ShieldPlus, ShieldOff, Copy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_LOGS } from "@/lib/mock-logs";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Suggestion = {
  type: "ip" | "userAgent";
  value: string;
  reason: string;
  count: number;
};

type StealthEvolutionProps = {
    onBlockIp: (ip: string) => void;
}

const SUSPICIOUS_IP_THRESHOLD = 3;

export function StealthEvolution({ onBlockIp }: StealthEvolutionProps) {
  const [ignoredSuggestions, setIgnoredSuggestions] = useState<string[]>([]);
  const [aiEnabled, setAiEnabled] = useState(true);

  const suggestions = useMemo(() => {
    if (!aiEnabled) return [];

    const ipCounts: Record<string, number> = {};
    
    // Analyze logs to find suspicious patterns
    MOCK_LOGS.forEach(log => {
      if (log.redirectedTo === "fake") {
        ipCounts[log.ip] = (ipCounts[log.ip] || 0) + 1;
      }
    });

    const newSuggestions: Suggestion[] = [];

    // Create suggestions for IPs
    for (const ip in ipCounts) {
      if (ipCounts[ip] >= SUSPICIOUS_IP_THRESHOLD) {
        newSuggestions.push({
          type: "ip",
          value: ip,
          count: ipCounts[ip],
          reason: `Detectado ${ipCounts[ip]} vezes em tráfego suspeito.`
        });
      }
    }
    
    return newSuggestions.sort((a, b) => b.count - a.count);
  }, [aiEnabled]);

  const activeSuggestions = suggestions.filter(s => !ignoredSuggestions.includes(s.value));
  
  const handleBlock = (value: string) => {
    onBlockIp(value);
    // Also ignore the suggestion after blocking
    setIgnoredSuggestions(prev => [...prev, value]);
  }
  
  const handleIgnore = (value: string) => {
    setIgnoredSuggestions(prev => [...prev, value]);
     toast({
        title: "Sugestão Ignorada",
        description: `Você não verá mais sugestões para ${value}.`
    })
  }

  const handleAiToggle = (enabled: boolean) => {
    setAiEnabled(enabled);
    toast({
      title: `Stealth Evolution ${enabled ? 'Ativado' : 'Desativado'}`,
      description: "O sistema de sugestões foi atualizado."
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary" />
                Stealth Evolution
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
                  <Button size="sm" className="w-full" onClick={() => handleBlock(suggestion.value)}>
                    <ShieldPlus className="mr-2 h-4 w-4" />
                    Bloquear IP
                  </Button>
                  <Button size="sm" variant="secondary" className="w-full" onClick={() => handleIgnore(suggestion.value)}>
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Ignorar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            <p>{aiEnabled ? 'Nenhuma nova sugestão no momento.' : 'O modo de IA está desativado.'}</p>
            <p>{aiEnabled ? 'Continue monitorando!' : 'Ative para receber sugestões.'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
