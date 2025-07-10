
"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Timer, Server, Shield } from "lucide-react";
import withAuth from "@/components/with-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import type { BotIntelData } from "@/lib/bot-intel";


function AdminBotIntelPage() {
    const [intelData, setIntelData] = useState<BotIntelData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIntelData = async () => {
            try {
                const response = await fetch('/api/bot-intel');
                if (!response.ok) {
                    throw new Error(`Failed to fetch bot intelligence: ${response.statusText}`);
                }
                const data = await response.json();
                setIntelData(data);
            } catch (error) {
                console.error("Error fetching bot intel data:", error);
                toast({
                    variant: "destructive",
                    title: "Erro ao Carregar Dados",
                    description: "Não foi possível buscar as informações de Bot Intelligence.",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchIntelData();
    }, []);

    const ListCard = ({ title, items, emptyText }: { title: string; items: string[]; emptyText: string }) => (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{items.length} entradas</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-48">
                    {items.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {items.map((item, index) => (
                                <div key={index} className="text-sm font-code text-muted-foreground bg-muted/50 p-2 rounded-md">{item}</div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">{emptyText}</div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center mb-6">
                    <Bot className="h-8 w-8 mr-2" />
                    <h1 className="text-3xl font-bold">Bot Intelligence</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-80" />
                    <Skeleton className="h-80" />
                    <Skeleton className="h-80" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex items-center mb-6">
                <Bot className="h-8 w-8 mr-2" />
                <h1 className="text-3xl font-bold">Bot Intelligence</h1>
            </div>
            <p className="text-muted-foreground mb-6">
                Status das listas de bloqueio globais que são atualizadas automaticamente. Estas regras são aplicadas a todas as rotas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status do Serviço</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Operacional</div>
                        <p className="text-xs text-muted-foreground">Listas de bots sendo servidas.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Última Atualização</CardTitle>
                        <Timer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {intelData?.lastUpdated ? new Date(intelData.lastUpdated).toLocaleString('pt-BR') : 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">Dados atualizados a cada hora.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entradas Totais</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(intelData?.blockedIps.length || 0) + (intelData?.blockedUserAgents.length || 0) + (intelData?.blockedAsns.length || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Em todas as listas globais.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ListCard title="IPs Bloqueados" items={intelData?.blockedIps || []} emptyText="Nenhum IP na lista global." />
                <ListCard title="User-Agents Bloqueados" items={intelData?.blockedUserAgents || []} emptyText="Nenhum User-Agent na lista global." />
                <ListCard title="ASNs Bloqueados" items={intelData?.blockedAsns || []} emptyText="Nenhuma ASN na lista global." />
            </div>

        </AdminLayout>
    );
}

export default withAuth(AdminBotIntelPage);
