
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, ShieldCheck } from "lucide-react";
import withAuth from "@/components/with-auth";

// Mock data, in a real app this would come from Firestore
const plans = [
    { id: 'free', name: 'Iniciante', price: 0, routeLimit: 5, features: 'Filtragem Padrão, 50k Cliques/mês', active: true },
    { id: 'basic', name: 'Pro', price: 79, routeLimit: 50, features: 'Filtragem com IA, 500k Cliques/mês', active: true },
    { id: 'pro', name: 'Empresarial', price: 199, routeLimit: Infinity, features: 'Rotas Ilimitadas, Cliques Ilimitados, API', active: true },
];

function AdminPlansPage() {
    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <ShieldCheck className="h-8 w-8 mr-2" />
                    <h1 className="text-3xl font-bold">Planos e Assinaturas</h1>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Criar Novo Plano
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <Card key={plan.id}>
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>R$ {plan.price} / mês</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <Label>Limite de Rotas</Label>
                                <p className="text-sm p-2 font-medium">{isFinite(plan.routeLimit) ? plan.routeLimit : 'Ilimitado'}</p>
                             </div>
                             <div>
                                <Label>Descrição de Features</Label>
                                <p className="text-sm p-2">{plan.features}</p>
                             </div>
                             <div className="flex items-center justify-between pt-2">
                                <Label>Plano Ativo</Label>
                                <Switch checked={plan.active} readOnly/>
                             </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline">Excluir</Button>
                            <Button>Salvar</Button>
                        </CardFooter>
                    </Card>
                ))}

                 <Card className="border-dashed flex items-center justify-center">
                    <Button variant="ghost" className="w-full h-full text-muted-foreground">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Adicionar novo plano
                    </Button>
                </Card>
            </div>

        </AdminLayout>
    );
}

export default withAuth(AdminPlansPage);
