
"use client";

import { Bot, Clipboard, Check, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import withAuth from "@/components/with-auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CodeBlock = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative font-code bg-muted p-4 rounded-md text-sm text-muted-foreground mt-2">
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

const ExternalLinkChip = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        <Badge variant="secondary" className="hover:bg-muted-foreground/20 transition-colors">
            {children} <ExternalLink className="h-3 w-3 ml-1.5" />
        </Badge>
    </a>
)

function BotWikiPage() {
  const regexExample = `/(facebookexternalhit|Facebot|Googlebot|Googlebot-Image|Googlebot-Video|AdsBot-Google|bingbot|Bytespider|GPTBot|ClaudeBot|Perplexity-User)/i`;

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Bot className="h-8 w-8 text-primary"/> Bot Wiki & Central de Inteligência</h1>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Central de Referência de Bots</CardTitle>
            <CardDescription>
              Use esta página como referência para identificar e bloquear os bots mais comuns que podem interferir em suas campanhas.
            </CardDescription>
          </CardHeader>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-semibold">1. Facebook Bots</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 text-base">
              <p className="text-muted-foreground">Principais User-Agents declarados oficialmente:</p>
              <ul className="list-disc list-inside space-y-2 font-code bg-muted/50 p-4 rounded-lg">
                <li>facebookexternalhit/*</li>
                <li>Facebot</li>
              </ul>
              <div className="space-x-2">
                <ExternalLinkChip href="https://developers.facebook.com/docs/sharing/webmasters/crawler/">Desenvolvedores do Facebook</ExternalLinkChip>
                <ExternalLinkChip href="https://en.wikipedia.org/wiki/Facebot">Wikipedia</ExternalLinkChip>
              </div>
              <p className="text-muted-foreground">Você também pode encontrar centenas de variantes navegando em repositórios como:</p>
              <ExternalLinkChip href="https://explore.whatismybrowser.com/useragents/bots/facebook-bot">explore.whatismybrowser.com</ExternalLinkChip>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-semibold">2. Google Bots (Search & Ads)</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 text-base">
              <p className="text-muted-foreground">User-Agents comuns:</p>
              <ul className="list-disc list-inside space-y-2 font-code bg-muted/50 p-4 rounded-lg">
                <li><span className="font-semibold">Desktop:</span> Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)</li>
                <li><span className="font-semibold">Imagem:</span> Googlebot-Image/1.0</li>
                <li><span className="font-semibold">Vídeo:</span> Googlebot-Video/1.0</li>
                <li><span className="font-semibold">Notícias:</span> Googlebot-News</li>
                <li><span className="font-semibold">Ads:</span> AdsBot-Google, AdsBot-Google-Mobile</li>
                <li><span className="font-semibold">Outros:</span> Mediapartners-Google, APIs-Google, Feedfetcher-Google, Google-InspectionTool, GoogleOther, Google-CloudVertexBot</li>
              </ul>
               <p className="text-muted-foreground">O Google publica uma lista de faixas de IP verificadas para o Googlebot em um JSON oficial.</p>
                <ExternalLinkChip href="https://developers.google.com/search/docs/crawling-indexing/googlebot">Google for Developers</ExternalLinkChip>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-semibold">3. TikTok / ByteDance Bots</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 text-base">
                <p className="text-muted-foreground">User-Agents identificados:</p>
                <ul className="list-disc list-inside space-y-2 font-code bg-muted/50 p-4 rounded-lg">
                    <li>Bytespider</li>
                    <li>TikTokBot</li>
                    <li>AdsBot-TikTok</li>
                    <li>Mozilla/5.0 (compatible; TikTokBot/1.0; +http://www.tiktok.com/bot.html)</li>
                </ul>
                <p className="text-muted-foreground">Detecção adicional sugerida: tráfego originário de data centers na China/Singapura pode sinalizar bots ByteDance.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl font-semibold">4. Outros Bots Relevantes</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 text-base">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="font-semibold text-foreground">Bing:</p>
                    <ul className="list-disc list-inside font-code bg-muted/50 p-3 rounded-lg text-sm"><li>bingbot</li><li>adidxbot/2.0</li></ul>
                </div>
                <div className="space-y-2">
                    <p className="font-semibold text-foreground">Ahrefs:</p>
                    <ul className="list-disc list-inside font-code bg-muted/50 p-3 rounded-lg text-sm"><li>AhrefsBot</li></ul>
                    <p className="text-xs text-muted-foreground">Consulte o JSON de IPs no site da Ahrefs.</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <p className="font-semibold text-foreground">AI Crawlers:</p>
                    <ul className="list-disc list-inside font-code bg-muted/50 p-3 rounded-lg text-sm">
                        <li>GPTBot</li>
                        <li>MistralAI</li>
                        <li>ClaudeBot</li>
                        <li>Perplexity-User</li>
                    </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

         <Card>
          <CardHeader>
            <CardTitle>Como Usar no Cloaker</CardTitle>
            <CardDescription>
              Recomendações práticas para aplicar essas informações nas suas regras de bloqueio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Bloqueio por User-Agent (Regex)</h3>
                <p className="text-muted-foreground text-sm mb-2">Adicione esta expressão regular no campo "User-Agents Bloqueados" para pegar os bots mais comuns de uma só vez.</p>
                <CodeBlock text={regexExample} />
            </div>
             <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Bloqueio por Faixas de IP</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li>Baixe e copie os IPs do JSON oficial do Google para o campo "IPs Bloqueados".</li>
                    <li>Faça o mesmo para os IPs da Ahrefs, se desejar bloquear bots de SEO.</li>
                    <li>Monitore logs e adicione manualmente faixas de IP suspeitas, especialmente de data centers conhecidos.</li>
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Estratégia Combinada</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li>Se o User-Agent corresponde a um bot conhecido, redirecione para a URL falsa.</li>
                    <li>Se o IP pertence a uma faixa de data center conhecida, mesmo com um User-Agent genérico, considere-o suspeito.</li>
                    <li>Use a opção "Bloquear Bots do Facebook" para um bloqueio fácil e eficaz dos crawlers da Meta.</li>
                </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}

export default withAuth(BotWikiPage);
