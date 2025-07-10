
"use client";

import React, { useState } from 'react';
import { CreditCard, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import withAuth from "@/components/with-auth";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function AdminCheckoutSettingsPage() {
    // Em um app real, estes valores viriam de um local seguro (ex: Firestore)
    const [publishableKey, setPublishableKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = () => {
        setIsSaving(true);
        console.log("Saving checkout settings:", { publishableKey, secretKey });

        // Simula uma chamada de API para salvar as chaves
        setTimeout(() => {
            toast({
                title: "Configurações Salvas",
                description: "Suas chaves de API de pagamento foram salvas com segurança."
            });
            setIsSaving(false);
        }, 1500);
    }

    return (
        <AdminLayout>
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2"><CreditCard className="h-8 w-8 text-primary" /> Configurações de Checkout</h1>
            </div>
            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Integração de Pagamento</CardTitle>
                        <CardDescription>Conecte seu provedor de pagamento (ex: Stripe) inserindo suas chaves de API.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert>
                          <KeyRound className="h-4 w-4" />
                          <AlertTitle>Mantenha suas chaves seguras</AlertTitle>
                          <AlertDescription>
                            Nunca compartilhe sua chave secreta. Ela será armazenada de forma criptografada no servidor.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                            <Label htmlFor="publishable-key">Chave Publicável</Label>
                            <Input 
                                id="publishable-key" 
                                placeholder="pk_test_..." 
                                value={publishableKey}
                                onChange={(e) => setPublishableKey(e.target.value)}
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="secret-key">Chave Secreta</Label>
                             <div className="relative">
                                <Input 
                                    id="secret-key" 
                                    type={showSecretKey ? 'text' : 'password'}
                                    placeholder="sk_test_..." 
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute inset-y-0 right-0 h-full px-3"
                                    onClick={() => setShowSecretKey(!showSecretKey)}
                                >
                                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                             </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Salvar Chaves
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AdminLayout>
    );
}

export default withAuth(AdminCheckoutSettingsPage);
