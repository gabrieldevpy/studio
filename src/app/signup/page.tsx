"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
           <Link href="/" className="flex items-center justify-center mb-4 space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg">CloakDash</span>
          </Link>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">Cadastre-se</h1>
          <p className="text-sm text-muted-foreground">Insira suas informações para criar uma conta</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="full-name">Nome Completo</Label>
                  <Input id="full-name" placeholder="João da Silva" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="m@exemplo.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Criar uma conta
              </Button>
              <Button variant="outline" className="w-full">
                Cadastre-se com Google
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
