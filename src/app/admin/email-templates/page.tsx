
"use client";

import Image from "next/image";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clipboard, Mail } from "lucide-react";
import withAuth from "@/components/with-auth";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const CodeBlock = ({ text, title }: { text: string, title: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast({
            title: `${title} Copiado!`,
            description: "O texto foi copiado para a área de transferência.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative font-code bg-muted p-4 rounded-md text-sm text-muted-foreground">
            <pre><code>{text}</code></pre>
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={handleCopy}
            >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
            </Button>
        </div>
    );
};

const suggestedSubject = "Redefina sua senha do CloakDash";

const suggestedBody = `Olá,

Recebemos uma solicitação para redefinir a senha da sua conta no CloakDash.

Para continuar, clique no link abaixo:
%LINK%

Este link é válido por 24 horas.

Se você não solicitou essa alteração, pode ignorar este e-mail com segurança. Nenhuma alteração será feita na sua conta.

Atenciosamente,
Equipe CloakDash`;


function AdminEmailTemplatesPage() {
    return (
        <AdminLayout>
            <div className="flex items-center mb-6">
                <Mail className="h-8 w-8 mr-2" />
                <h1 className="text-3xl font-bold">Modelos de E-mail</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Como Personalizar o E-mail de Redefinição de Senha</CardTitle>
                    <CardDescription>
                        Siga este guia passo a passo para alterar o e-mail padrão do Firebase e deixá-lo mais profissional. As alterações são feitas no Console do Firebase.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg">
                        <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-lg">Passo 1: Acesse a área de Autenticação</h3>
                            <p className="text-muted-foreground">No menu lateral do seu projeto no <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline text-primary">Console do Firebase</a>, navegue até a seção de **Authentication**.</p>
                        </div>
                        <div className="flex-shrink-0">
                           <Image data-ai-hint="screenshot dashboard" src="https://placehold.co/400x250.png" alt="Passo 1: Menu de Autenticação" width={400} height={250} className="rounded-md border"/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row-reverse gap-6 p-4 border rounded-lg">
                         <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-lg">Passo 2: Encontre os Modelos de E-mail</h3>
                            <p className="text-muted-foreground">Dentro de Authentication, clique na aba **Templates** (Modelos).</p>
                        </div>
                        <div className="flex-shrink-0">
                           <Image data-ai-hint="screenshot settings" src="https://placehold.co/400x250.png" alt="Passo 2: Aba Templates" width={400} height={250} className="rounded-md border"/>
                        </div>
                    </div>
                     <div className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg">
                        <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-lg">Passo 3: Edite o Modelo de Redefinição de Senha</h3>
                            <p className="text-muted-foreground">Na lista, encontre a opção **Password Reset** (Redefinição de senha) e clique no ícone de lápis para editar.</p>
                        </div>
                        <div className="flex-shrink-0">
                           <Image data-ai-hint="screenshot email list" src="https://placehold.co/400x250.png" alt="Passo 3: Editar modelo" width={400} height={250} className="rounded-md border"/>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Passo 4: Cole os Textos Sugeridos</h3>
                        <p className="text-muted-foreground mb-4">Copie e cole os textos abaixo nos campos correspondentes no Firebase. O campo `Message` não aceita HTML, então a versão para ele é em texto plano.</p>
                        <div className="space-y-4">
                            <div>
                                <Label>Assunto (Subject)</Label>
                                <CodeBlock text={suggestedSubject} title="Assunto" />
                            </div>
                            <div>
                                <Label>Mensagem (Message)</Label>
                                <CodeBlock text={suggestedBody} title="Mensagem" />
                            </div>
                        </div>
                    </div>
                     <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold text-lg mb-2">Dica Extra</h3>
                        <p className="text-muted-foreground">Você também pode personalizar o **Nome do Remetente** e o **E-mail de Resposta** na mesma tela de edição para que correspondam à sua marca. Depois de salvar, todos os novos e-mails de redefinição de senha usarão seu novo modelo.</p>
                    </div>

                </CardContent>
            </Card>
        </AdminLayout>
    );
}

export default withAuth(AdminEmailTemplatesPage);
