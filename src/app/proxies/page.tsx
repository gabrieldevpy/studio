
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Server, Plus, Trash2, Loader2 } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type Proxy = {
  id: string;
  value: string;
  status: 'unknown' | 'testing' | 'active' | 'inactive';
};

const proxySchema = z.object({
  proxy: z.string().min(1, "O campo do proxy não pode estar vazio."),
});

const initialMockProxies: Proxy[] = [
    { id: '1', value: '192.168.1.1:8080', status: 'active' },
    { id: '2', value: 'user:pass@10.0.0.1:3128', status: 'inactive' },
]

export default function ProxiesPage() {
  const [proxies, setProxies] = useState<Proxy[]>(initialMockProxies);

  const form = useForm<z.infer<typeof proxySchema>>({
    resolver: zodResolver(proxySchema),
    defaultValues: { proxy: "" },
  });

  const onSubmit = (data: z.infer<typeof proxySchema>) => {
    const newProxy: Proxy = {
        id: `proxy_${new Date().getTime()}`,
        value: data.proxy,
        status: 'unknown'
    };
    setProxies(prevProxies => [...prevProxies, newProxy]);
    form.reset();
    toast({
        title: "Proxy Adicionado",
        description: "O novo proxy foi adicionado à sua lista.",
    });
  };

  const removeProxy = (id: string) => {
    setProxies(prevProxies => prevProxies.filter(p => p.id !== id));
     toast({
        title: "Proxy Removido",
        description: "O proxy foi removido da sua lista.",
        variant: "destructive"
    });
  }
  
  const testProxy = (id: string) => {
    // Set status to 'testing' immediately
    setProxies(prev => prev.map(p => p.id === id ? { ...p, status: 'testing' } : p));
    
    // Simulate async test
    setTimeout(() => {
        // Update status based on the test result
        const result: Proxy['status'] = Math.random() > 0.5 ? 'active' : 'inactive';
        setProxies(currentProxies => 
            currentProxies.map(p => 
                p.id === id ? { ...p, status: result } : p
            )
        );
    }, 2000);
  }

  const getStatusBadge = (status: Proxy['status']) => {
    switch(status) {
        case 'active':
            return <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Ativo</Badge>;
        case 'inactive':
            return <Badge variant="destructive">Inativo</Badge>;
        case 'testing':
            return <Badge variant="secondary">Testando...</Badge>;
        default:
            return <Badge variant="outline">Não testado</Badge>;
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Proxies Externos</h1>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Lista de Proxies</CardTitle>
                <CardDescription>
                    Gerencie os proxies que serão usados para os redirecionamentos.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {proxies.length === 0 && (
                             <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed rounded-lg">
                                <Server className="w-12 h-12 text-muted-foreground" />
                                <p className="mt-4 text-muted-foreground">Nenhum proxy adicionado ainda.</p>
                            </div>
                        )}
                        {proxies.map(proxy => (
                            <div key={proxy.id} className="flex items-center gap-4 p-3 pr-2 border rounded-md bg-background">
                                <Server className="w-5 h-5 text-muted-foreground" />
                                <span className="flex-1 font-code text-foreground truncate">{proxy.value}</span>
                                {getStatusBadge(proxy.status)}
                                {proxy.status !== 'testing' ? (
                                    <Button variant="outline" size="sm" onClick={() => testProxy(proxy.id)}>
                                        Testar
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" disabled>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Testando...
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeProxy(proxy.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Proxy</CardTitle>
              <CardDescription>
                Formato: IP:PORTA ou USUÁRIO:SENHA@IP:PORTA
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="proxy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Proxy</FormLabel>
                        <FormControl>
                          <Input placeholder="123.45.67.89:8080" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Proxy
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
