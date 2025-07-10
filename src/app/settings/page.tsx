
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import withAuth from "@/components/with-auth";
import { Crown, CheckCircle, BarChart, Route, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// Mock data
const currentUser = {
    plan: "Iniciante", // Can be 'Iniciante', 'Pro', 'Empresarial'
    routesUsed: 4,
    clicksUsed: 35489,
    nextBillingDate: "2024-08-20"
};

const plans = [
    {
        name: "Iniciante",
        price: "$29",
        features: [
            "5 Rotas",
            "50k Cliques/mês",
            "Filtragem Padrão",
            "Suporte da Comunidade"
        ],
        routeLimit: 5,
        clickLimit: 50000,
        isCurrent: currentUser.plan === "Iniciante",
        isFeatured: false
    },
    {
        name: "Pro",
        price: "$79",
        features: [
            "50 Rotas",
            "500k Cliques/mês",
            "Filtragem Avançada com IA",
            "Regras de Agendamento",
            "Suporte Prioritário"
        ],
        routeLimit: 50,
        clickLimit: 500000,
        isCurrent: currentUser.plan === "Pro",
        isFeatured: true
    },
    {
        name: "Empresarial",
        price: "$199",
        features: [
            "Rotas Ilimitadas",
            "Cliques Ilimitados",
            "Membros da Equipe",
            "Webhooks e API",
            "Suporte Dedicado",
        ],
        routeLimit: Infinity,
        clickLimit: Infinity,
        isCurrent: currentUser.plan === "Empresarial",
        isFeatured: false
    }
];

const currentPlanDetails = plans.find(p => p.isCurrent)!;


function PricingCard({ plan, isCheckout = false }: { plan: any, isCheckout?: boolean }) {
  const handleCheckout = () => {
    // This is where you would trigger your Stripe checkout logic
    console.log(`Initiating checkout for ${plan.name} plan...`);
    // Example: router.push(`/api/checkout?plan=${plan.name.toLowerCase()}`)
  };
    
  return (
    <Card className={cn("flex flex-col border-2", plan.isCurrent ? "border-primary" : "border-border", plan.isFeatured && !plan.isCurrent ? "border-accent" : "")}>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
            {plan.isCurrent && <span className="text-xs font-semibold text-primary py-1 px-3 rounded-full bg-primary/10">Plano Atual</span>}
        </div>
        <p className="text-4xl font-extrabold">{plan.price}<span className="text-lg font-normal text-muted-foreground">/mês</span></p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-4 text-muted-foreground flex-1">
          {plan.features.map((feature: string) => (
            <li key={feature} className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
       <CardFooter>
            <Button 
              className="w-full"
              disabled={plan.isCurrent}
              variant={plan.isCurrent ? "outline" : "default"}
              onClick={handleCheckout}
              >
              {plan.isCurrent ? 'Seu Plano Atual' : `Fazer ${currentUser.plan === "Iniciante" && plan.name !== "Iniciante" ? "Upgrade" : "Downgrade"}`}
            </Button>
        </CardFooter>
    </Card>
  );
}


function SettingsPage() {
  return (
    <DashboardLayout>
       <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Planos e Assinatura</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Crown className="text-primary"/> Seu Plano Atual: {currentUser.plan}</CardTitle>
                <CardDescription>
                    Sua próxima fatura será em {new Date(currentUser.nextBillingDate).toLocaleDateString('pt-BR')}.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <p className="flex items-center gap-2 text-muted-foreground"><Route className="h-4 w-4"/>Uso de Rotas</p>
                        <p className="font-medium text-foreground">{currentUser.routesUsed} / {currentPlanDetails.routeLimit}</p>
                    </div>
                    <Progress value={(currentUser.routesUsed / currentPlanDetails.routeLimit) * 100} />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <p className="flex items-center gap-2 text-muted-foreground"><BarChart className="h-4 w-4"/>Uso de Cliques</p>
                        <p className="font-medium text-foreground">{currentUser.clicksUsed.toLocaleString('pt-BR')} / {currentPlanDetails.clickLimit.toLocaleString('pt-BR')}</p>
                    </div>
                    <Progress value={(currentUser.clicksUsed / currentPlanDetails.clickLimit) * 100} />
                </div>
            </CardContent>
             <CardFooter className="flex-wrap gap-2">
                <Button>Gerenciar Faturamento</Button>
                <Button variant="outline">Cancelar Assinatura</Button>
            </CardFooter>
        </Card>

         <Card className="bg-muted/40">
            <CardHeader>
                <CardTitle>Precisa de Mais?</CardTitle>
                <CardDescription>
                    Nossos planos foram feitos para escalar com o seu negócio.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Se você precisar de limites personalizados, mais membros na equipe, ou acesso à API, nosso plano Empresarial é a solução.
                </p>
            </CardContent>
             <CardFooter>
                <Button variant="secondary">Fale Conosco</Button>
            </CardFooter>
        </Card>
      </div>

       <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-2">Mude seu plano a qualquer momento</h2>
            <p className="text-muted-foreground text-center mb-6">Escolha o plano que melhor se adapta às suas necessidades.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map(plan => (
            <PricingCard key={plan.name} plan={plan} isCheckout/>
        ))}
      </div>

    </DashboardLayout>
  );
}

export default withAuth(SettingsPage);
