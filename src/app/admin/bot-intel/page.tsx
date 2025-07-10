
"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Bot, Timer, Server, Shield, Loader2 } from "lucide-react";
import withAuth from "@/components/with-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import type { BotIntelData, GlobalBlocklists } from "@/lib/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { getBotIntelData } from "@/lib/bot-intel"; // To show the combined list
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ListCard = ({ title, items, emptyText }: { title: string; items: string[]; emptyText: string }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{items.length} entradas ativas</CardDescription>
        </CardHeader>
        <CardContent className="font-code text-sm text-muted-foreground p-4 bg-muted/50 rounded-md max-h-48 overflow-y-auto">
            {items.length > 0 ? (
                <pre><code>{items.join('\n')}</code></pre>
            ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">{emptyText}</div>
            )}
        </CardContent>
    </Card>
);

function AdminBotIntelPage() {
    const [authUser] = useAuthState(auth);
    const [fullIntelData, setFullIntelData] = useState<BotIntelData | null>(null);
    const [adminLists, setAdminLists] = useState<GlobalBlocklists>({ blockedIps: [], blockedUserAgents: [], blockedAsns: [] });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!authUser) return;

        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [intelData, idToken] = await Promise.all([getBotIntelData(), authUser.getIdToken()]);
                setFullIntelData(intelData);

                const response = await fetch('/api/admin/bot-intel', {
                    headers: { Authorization: `Bearer ${idToken}` }
                });

                if (!response.ok) throw new Error('Falha ao buscar listas de admin');
                const adminData: GlobalBlocklists = await response.json();
                setAdminLists(adminData);

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
        fetchAllData();
    }, [authUser]);
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const idToken = await authUser?.getIdToken();
            if (!idToken) throw new Error("Usuário não autenticado");

            const response = await fetch('/api/admin/bot-intel', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}` 
                },
                body: JSON.stringify(adminLists),
            });

            if (!response.ok) throw new Error('Falha ao salvar as listas.');
            
            toast({
                title: "Listas Atualizadas",
                description: "Suas listas de bloqueio globais foram salvas com sucesso.",
            });
            // Refetch data to show combined lists correctly
            const intelData = await getBotIntelData();
            setFullIntelData(intelData);

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao Salvar",
                description: error.message || "Ocorreu um problema ao salvar as listas.",
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleTextareaChange = (field: keyof GlobalBlocklists, value: string) => {
        setAdminLists(prev => ({...prev, [field]: value.split('\n').filter(item => item.trim() !== '')}))
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center mb-6"> <Bot className="h-8 w-8 mr-2" /> <h1 className="text-3xl font-bold">Bot Intelligence</h1></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"> <Skeleton className="h-32" /> <Skeleton className="h-32" /> <Skeleton className="h-32" /> </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> <Skeleton className="h-80" /> <Skeleton className="h-80" /> </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex items-center mb-6"> <Bot className="h-8 w-8 mr-2" /> <h1 className="text-3xl font-bold">Bot Intelligence</h1></div>
            <p className="text-muted-foreground mb-6"> Status e gerenciamento das listas de bloqueio globais. Regras aqui são aplicadas a todas as rotas. </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <ListCard title="IPs Bloqueados" items={fullIntelData?.blockedIps || []} emptyText="Nenhum IP na lista global." />
                <ListCard title="User-Agents Bloqueados" items={fullIntelData?.blockedUserAgents || []} emptyText="Nenhum User-Agent na lista global." />
                <ListCard title="ASNs Bloqueados" items={fullIntelData?.blockedAsns || []} emptyText="Nenhuma ASN na lista global." />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Listas de Bloqueio Globais</CardTitle>
                    <CardDescription>Adicione suas próprias regras que serão aplicadas a todas as suas rotas. Insira um valor por linha.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="admin-ips">IPs para Bloquear</Label>
                        <Textarea id="admin-ips" className="min-h-48 font-code" placeholder="1.2.3.4&#10;192.168.1.0/24" value={(adminLists.blockedIps || []).join('\n')} onChange={(e) => handleTextareaChange('blockedIps', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="admin-uas">User-Agents para Bloquear</Label>
                        <Textarea id="admin-uas" className="min-h-48 font-code" placeholder="BadBot/1.0&#10;MaliciousCrawler" value={(adminLists.blockedUserAgents || []).join('\n')} onChange={(e) => handleTextareaChange('blockedUserAgents', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="admin-asns">ASNs para Bloquear</Label>
                        <Textarea id="admin-asns" className="min-h-48 font-code" placeholder="12345&#10;67890" value={(adminLists.blockedAsns || []).join('\n')} onChange={(e) => handleTextareaChange('blockedAsns', e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {isSaving ? 'Salvando...' : 'Salvar Listas Globais'}
                    </Button>
                </CardFooter>
            </Card>
        </AdminLayout>
    );
}

export default withAuth(AdminBotIntelPage);
