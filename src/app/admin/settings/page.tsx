
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, ExternalLink, Bell, CreditCard } from "lucide-react";
import withAuth from "@/components/with-auth";

export default function AdminSettingsPage() {
    return (
        <AdminLayout>
            <div className="flex items-center mb-6">
                <Settings className="h-8 w-8 mr-2" />
                <h1 className="text-3xl font-bold">Configurações Gerais</h1>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Integrações</CardTitle>
                            <CardDescription>Gerencie as chaves de API para serviços externos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="stripe-key" className="flex items-center gap-2"><CreditCard className="h-4 w-4"/> Chave da API do Stripe</Label>
                                <Input id="stripe-key" type="password" placeholder="sk_test_••••••••••••••••••••••••" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postmark-key" className="flex items-center gap-2"><Bell className="h-4 w-4"/> Chave da API do Postmark</Label>
                                <Input id="postmark-key" type="password" placeholder="••••••••-••••-••••-••••-••••••••••••" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações de Notificação</CardTitle>
                            <CardDescription>Controle como o sistema envia e-mails e notificações.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="sender-email">E-mail do Remetente</Label>
                                <Input id="sender-email" type="email" placeholder="nao-responda@cloakdash.com"/>
                            </div>
                             <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label>Notificar sobre novos usuários</Label>
                                    <p className="text-xs text-muted-foreground">Envia um e-mail para o admin quando um novo usuário se cadastra.</p>
                                </div>
                                <Switch defaultChecked/>
                            </div>
                        </CardContent>
                    </Card>

                     <div className="flex justify-end">
                        <Button>Salvar Todas as Configurações</Button>
                    </div>
                </div>

                 <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documentação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                                <ExternalLink className="mr-2 h-4 w-4"/>
                                Documentação da API
                            </Button>
                             <Button variant="outline" className="w-full justify-start">
                                <ExternalLink className="mr-2 h-4 w-4"/>
                                Guias de Integração
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AdminLayout>
    );
}
