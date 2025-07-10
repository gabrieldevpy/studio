
"use client";

import React, { useState } from "react";
import { FormProvider, useFieldArray } from "react-hook-form";
import { Loader2, Sparkles, FileText, Trash, PlusCircle, RotateCw, BrainCircuit, ShieldAlert, Timer, DatabaseZap, Code, MousePointerClick } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES } from "@/lib/countries";
import { MultiSelect } from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import { ROUTE_TEMPLATES } from "@/lib/route-templates";
import { useNewRouteForm } from "@/hooks/use-new-route-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const CodeBlock = ({ text }: { text: string }) => (
    <pre className="mt-2 rounded-md bg-muted p-4 font-code text-sm text-muted-foreground overflow-x-auto">
        <code>{text}</code>
    </pre>
);

export function NewRouteForm({ existingRoute }: { existingRoute?: any }) {
  const { form, onSubmit, handleGenerateFakeUrl, isGenerating, isSubmitting, applyTemplate, router } = useNewRouteForm(existingRoute);
  
  const [showIpRotationModal, setShowIpRotationModal] = useState(false);
  const [showCdnInjectionModal, setShowCdnInjectionModal] = useState(false);
  const [showHoneypotModal, setShowHoneypotModal] = useState(false);
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "realUrls",
  });
  
  const isEditMode = !!existingRoute;

  const handleSwitchChange = (field: "ipRotation" | "cdnInjection" | "honeypot", checked: boolean) => {
    if (!checked) {
        form.setValue(field, false);
        return;
    }
    if (field === 'ipRotation') setShowIpRotationModal(true);
    if (field === 'cdnInjection') setShowCdnInjectionModal(true);
    if (field === 'honeypot') setShowHoneypotModal(true);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!isEditMode && (
            <Card className="mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="text-primary"/> Usar um Template</CardTitle>
                <CardDescription>Comece rapidamente com configurações pré-definidas para as plataformas de anúncio mais populares.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ROUTE_TEMPLATES.map((template) => (
                <Button key={template.id} variant="outline" type="button" className="justify-start gap-3 h-12 text-base" onClick={() => applyTemplate(template)}>
                    {template.icon}
                    {template.name}
                </Button>
                ))}
            </CardContent>
            </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Rota</CardTitle>
                <CardDescription>
                  Defina a lógica de redirecionamento principal para sua rota.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug da Rota</FormLabel>
                      <div className="flex items-center">
                        <span className="p-2 rounded-l-md bg-muted text-muted-foreground text-sm">cloakdash.com/cloak/</span>
                        <Input placeholder="promo-abc" {...field} className="rounded-l-none" disabled={isEditMode}/>
                      </div>
                      <FormDescription>
                        Um identificador único para sua rota. {isEditMode && 'Não pode ser alterado após a criação.'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {/* Smart Rotation URLs Reais */}
                 <div className="space-y-4 rounded-md border p-4">
                    <FormField
                      control={form.control}
                      name="smartRotation"
                      render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <RotateCw className="h-4 w-4 text-primary" />
                                Modo "Smart Rotation"
                              </FormLabel>
                              <FormDescription>
                                Rotacione múltiplas URLs Reais para distribuir o tráfego.
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
                    
                    <div className={cn("space-y-4", !form.watch('smartRotation') && "hidden")}>
                      <FormField
                          control={form.control}
                          name="rotationMode"
                          render={({ field }) => (
                              <FormItem>
                                <FormLabel>Modo de Rotação</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o modo de rotação" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="sequential">Sequencial</SelectItem>
                                    <SelectItem value="random">Aleatório</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Como as URLs serão escolhidas a cada novo visitante.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>
                  
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`realUrls.${index}.value`}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel className={cn(index !== 0 && "sr-only")}>
                           {form.watch('smartRotation') ? `URL Real #${index + 1}` : 'URL Real'}
                          </FormLabel>
                          <div className="flex items-center gap-2">
                            <Input {...formField} placeholder="https://seu-lander-real.com" />
                            {form.watch('smartRotation') && fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  {form.watch('smartRotation') && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ value: "" })}
                      className="mt-2"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Adicionar outra URL Real
                    </Button>
                  )}
                   {!form.watch('smartRotation') && (
                     <FormDescription>
                        O destino para tráfego real e de alta qualidade.
                      </FormDescription>
                   )}
                </div>

                <FormField
                  control={form.control}
                  name="fakeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Falsa</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="https://uma-pagina-segura.com" {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" onClick={() => handleGenerateFakeUrl(form.getValues("realUrls")[0]?.value || '')} disabled={isGenerating}>
                          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4 text-primary" />}
                          <span className="ml-2 hidden md:inline">Gerar com IA</span>
                        </Button>
                      </div>
                      <FormDescription>
                        O destino para bots e tráfego indesejado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Listas de Bloqueio</CardTitle>
                <CardDescription>
                  Bloqueie IPs e User-Agents específicos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="blockFacebookBots"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Bloquear Bots do Facebook</FormLabel>
                        <FormDescription>
                          Redireciona automaticamente os rastreadores do Facebook para a URL falsa.
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
                  name="blockedIps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IPs Bloqueados</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123.45.67.89
192.168.1.0/24" className="min-h-32 font-code" {...field} />
                      </FormControl>
                      <FormDescription>
                        Insira um endereço IP ou intervalo CIDR por linha.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blockedUserAgents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User-Agents Bloqueados (Adicionais)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="GoogleBot
AhrefsBot" className="min-h-32 font-code" {...field} />
                      </FormControl>
                      <FormDescription>
                        Insira uma string de User-Agent por linha (correspondências parciais são suportadas).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                  <CardDescription>
                    Adicione notas internas para esta rota. Elas não serão visíveis publicamente.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suas Notas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Campanha de dia dos pais no Facebook, otimizada para..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Geo-Targeting</CardTitle>
                <CardDescription>
                  Filtre o tráfego com base no país.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <FormField
                  control={form.control}
                  name="allowedCountries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Países Permitidos</FormLabel>
                      <MultiSelect
                        options={COUNTRIES}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Selecione países..."
                        className="w-full"
                      />
                      <FormDescription>
                        Permitir tráfego apenas desses países. Deixe em branco para permitir todos.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blockedCountries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Países Bloqueados</FormLabel>
                      <MultiSelect
                        options={COUNTRIES}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Selecione países..."
                        className="w-full"
                      />
                      <FormDescription>
                        Bloquear tráfego desses países.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Configurações Padrão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                 <FormField
                  control={form.control}
                  name="aiMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <BrainCircuit className="h-4 w-4 text-primary" />
                          Modo IA
                        </FormLabel>
                        <FormDescription>
                          Permitir que a IA aprenda e sugira novas regras.
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
                  name="enableEmergency"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Botão de Emergência</FormLabel>
                        <FormDescription>
                          Habilitar botão para forçar a URL falsa.
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
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Proteções Avançadas</CardTitle>
                 <CardDescription>
                  Adicione camadas extras de segurança para enganar bots sofisticados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <FormField
                  control={form.control}
                  name="randomDelay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2"><Timer className="h-4 w-4 text-primary"/>Delay Aleatório</FormLabel>
                        <FormDescription>
                           Aplica um atraso de 600-2200ms antes do redirecionamento final.
                        </FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="ipRotation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2"><DatabaseZap className="h-4 w-4 text-primary"/>IP Rotation Redirect</FormLabel>
                        <FormDescription>
                            Redireciona IPs com alta frequência de acesso. Requer setup externo.
                        </FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={(checked) => handleSwitchChange('ipRotation', checked)} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cdnInjection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2"><Code className="h-4 w-4 text-primary"/>CDN-Injection Fake</FormLabel>
                        <FormDescription>
                            Simula que sua página está em um CDN. Requer setup na sua URL Real.
                        </FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={(checked) => handleSwitchChange('cdnInjection', checked)} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="honeypot"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2"><MousePointerClick className="h-4 w-4 text-primary"/>Honeypot Invisível</FormLabel>
                        <FormDescription>
                            Cria uma "armadilha" para bots na sua página. Requer setup na URL Real.
                        </FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={(checked) => handleSwitchChange('honeypot', checked)} /></FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.push('/dashboard')} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             {isSubmitting ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Rota')}
          </Button>
        </div>
      </form>
       {/* IP Rotation Modal */}
       <Dialog open={showIpRotationModal} onOpenChange={setShowIpRotationModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Como Ativar o IP Rotation Redirect</DialogTitle>
                    <DialogDescription>
                        Esta funcionalidade requer uma configuração externa para funcionar.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                    <p>O IP Rotation precisa de um banco de dados de cache rápido (como <span className="font-semibold">Redis</span> ou <span className="font-semibold">Memcached</span>) para rastrear a frequência de acesso de cada IP em tempo real.</p>
                    <p className="font-semibold">Passos para configurar:</p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Configure uma instância do Redis acessível pela sua aplicação.</li>
                        <li>No arquivo <code className="font-code text-primary">/src/app/cloak/[slug]/route.ts</code>, descomente o pseudo-código e adicione sua lógica de conexão com o Redis para incrementar e verificar o contador de acessos do IP.</li>
                    </ol>
                    <p>Ativar esta opção apenas salva a preferência no banco de dados. A lógica de bloqueio precisa ser implementada por você no back-end.</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button onClick={() => {
                        form.setValue('ipRotation', true);
                        setShowIpRotationModal(false);
                    }}>Entendi, Ativar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* CDN Injection Modal */}
        <Dialog open={showCdnInjectionModal} onOpenChange={setShowCdnInjectionModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Como Ativar o CDN-Injection Fake</DialogTitle>
                    <DialogDescription>
                        Esta funcionalidade deve ser implementada na sua URL Real.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                    <p>A "Injeção de CDN" é uma técnica para fazer sua página de destino (URL Real) parecer mais legítima, simulando que seus scripts são carregados de um CDN conhecido.</p>
                     <p className="font-semibold">Como implementar:</p>
                     <ol className="list-decimal list-inside space-y-2">
                        <li>No código HTML da sua <span className="font-semibold">URL Real</span>, adicione um script que carrega dinamicamente seu script principal.</li>
                        <li>Use um nome de arquivo que pareça vir de um CDN, por exemplo:</li>
                    </ol>
                     <CodeBlock text={`<script src="https://cdn.your-domain.com/assets/main.js"></script>`} />
                    <p>Ativar esta opção no painel serve como um lembrete para você implementar esta técnica. Não há alteração automática no comportamento do redirecionamento.</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button onClick={() => {
                        form.setValue('cdnInjection', true);
                        setShowCdnInjectionModal(false);
                    }}>Entendi, Ativar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Honeypot Modal */}
        <Dialog open={showHoneypotModal} onOpenChange={setShowHoneypotModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Como Ativar o Honeypot Invisível</DialogTitle>
                    <DialogDescription>
                        Esta funcionalidade deve ser implementada na sua URL Real.
                    </DialogDescription>
                </DialogHeader>
                 <div className="space-y-4 text-sm">
                    <p>Um "Honeypot" (pote de mel) é uma armadilha para bots. Adicionamos um link ou botão invisível na página que apenas bots (que analisam o código-fonte) conseguiriam "ver" e clicar.</p>
                     <p className="font-semibold">Como implementar:</p>
                     <ol className="list-decimal list-inside space-y-2">
                        <li>Adicione o seguinte código HTML no `<body>` da sua <span className="font-semibold">URL Real</span>:</li>
                    </ol>
                     <CodeBlock text={`<div style="opacity: 0; position: absolute; top: 0; left: 0; height: 1px; width: 1px; z-index: -1;">\n  <a href="https://example.com/bot-trap">Não clique aqui</a>\n</div>`} />
                    <p>
                        2. Crie uma regra no servidor ou na sua aplicação para banir qualquer visitante que acesse a URL <code className="font-code text-primary">/bot-trap</code>.
                    </p>
                    <p>Ativar esta opção no painel serve como um lembrete para você implementar esta técnica.</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button onClick={() => {
                        form.setValue('honeypot', true);
                        setShowHoneypotModal(false);
                    }}>Entendi, Ativar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </FormProvider>
  );
}

    