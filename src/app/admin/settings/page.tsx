
"use client";

import React, { useState } from 'react';
import { Settings, Wrench, AlertTriangle, Loader2 } from "lucide-react";
import withAuth from "@/components/with-auth";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function AdminSettingsPage() {
    // In a real app, these values would come from a Firestore document
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = () => {
        setIsSaving(true);
        console.log("Saving settings:", { maintenanceMode });

        // Simulate API call to save settings
        setTimeout(() => {
            toast({
                title: "Configurações Salvas",
                description: "As configurações globais do sistema foram atualizadas."
            });
            setIsSaving(false);
        }, 1500);
    }

    return (
        <AdminLayout>
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2"><Settings className="h-8 w-8 text-primary" /> Configurações Gerais</h1>
            </div>
            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><Wrench /> Ferramentas de Administração</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="maintenance-mode" className="text-base">Modo de Manutenção</Label>
                                <p className="text-sm text-muted-foreground">
                                    Quando ativado, apenas administradores podem acessar o site.
                                </p>
                            </div>
                            <Switch
                                id="maintenance-mode"
                                checked={maintenanceMode}
                                onCheckedChange={setMaintenanceMode}
                                className="data-[state=checked]:bg-destructive"
                            />
                        </div>

                        {maintenanceMode && (
                             <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Atenção!</AlertTitle>
                                <AlertDescription>
                                    O modo de manutenção está ativado. Usuários normais não conseguirão acessar o painel.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Salvar Alterações
                        </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Integrações</CardTitle>
                        <CardDescription>Gerencie as chaves de API para serviços de terceiros (em breve).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg text-center">
                            <p className="text-muted-foreground">Gerenciamento de chaves de API para GeoIP, etc.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

export default withAuth(AdminSettingsPage);
