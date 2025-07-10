
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import withAuth from "@/components/with-auth";
import { Crown, CheckCircle, BarChart, Route, Infinity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/hooks/use-user-data";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Plan = {
    name: "Iniciante" | "Pro" | "Empresarial";
    price: string;
    features: string[];
    routeLimit: number;
    clickLimit: number;
    isCurrent: boolean;
    isFeatured: boolean;
};


function SettingsPage() {
  const { user, userData, loading: userLoading } = useUserData();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isChangingPlan, setIsChangingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      const currentUserPlan = userData.plan || "Iniciante";
      const allPlans: Omit<Plan, 'isCurrent'>[] = [
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
              isFeatured: false
          }
      ];

      setPlans(allPlans.map(p => ({
          ...p,
          isCurrent: p.name === currentUserPlan,
      })));
    }
  }, [userData]);
  
  const handlePlanChange = async (planName: Plan['name']) => {
    if (!user) {
        toast({ variant: "destructive", title: "Erro", description: "Usuário não encontrado." });
        return;
    }
    setIsChangingPlan(planName);
    try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            plan: planName
        });
        toast({
            title: "Plano Atualizado!",
            description: `Seu plano foi alterado para ${planName} com sucesso.`
        });
    } catch(error) {
        console.error("Error changing plan:", error);
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível alterar seu plano." });
    } finally {
        setIsChangingPlan(null);
    }
  };

  const currentPlanDetails = plans.find(p => p.isCurrent);
  
  if (userLoading || plans.length === 0) {
      return (
          <DashboardLayout>
              <div className="flex items-center mb-6">
                <Skeleton className="h-9 w-72" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <Skeleton className="lg:col-span-2 h-64" />
                  <Skeleton className="h-64" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Skeleton className="h-96" />
                  <Skeleton className="h-96" />
                  <Skeleton className="h-96" />
              </div>
          </DashboardLayout>
      )
  }

  // Mock data
  const currentUser = {
      plan: userData?.plan || "Iniciante",
      routesUsed: userData?.routesUsed || 0, // This should come from an aggregation
      clicksUsed: userData?.clicksUsed || 0, // This should come from an aggregation
      nextBillingDate: "2024-08-20"
  };

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
                        <p className="font-medium text-foreground">{currentUser.routesUsed} / {currentPlanDetails?.routeLimit === Infinity ? <Infinity className="h-4 w-4"/> : currentPlanDetails?.routeLimit}</p>
                    </div>
                    {currentPlanDetails && currentPlanDetails.routeLimit !== Infinity && <Progress value={(currentUser.routesUsed / currentPlanDetails.routeLimit) * 100} />}
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <p className="flex items-center gap-2 text-muted-foreground"><BarChart className="h-4 w-4"/>Uso de Cliques</p>
                        <p className="font-medium text-foreground">{currentUser.clicksUsed.toLocaleString('pt-BR')} / {currentPlanDetails?.clickLimit === Infinity ? <Infinity className="h-4 w-4"/> : currentPlanDetails?.clickLimit.toLocaleString('pt-BR')}</p>
                    </div>
                    {currentPlanDetails && currentPlanDetails.clickLimit !== Infinity && <Progress value={(currentUser.clicksUsed / currentPlanDetails.clickLimit) * 100} />}
                </div>
            </CardContent>
             <CardFooter className="flex-wrap gap-2">
                <Button disabled>Gerenciar Faturamento (Stripe)</Button>
                <Button variant="outline" disabled>Cancelar Assinatura</Button>
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
                <Button variant="secondary" disabled>Fale Conosco</Button>
            </CardFooter>
        </Card>
      </div>

       <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-2">Mude seu plano a qualquer momento</h2>
            <p className="text-muted-foreground text-center mb-6">Escolha o plano que melhor se adapta às suas necessidades.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map(plan => {
            const isLoading = isChangingPlan === plan.name;
            return (
                <Card key={plan.name} className={cn("flex flex-col border-2", plan.isCurrent ? "border-primary" : "border-border", plan.isFeatured && !plan.isCurrent ? "border-accent" : "")}>
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
                        disabled={plan.isCurrent || !!isChangingPlan}
                        variant={plan.isCurrent ? "outline" : "default"}
                        onClick={() => handlePlanChange(plan.name)}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {plan.isCurrent ? 'Seu Plano Atual' : (isLoading ? 'Alterando...' : 'Escolher Plano')}
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
      </div>

    </DashboardLayout>
  );
}

export default withAuth(SettingsPage);
