
"use client";

import React from "react";
import { useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { COUNTRIES } from "@/lib/countries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ROUTE_TEMPLATES } from "@/lib/route-templates";
import { useNewRouteForm } from "@/hooks/use-new-route-form";
import { BrainCircuit, Loader2, Info, Plus, Trash2 } from "lucide-react";

export function NewRouteForm({ existingRoute }: { existingRoute?: any }) {
    const { form, onSubmit, isSubmitting, isGenerating, handleGenerateFakeUrl, applyTemplate, router } = useNewRouteForm(existingRoute);
    const isEditMode = !!existingRoute;

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "realUrls",
    });
    
    const smartRotationEnabled = form.watch('smartRotation');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {!isEditMode && (
                    <Card className="mb-8" id="tour-step-5">
                        <CardHeader>
                            <CardTitle>Modelos de Rota</CardTitle>
                            <CardDescription>Comece rapidamente com configurações pré-definidas para plataformas populares.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            {ROUTE_TEMPLATES.map((template) => (
                                <Button key={template.id} variant="outline" type="button" onClick={() => applyTemplate(template)}>
                                    {template.icon}
                                    <span className="ml-2">{template.name}</span>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configurações Principais</CardTitle>
                                <CardDescription>Defina os redirecionamentos e o identificador único da sua rota.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug da Rota</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <span className="text-muted-foreground p-2 rounded-l-md border border-r-0 bg-muted">
                                                        cloak.dash/
                                                    </span>
                                                    <Input placeholder="promo-verao" {...field} className="rounded-l-none" />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Identificador único na URL. Use apenas letras, números, - e _.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="smartRotation"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Rotação Inteligente de URLs</FormLabel>
                                                <FormDescription>
                                                    Use múltiplas URLs reais para dividir o tráfego.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        if (!checked && fields.length > 1) {
                                                            // If turning off, keep only the first URL
                                                            form.setValue('realUrls', [fields[0]]);
                                                        }
                                                        field.onChange(checked);
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                
                                {fields.map((field, index) => (
                                  <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`realUrls.${index}.value`}
                                    render={({ field: fieldProps }) => (
                                      <FormItem>
                                        <FormLabel>URL Real {smartRotationEnabled && fields.length > 1 ? `#${index + 1}` : ''}</FormLabel>
                                         <FormControl>
                                            <div className="flex items-center gap-2">
                                                <Input placeholder="https://seu-produto.com/pagina-de-vendas" {...fieldProps} />
                                                {smartRotationEnabled && fields.length > 1 && (
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                ))}

                                {smartRotationEnabled && (
                                    <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
                                        <Plus className="mr-2 h-4 w-4" /> Adicionar outra URL Real
                                    </Button>
                                )}

                                <FormField
                                    control={form.control}
                                    name="fakeUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL Falsa (Safe Page)</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <Input placeholder="https://google.com" {...field} />
                                                    <Button type="button" variant="outline" onClick={() => handleGenerateFakeUrl(form.getValues("realUrls.0.value"))} disabled={isGenerating}>
                                                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                                                        <span className="hidden md:inline ml-2">Gerar com IA</span>
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormDescription>Para onde bots e tráfego indesejado serão enviados.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Filtros e Regras</CardTitle>
                                <CardDescription>Controle quem vê sua URL Real com filtros detalhados.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="multiple" className="w-full space-y-4">
                                    <AccordionItem value="item-1" className="border rounded-lg px-4">
                                        <AccordionTrigger className="hover:no-underline">Bloqueio de IP e User-Agent</AccordionTrigger>
                                        <AccordionContent className="pt-4 space-y-4">
                                            <FormField control={form.control} name="blockedIps" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>IPs Bloqueados</FormLabel>
                                                    <FormControl><Textarea placeholder="192.168.1.1&#10;10.0.0.0/8" className="font-code" {...field} /></FormControl>
                                                    <FormDescription>Um IP ou bloco CIDR por linha.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="blockedUserAgents" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>User-Agents Bloqueados</FormLabel>
                                                    <FormControl><Textarea placeholder="GoogleBot&#10;AhrefsBot" className="font-code" {...field} /></FormControl>
                                                    <FormDescription>Uma string de User-Agent por linha (case-insensitive).</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="item-2" className="border rounded-lg px-4">
                                        <AccordionTrigger className="hover:no-underline">Filtro Geográfico</AccordionTrigger>
                                        <AccordionContent className="pt-4 space-y-4">
                                            <FormField control={form.control} name="allowedCountries" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Países Permitidos</FormLabel>
                                                    <FormControl>
                                                        <MultiSelect options={COUNTRIES} selected={field.value || []} onChange={field.onChange} placeholder="Deixe em branco para permitir todos" />
                                                    </FormControl>
                                                    <FormDescription>Se preenchido, apenas tráfego desses países verá a URL Real.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="blockedCountries" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Países Bloqueados</FormLabel>
                                                    <FormControl>
                                                        <MultiSelect options={COUNTRIES} selected={field.value || []} onChange={field.onChange} placeholder="Selecione os países para bloquear" />
                                                    </FormControl>
                                                    <FormDescription>Tráfego desses países sempre verá a URL Falsa.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                        
                         <Card>
                            <CardHeader>
                                <CardTitle>Proteções Avançadas</CardTitle>
                                <CardDescription>Recursos adicionais para maximizar a segurança e a eficácia do cloaking.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="randomDelay"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Atraso Aleatório</FormLabel>
                                                <FormDescription>
                                                    Adiciona um pequeno atraso variável para usuários reais, simulando um carregamento natural.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ipRotation"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Bloqueio por Rotação de IP</FormLabel>
                                                <FormDescription>
                                                    Bloqueia IPs que fazem muitas requisições em um curto período.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                 <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Configuração Externa Necessária</AlertTitle>
                                    <AlertDescription>
                                        As opções a seguir requerem que você adicione scripts específicos nas suas páginas de destino.
                                    </AlertDescription>
                                </Alert>
                                 <FormField
                                    control={form.control}
                                    name="cdnInjection"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Injeção de CDN</FormLabel>
                                                <FormDescription>
                                                   Carrega scripts e estilos via CDN para dificultar a detecção.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {form.watch('cdnInjection') && (
                                     <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
                                        <p className="font-bold">Como configurar:</p>
                                        <p>1. Substitua os links locais de CSS e JS na sua URL Real por links de uma CDN como a JSDelivr ou a Unpkg.</p>
                                        <p>2. Exemplo: <code>&lt;link href="style.css"&gt;</code> vira <code>&lt;link href="https://cdn.jsdelivr.net/gh/user/repo/style.css"&gt;</code>.</p>
                                    </div>
                                )}
                                <FormField
                                    control={form.control}
                                    name="honeypot"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Página Honeypot</FormLabel>
                                                <FormDescription>
                                                   Cria links invisíveis na sua URL Real. Se um bot clicar, seu IP é banido.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {form.watch('honeypot') && (
                                     <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
                                        <p className="font-bold">Como configurar:</p>
                                        <p>Adicione este trecho HTML na sua URL Real, de preferência perto do rodapé:</p>
                                        <pre className="mt-2 p-2 bg-background rounded text-foreground font-code text-[10px]"><code>
                                            &lt;div style="display:none"&gt;<br/>
                                            &nbsp;&nbsp;&lt;a href="/promo-tos"&gt;Termos&lt;/a&gt;<br/>
                                            &nbsp;&nbsp;&lt;a href="/promo-privacy"&gt;Privacidade&lt;/a&gt;<br/>
                                            &lt;/div&gt;
                                        </code></pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>

                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configurações Gerais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="blockFacebookBots"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Bloquear Bots do Facebook</FormLabel>
                                                <FormDescription>Regra otimizada para bloquear crawlers comuns do Facebook/Meta.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="aiMode"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Modo IA Ativado</FormLabel>
                                                <FormDescription>Permite que nossa IA aprenda com o tráfego e sugira novos bloqueios.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="enableEmergency"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Habilitar Botão de Emergência</FormLabel>
                                                <FormDescription>Adiciona um botão no dashboard para forçar todo o tráfego para a URL Falsa.</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Notas Internas</CardTitle>
                                <CardDescription>Adicione anotações sobre esta rota para seu próprio controle.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea placeholder="Ex: Campanha de Dia das Mães no Facebook, público de 25-45 anos..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? "Salvar Alterações" : "Criar Rota"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
