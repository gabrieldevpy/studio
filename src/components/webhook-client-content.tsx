
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Check, Clipboard, Webhook, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CodeBlock = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
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
}

export default function WebhookClientContent() {
    const [webhookUrl, setWebhookUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        if (webhookUrl && (webhookUrl.startsWith("https://discord.com/api/webhooks/") || webhookUrl.startsWith("https://hooks.slack.com/"))) {
            console.log("Saving Webhook URL:", webhookUrl);
            toast({
                title: "Webhook Salvo!",
                description: "Seu webhook foi salvo com sucesso.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "URL Inválida",
                description: "Por favor, insira uma URL de webhook válida (Discord ou Slack).",
            });
        }
        setIsSaving(false);
    };
    
    const handleTestWebhook = async () => {
        if (!webhookUrl || !(webhookUrl.startsWith("https://discord.com/api/webhooks/") || webhookUrl.startsWith("https://hooks.slack.com/"))) {
            toast({
                variant: "destructive",
                title: "URL Inválida",
                description: "Por favor, salve uma URL de webhook válida antes de testar.",
            });
            return;
        }

        setIsTesting(true);

        const testPayload = {
            username: "CloakDash Teste",
            avatar_url: "https://i.imgur.com/4M34hi2.png",
            content: "Se você recebeu esta mensagem, seu webhook está funcionando!",
            embeds: [{
                title: "✅ Notificação de Teste",
                color: 5763719, // Verde
                description: "Esta é uma mensagem de teste do CloakDash para confirmar que sua configuração de webhook está correta.",
                timestamp: new Date().toISOString()
            }]
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testPayload)
            });

            if (response.ok) {
                 toast({
                    title: "Teste Enviado!",
                    description: "A notificação de teste foi enviada com sucesso para o seu webhook.",
                });
            } else {
                throw new Error(`O servidor respondeu com o status ${response.status}`);
            }

        } catch (error) {
            console.error("Webhook test failed:", error);
            toast({
                variant: "destructive",
                title: "Falha no Teste",
                description: "Não foi possível enviar a notificação. Verifique a URL do webhook e as permissões do seu servidor.",
            });
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Webhook className="text-primary"/> Configurar Webhook</CardTitle>
                            <CardDescription>
                                Receba notificações em tempo real no seu servidor do Discord ou canal do Slack sobre eventos importantes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Label htmlFor="webhook-url">URL do Webhook</Label>
                                <Input
                                    id="webhook-url"
                                    type="url"
                                    placeholder="https://discord.com/api/webhooks/..."
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Cole a URL do webhook que você criou no seu servidor do Discord ou workspace do Slack.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Salvar
                            </Button>
                             <Button variant="outline" onClick={handleTestWebhook} disabled={isTesting}>
                                {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Enviar Teste
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Webhook />Como obter a URL do Webhook</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <p className="font-semibold text-foreground">Discord:</p>
                            <div className="flex items-start gap-4">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">1</div>
                                <p>No seu servidor do Discord, vá em <strong>Configurações do Servidor &gt; Integrações</strong>.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">2</div>
                                <p>Clique em <strong>"Criar Webhook"</strong> e depois em <strong>"Copiar URL do Webhook"</strong>.</p>
                            </div>
                            <Separator />
                             <p className="font-semibold text-foreground">Slack:</p>
                             <div className="flex items-start gap-4">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">1</div>
                                <p>Crie um novo App Slack, vá para <strong>"Incoming Webhooks"</strong> e ative-o.</p>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">2</div>
                                <p>Clique em <strong>"Add New Webhook to Workspace"</strong>, escolha um canal e copie a URL.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Exemplo de Payload</CardTitle>
                    <CardDescription>
                        Este é um exemplo do JSON que será enviado para seu webhook quando um IP suspeito for detectado.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CodeBlock text={`{
  "username": "CloakDash Alert",
  "avatar_url": "https://i.imgur.com/4M34hi2.png",
  "embeds": [{
    "title": "🚨 Alerta de Tráfego Suspeito",
    "color": 15158332,
    "fields": [
      { "name": "Rota (Slug)", "value": "/promo-abc", "inline": true },
      { "name": "IP do Visitante", "value": "1.2.3.4", "inline": true },
      { "name": "País", "value": "US", "inline": true },
      { "name": "Motivo", "value": "Sem Referer", "inline": false },
      { "name": "User Agent", "value": "Mozilla/5.0 (...)", "inline": false }
    ],
    "timestamp": "2024-07-31T12:00:00.000Z"
  }]
}`} />
                </CardContent>
            </Card>
        </>
    );
}
