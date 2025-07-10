
"use client";

import React, { useState } from 'react';
import { ShieldCheck, Loader2, Route, BarChart, Infinity as InfinityIcon } from "lucide-react";
import withAuth from "@/components/with-auth";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

type Plan = {
    id: 'iniciante' | 'pro' | 'empresarial';
    name: string;
    price: string;
    routeLimit: number;
    clickLimit: number;
};

const initialPlans: Plan[] = [
    { id: 'iniciante', name: "Iniciante", price: "29", routeLimit: 5, clickLimit: 50000 },
    { id: 'pro', name: "Pro", price: "79", routeLimit: 50, clickLimit: 500000 },
    { id: 'empresarial', name: "Empresarial", price: "199", routeLimit: Infinity, clickLimit: Infinity },
];


function PlanCard({ plan, onSave, isSaving }: { plan: Plan; onSave: (p: Plan) => void, isSaving: boolean }) {
    const [currentPlan, setCurrentPlan] = useState<Plan>(plan);

    const handleSave = () => {
        // In a real app, this would update Firestore
        onSave(currentPlan);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>Configure os detalhes deste plano.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`price-${plan.id}`}>Preço (USD/mês)</Label>
                    <Input id={`price-${plan.id}`} type="number" value={currentPlan.price} onChange={e => setCurrentPlan(p => ({...p, price: e.target.value}))}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor={`routes-${plan.id}`}>Limite de Rotas</Label>
                    <div className='flex items-center gap-2'>
                        <Route className='h-4 w-4 text-muted-foreground'/>
                        <Input id={`routes-${plan.id}`} type="number" disabled={currentPlan.routeLimit === Infinity} value={currentPlan.routeLimit === Infinity ? '' : currentPlan.routeLimit} onChange={e => setCurrentPlan(p => ({...p, routeLimit: Number(e.target.value)}))}/>
                         {currentPlan.routeLimit === Infinity && <InfinityIcon className='h-5 w-5' />}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor={`clicks-${plan.id}`}>Limite de Cliques</Label>
                     <div className='flex items-center gap-2'>
                        <BarChart className='h-4 w-4 text-muted-foreground'/>
                        <Input id={`clicks-${plan.id}`} type="number" disabled={currentPlan.clickLimit === Infinity} value={currentPlan.clickLimit === Infinity ? '' : currentPlan.clickLimit} onChange={e => setCurrentPlan(p => ({...p, clickLimit: Number(e.target.value)}))}/>
                        {currentPlan.clickLimit === Infinity && <InfinityIcon className='h-5 w-5' />}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Salvar Alterações
                </Button>
            </CardFooter>
        </Card>
    )
}


function AdminPlansPage() {
    const [plans, setPlans] = useState(initialPlans);
    const [isSaving, setIsSaving] = useState(false);

    const handleSavePlan = (updatedPlan: Plan) => {
        setIsSaving(true);
        console.log("Saving plan:", updatedPlan);

        // Simulate API call
        setTimeout(() => {
            setPlans(currentPlans => currentPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
            toast({
                title: "Plano Atualizado!",
                description: `O plano ${updatedPlan.name} foi salvo com sucesso.`
            });
            setIsSaving(false);
        }, 1000);
    }

    return (
        <AdminLayout>
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2"><ShieldCheck className="h-8 w-8 text-primary" /> Planos e Assinaturas</h1>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} onSave={handleSavePlan} isSaving={isSaving}/>
                ))}
            </div>
        </AdminLayout>
    );
}

export default withAuth(AdminPlansPage);
