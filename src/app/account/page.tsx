
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import withAuth from "@/components/with-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

function AccountSettingsPage() {
    const [user] = useAuthState(auth);
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = () => {
        setLoading(true);
        // Em um app real, você chamaria updateProfile do Firebase aqui
        console.log("Updating profile with name:", displayName);
        setTimeout(() => {
            toast({
                title: "Perfil Atualizado",
                description: "Seu nome foi atualizado com sucesso.",
            });
            setLoading(false);
        }, 1000);
    };
    
    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "As novas senhas não coincidem.",
            });
            return;
        }
        if (newPassword.length < 6) {
             toast({
                variant: "destructive",
                title: "Erro",
                description: "A nova senha deve ter pelo menos 6 caracteres.",
            });
            return;
        }

        setLoading(true);
        // Em um app real, você chamaria reauthenticateWithCredential e updatePassword do Firebase
        console.log("Updating password...");
        setTimeout(() => {
            toast({
                title: "Senha Atualizada",
                description: "Sua senha foi alterada com sucesso.",
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setLoading(false);
        }, 1500);
    };


  return (
    <DashboardLayout>
       <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Configurações da Conta</h1>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seu nome e e-mail.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Nome Completo</Label>
                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={user?.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUpdateProfile} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>Para sua segurança, escolha uma senha forte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUpdatePassword} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Atualizar Senha
                </Button>
            </CardFooter>
        </Card>
      </div>

    </DashboardLayout>
  );
}

export default withAuth(AccountSettingsPage);
