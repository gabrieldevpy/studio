
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import withAuth from "@/components/with-auth";
import { Crown, CheckCircle, BarChart, Route, Infinity as InfinityIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";


type Plan = {
    name: "Iniciante" | "Pro" | "Empresarial";
    priceId: string; // Adicionado para integração com Stripe/etc.
    price: string;
    features: string[];
    routeLimit: number;
    clickLimit: number;
    isCurrent: boolean;
    isFeatured: boolean;
};


function SettingsPage() {
  const { user, userData, loading: userLoading } = useUserData();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isChangingPlan, setIsChangingPlan] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (userData) {
      const currentUserPlan = userData.plan || "Iniciante";
      const allPlans: Omit<Plan, 'isCurrent'>[] = [
          {
              name: "Iniciante",
              priceId: "price_iniciante_mensal", // Exemplo de ID de preço
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
              priceId: "price_pro_mensal", // Exemplo de ID de preço
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
              priceId: "price_empresarial_mensal", // Exemplo de ID de preço
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
  
  const handlePlanChange = async (plan: Plan) => {
    if (!user) {
        toast({ variant: "destructive", title: "Erro", description: "Usuário não encontrado." });
        return;
    }
    setIsChangingPlan(plan.name);

    try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                planName: plan.name,
                priceId: plan.priceId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Falha ao criar a sessão de checkout.');
        }

        const data = await response.json();

        // Em uma integração real, você redirecionaria para o checkout:
        // window.location.href = data.checkoutUrl;
        
        // Para simulação, exibimos uma mensagem e atualizamos a página
        toast({
            title: "Plano Atualizado!",
            description: `Seu plano foi alterado para ${plan.name} com sucesso.`,
        });

        // Recarregar a página ou revalidar os dados para refletir a mudança
        router.refresh(); 

    } catch(error: any) {
        console.error("Error changing plan:", error);
        toast({ variant: "destructive", title: "Erro", description: error.message || "Não foi possível alterar seu plano." });
    } finally {
        setIsChangingPlan(null);
    }
  };

  const handleManageBilling = () => {
    toast({
        title: "Portal de Faturamento",
        description: "Em um aplicativo real, isso o levaria para o portal de faturamento do Stripe.",
    });
  }

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    setShowCancelDialog(false);
    
    // Simulate canceling by downgrading to the free/starter plan
    const userRef = doc(db, "users", user.uid);
    try {
        await updateDoc(userRef, { plan: 'Iniciante' });
        toast({
            title: "Assinatura Cancelada",
            description: "Sua assinatura foi cancelada e seu plano foi alterado para Iniciante."
        });
        router.refresh(); // Reload data
    } catch(error) {
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível cancelar sua assinatura. Tente novamente."
        });
    }
  };

  const handleContactUs = () => {
    toast({
        title: "Contato",
        description: "Em um aplicativo real, isso abriria um chat ou formulário de contato.",
    });
  }

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
  }

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
                        <p className="font-medium text-foreground">{currentUser.routesUsed} / {currentPlanDetails?.routeLimit === Infinity ? <InfinityIcon className="h-4 w-4"/> : currentPlanDetails?.routeLimit}</p>
                    </div>
                    {currentPlanDetails && currentPlanDetails.routeLimit !== Infinity && <Progress value={(currentUser.routesUsed / currentPlanDetails.routeLimit) * 100} />}
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <p className="flex items-center gap-2 text-muted-foreground"><BarChart className="h-4 w-4"/>Uso de Cliques</p>
                        <p className="font-medium text-foreground">{currentUser.clicksUsed.toLocaleString('pt-BR')} / {currentPlanDetails?.clickLimit === Infinity ? <InfinityIcon className="h-4 w-4"/> : currentPlanDetails?.clickLimit.toLocaleString('pt-BR')}</p>
                    </div>
                    {currentPlanDetails && currentPlanDetails.clickLimit !== Infinity && <Progress value={(currentUser.clicksUsed / currentPlanDetails.clickLimit) * 100} />}
                </div>
            </CardContent>
             <CardFooter className="flex-wrap gap-2">
                <Button onClick={handleManageBilling} disabled={currentPlanDetails?.name === "Iniciante"}>Gerenciar Faturamento</Button>
                <Button variant="outline" onClick={() => setShowCancelDialog(true)} disabled={currentPlanDetails?.name === "Iniciante"}>Cancelar Assinatura</Button>
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
                <Button variant="secondary" onClick={handleContactUs}>Fale Conosco</Button>
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
                        onClick={() => handlePlanChange(plan)}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {plan.isCurrent ? 'Seu Plano Atual' : (isLoading ? 'Processando...' : 'Fazer Upgrade/Downgrade')}
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação cancelará sua assinatura paga e mudará seu plano para o "Iniciante" ao final do ciclo de faturamento atual. Você pode perder o acesso aos recursos do plano Pro.
            </dAlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive hover:bg-destructive/90">
              Sim, cancelar assinatura
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </DashboardLayout>
  );
}

export default withAuth(SettingsPage);
