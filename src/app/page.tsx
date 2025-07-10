import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, Zap, Filter, Globe, ArrowRight, BarChart, Target } from 'lucide-react';
import { Logo } from '@/components/icons';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg">CloakDash</span>
          </Link>
          <nav className="ml-auto flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/signup">Cadastre-se</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="container text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Cloaking Definitivo para <span className="text-primary">Afiliados Sérios</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              Proteja suas campanhas de tráfego indesejado, ferramentas de espionagem e concorrentes. O CloakDash te dá o poder de mostrar uma página segura para bots e uma página de vendas para clientes reais.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/signup">Comece de Graça <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-20 sm:py-32 bg-secondary">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Por que escolher o CloakDash?</h2>
              <p className="mt-4 text-lg text-muted-foreground">As ferramentas que você precisa para se manter à frente.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-card border-border hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Shield className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Proteção Robusta</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Mantenha suas páginas de vendas seguras contra bots, concorrentes e revisões manuais de redes de anúncios.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Zap className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Redirecionamentos Rápidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Nossa infraestrutura global garante redirecionamentos em milissegundos, para que você não perca clientes.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Filter className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Filtragem Avançada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Filtre o tráfego por país, dispositivo, faixa de IP, user-agent, referenciador e mais para ter controle granular.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 sm:py-32">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Como Funciona</h2>
              <p className="mt-4 text-lg text-muted-foreground">Um fluxo de filtragem de tráfego simples e poderoso.</p>
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 hidden md:block"></div>
              <div className="absolute top-0 left-1/2 w-1 h-full bg-border -translate-x-1/2 md:hidden"></div>
              
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-4 border-background">
                  <Target className="w-10 h-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">1. Visitante Chega</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">O tráfego acessa seu link do CloakDash.</p>
              </div>
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-4 border-background">
                  <Globe className="w-10 h-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">2. Sistema Analisa</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">IP, User-Agent, País e mais são verificados contra suas regras.</p>
              </div>
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center border-4 border-background">
                  <Shield className="w-10 h-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">3. Redirecionamento de Bot</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">Tráfego indesejado é enviado para a URL Falsa.</p>
              </div>
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center border-4 border-background">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">4. Redirecionamento de Usuário</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">Usuários reais são enviados para sua URL Real.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 sm:py-32 bg-secondary">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Planos e Preços</h2>
              <p className="mt-4 text-lg text-muted-foreground">Escolha o plano certo para você. Sem taxas escondidas.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {['Iniciante', 'Pro', 'Empresarial'].map((plan, index) => (
                <Card key={plan} className={`border-2 ${index === 1 ? 'border-primary' : 'border-border'} flex flex-col`}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">{plan}</CardTitle>
                    <p className="text-4xl font-extrabold">${index === 0 ? '49' : index === 1 ? '99' : '249'}<span className="text-lg font-normal text-muted-foreground">/mês</span></p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-4 text-muted-foreground flex-1">
                      {[
                        `${(index + 1) * 5} Rotas`,
                        `${(index + 1) * 100}k Cliques/mês`,
                        'Filtragem Avançada',
                        index > 0 ? 'Membros da Equipe' : 'Sem Membros da Equipe',
                        index > 1 ? 'Suporte Dedicado' : 'Suporte da Comunidade',
                      ].map(feature => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full mt-8 ${index === 1 ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`} variant={index === 1 ? 'default' : 'outline'}>
                      Escolher Plano
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-32">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Pronto para Proteger Suas Campanhas?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Cadastre-se hoje e ganhe 7 dias grátis. Experimente o poder e a tranquilidade que o CloakDash oferece.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/signup">Comece seu Teste Gratuito</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-semibold">CloakDash</span>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground">Benefícios</Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Preços</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Termos</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacidade</Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">&copy; {new Date().getFullYear()} CloakDash. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
