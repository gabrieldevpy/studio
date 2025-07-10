
"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualizar o perfil do usuário no Firebase Auth
      await updateProfile(user, {
        displayName: fullName,
      });

      // Criar um documento para o usuário no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: fullName,
        email: email,
        createdAt: new Date(),
        plan: "Iniciante", // Plano padrão
        admin: email.toLowerCase() === 'gsommer782@gmail.com' // Conceder acesso de administrador ao e-mail específico
      });

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
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
              <Label htmlFor="full-name">Nome Completo</Label>
              <Input id="full-name" placeholder="João da Silva" required value={fullName} onChange={e => setFullName(e.target.value)} />
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
  );
}
