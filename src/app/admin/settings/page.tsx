
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <AdminLayout>
            <div className="flex items-center mb-6">
                <Settings className="h-8 w-8 mr-2" />
                <h1 className="text-3xl font-bold">Configurações Gerais</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Configurações do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Funcionalidade em desenvolvimento.</p>
                        <p className="text-muted-foreground">Aqui você poderá ajustar configurações globais da aplicação.</p>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
