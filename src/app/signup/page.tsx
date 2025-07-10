
"use client"
import Link from "next/link";
import { Logo } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const SignupForm = dynamic(() => import('@/components/signup-form').then(mod => mod.SignupForm), { 
  ssr: false,
  loading: () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  ),
});


export default function SignupPage() {
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
          <SignupForm />
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
