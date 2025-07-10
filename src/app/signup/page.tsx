"use client"
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Conta Criada!",
        description: "Sua conta foi criada com sucesso. Redirecionando...",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      let description = "Ocorreu um erro ao criar sua conta. Tente novamente.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Este e-mail já está em uso. Tente fazer login.";
      } else if (error.code === 'auth/weak-password') {
        description = "Sua senha é muito fraca. Ela deve ter pelo menos 6 caracteres.";
      }
      toast({
        variant: "destructive",
        title: "Erro de Cadastro",
        description,
      });
    } finally {
      setLoading(false);
    }
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
                <Input id="email" type="email" placeholder="m@exemplo.com" required value={email} onChange={e => setEmail(e.target.value)}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}/>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar uma conta
              </Button>
              <Button variant="outline" className="w-full" disabled>
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
