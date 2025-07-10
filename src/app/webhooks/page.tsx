
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Check, Clipboard, Discord, Webhook } from "lucide-react";
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

export default function WebhooksPage() {
    const [webhookUrl, setWebhookUrl] = useState("");

    const handleSave = () => {
        if (webhookUrl && webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
            // Here you would save the webhookUrl to your database
            console.log("Saving Webhook URL:", webhookUrl);
            toast({
                title: "Webhook Salvo!",
                description: "Seu webhook do Discord foi salvo com sucesso.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "URL Inválida",
                description: "Por favor, insira uma URL de webhook do Discord válida.",
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold">Webhooks</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Webhook className="text-primary"/> Configurar Webhook do Discord</CardTitle>
                            <CardDescription>
                                Receba notificações em tempo real no seu servidor do Discord sobre eventos importantes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Label htmlFor="webhook-url">URL do Webhook do Discord</Label>
                                <Input
                                    id="webhook-url"
                                    type="url"
                                    placeholder="https://discord.com/api/webhooks/..."
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Cole a URL do webhook que você criou no seu servidor do Discord.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSave}>Salvar Webhook</Button>
                        </CardFooter>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Discord />Como obter a URL do Webhook</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">1</div>
                                <p>No seu servidor do Discord, vá em <strong>Configurações do Servidor &gt; Integrações</strong>.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">2</div>
                                <p>Clique em <strong>"Criar Webhook"</strong> (ou "Ver Webhooks" se já tiver algum).</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">3</div>
                                <p>Clique no webhook recém-criado (ex: "Capitão Gancho") e depois em <strong>"Copiar URL do Webhook"</strong>.</p>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">4</div>
                                <p>Cole a URL no campo à esquerda e salve.</p>
                            </div>
                            <Separator className="my-4"/>
                            <p className="text-xs text-muted-foreground">
                                Você receberá notificações para IPs suspeitos e quando o modo de emergência for ativado.
                            </p>
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
        </DashboardLayout>
    );
}
