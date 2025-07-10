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
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="container text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Ultimate Cloaking for <span className="text-primary">Serious Affiliates</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              Protect your campaigns from unwanted traffic, spy tools, and competitors. CloakDash gives you the power to show a safe page to bots and a money page to real customers.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/signup">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-20 sm:py-32 bg-secondary">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Why Choose CloakDash?</h2>
              <p className="mt-4 text-lg text-muted-foreground">The tools you need to stay ahead of the game.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-card border-border hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Shield className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Ironclad Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Keep your money pages safe from bots, competitors, and manual reviews from ad networks.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Zap className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Lightning Fast Redirects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Our global infrastructure ensures redirects happen in milliseconds, so you don't lose customers.</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Filter className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Advanced Filtering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Filter traffic by country, device, IP range, user-agent, referrer, and more to get granular control.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 sm:py-32">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">A simple, powerful traffic filtering flow.</p>
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 hidden md:block"></div>
              <div className="absolute top-0 left-1/2 w-1 h-full bg-border -translate-x-1/2 md:hidden"></div>
              
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-4 border-background">
                  <Target className="w-10 h-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">1. Visitor Arrives</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">Traffic hits your CloakDash link.</p>
              </div>
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-4 border-background">
                  <Globe className="w-10 h-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">2. System Analyzes</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">IP, User-Agent, Country & more are checked against your rules.</p>
              </div>
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center border-4 border-background">
                  <Shield className="w-10 h-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">3. Bot Redirect</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">Unwanted traffic is sent to the Fake URL.</p>
              </div>
              <div className="flex flex-col items-center text-center z-10">
                <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center border-4 border-background">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">4. User Redirect</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">Real users are sent to your Real URL.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 sm:py-32 bg-secondary">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Pricing Plans</h2>
              <p className="mt-4 text-lg text-muted-foreground">Choose the plan that's right for you. No hidden fees.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {['Starter', 'Pro', 'Enterprise'].map((plan, index) => (
                <Card key={plan} className={`border-2 ${index === 1 ? 'border-primary' : 'border-border'} flex flex-col`}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">{plan}</CardTitle>
                    <p className="text-4xl font-extrabold">${index === 0 ? '49' : index === 1 ? '99' : '249'}<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-4 text-muted-foreground flex-1">
                      {[
                        `${(index + 1) * 5} Routes`,
                        `${(index + 1) * 100}k Clicks/mo`,
                        'Advanced Filtering',
                        index > 0 ? 'Team Members' : 'No Team Members',
                        index > 1 ? 'Dedicated Support' : 'Community Support',
                      ].map(feature => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full mt-8 ${index === 1 ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`} variant={index === 1 ? 'default' : 'outline'}>
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-32">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Ready to Secure Your Campaigns?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Sign up today and get your first 7 days on us. Experience the power and peace of mind that comes with CloakDash.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/signup">Start Your Free Trial</Link>
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
            <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground">Benefits</Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">&copy; {new Date().getFullYear()} CloakDash. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
