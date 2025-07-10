
"use client";

import React, { useMemo, useState } from "react";
import { Lightbulb, ShieldPlus, ShieldOff, Copy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_LOGS } from "@/lib/mock-logs";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Suggestion = {
  type: "ip" | "userAgent";
  value: string;
  reason: string;
  count: number;
};

const SUSPICIOUS_IP_THRESHOLD = 3;

export function StealthEvolution() {
  const [ignoredSuggestions, setIgnoredSuggestions] = useState<string[]>([]);

  const suggestions = useMemo(() => {
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
  }, []);

  const activeSuggestions = suggestions.filter(s => !ignoredSuggestions.includes(s.value));
  
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
        title: "Copiado!",
        description: `${value} foi copiado para a área de transferência.`
    })
  }
  
  const handleIgnore = (value: string) => {
    setIgnoredSuggestions(prev => [...prev, value]);
     toast({
        title: "Sugestão Ignorada",
        description: `Você não verá mais sugestões para ${value}.`
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary" />
          Sugestões da IA
        </CardTitle>
        <CardDescription>
          Nosso sistema "Stealth Evolution" analisa seus logs e sugere novas regras para otimizar sua proteção.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeSuggestions.length > 0 ? (
          <div className="space-y-4">
            {activeSuggestions.map((suggestion, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-lg border p-3 bg-card-foreground/5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-semibold text-foreground">Bloquear IP Suspeito</p>
                        <p className="font-code text-sm text-primary">{suggestion.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.reason}</p>
                    </div>
                     <Button size="icon" variant="ghost" className="h-7 w-7 flex-shrink-0" onClick={() => handleCopy(suggestion.value)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="w-full" onClick={() => handleCopy(suggestion.value)}>
                    <ShieldPlus className="mr-2 h-4 w-4" />
                    Copiar para Bloquear
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
            <p>Nenhuma nova sugestão no momento.</p>
            <p>Continue monitorando!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
