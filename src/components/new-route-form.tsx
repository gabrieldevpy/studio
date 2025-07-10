
"use client";

import { useFieldArray, FormProvider } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import { Separator } from "@/components/ui/separator";
import { useNewRouteForm } from "@/hooks/use-new-route-form";
import { COUNTRIES } from "@/lib/countries";
import { ROUTE_TEMPLATES } from "@/lib/route-templates";
import { Loader2, Trash2, BrainCircuit, Wand2 } from "lucide-react";

export function NewRouteForm({ existingRoute }: { existingRoute?: any }) {
  const isEditMode = !!existingRoute;
  const {
    form,
    onSubmit,
    handleGenerateFakeUrl,
    isGenerating,
    isSubmitting,
    applyTemplate,
    router,
  } = useNewRouteForm(existingRoute);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "realUrls",
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!isEditMode && (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Modelos de Rota</CardTitle>
                    <CardDescription>Comece rapidamente com configurações pré-definidas para plataformas populares.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ROUTE_TEMPLATES.map((template) => (
                            <Button
                                key={template.id}
                                variant="outline"
                                className="h-auto p-4 flex flex-col items-start text-left justify-start"
                                onClick={() => applyTemplate(template)}
                                type="button"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-2xl">{template.icon}</div>
                                    <span className="font-semibold text-base">{template.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Clique para aplicar as configurações para {template.name}.</p>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Configuração Essencial</CardTitle>
                <CardDescription>
                  Defina o endereço da sua rota e para onde os visitantes serão
                  redirecionados.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug da Rota</FormLabel>
                      <div className="flex items-center">
                        <span className="text-muted-foreground bg-muted h-10 px-3 flex items-center rounded-l-md border border-r-0 border-input">
                          cloakdash.com/
                        </span>
                        <Input
                          {...field}
                          placeholder="minha-campanha-secreta"
                          className="rounded-l-none"
                          disabled={isEditMode}
                        />
                      </div>
                      <FormDescription>
                        O identificador único para sua rota.
                        {isEditMode && " Não pode ser alterado."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div>
                  <FormLabel>URL(s) Real(is) (Money Page)</FormLabel>
                  <FormDescription className="mb-4">
                    Para onde os visitantes reais serão enviados. Adicione
                    múltiplas URLs para rotação.
                  </FormDescription>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`realUrls.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <Input {...field} placeholder="https://sua-oferta.com" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {form.watch("smartRotation") && (
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ value: "" })}
                      >
                        Adicionar outra URL
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />
                
                <FormField
                  control={form.control}
                  name="fakeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>URL Falsa (Safe Page)</FormLabel>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateFakeUrl(form.getValues("realUrls.0.value"))}
                            disabled={isGenerating}
                            className="text-primary hover:text-primary"
                        >
                            {isGenerating ? (<Loader2 className="mr-2 h-4 w-4 animate-spin"/>) : (<Wand2 className="mr-2 h-4 w-4" />)}
                            Gerar com IA
                        </Button>
                      </div>
                      <Input
                        {...field}
                        placeholder="https://pagina-segura.com"
                      />
                      <FormDescription>
                        Para onde bots e tráfego indesejado serão enviados.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filtragem e Bloqueio</CardTitle>
                <CardDescription>
                  Defina as regras para bloquear tráfego indesejado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="blockedIps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IPs Bloqueados</FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Um endereço IP por linha. Ex: 1.2.3.4"
                        className="font-code"
                        rows={5}
                      />
                      <FormDescription>
                        Bloqueia visitantes com estes endereços IP.
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
                      <FormLabel>User-Agents Bloqueados</FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Uma palavra-chave de user-agent por linha. Ex: Googlebot"
                        className="font-code"
                        rows={5}
                      />
                      <FormDescription>
                        Bloqueia visitantes se o user-agent contiver qualquer
                        uma destas palavras.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            placeholder="Selecione os países..."
                          />
                          <FormDescription>
                            Se preenchido, apenas visitantes destes países acessarão a URL real.
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
                            placeholder="Selecione os países..."
                          />
                          <FormDescription>
                           Visitantes destes países serão sempre enviados para a URL falsa.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                 <FormField
                  control={form.control}
                  name="blockFacebookBots"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Bloquear Bots do Facebook</FormLabel>
                        <FormDescription>
                          Ativa regras específicas para os crawlers mais comuns
                          do Facebook.
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
                    <CardTitle>Notas da Rota</CardTitle>
                    <CardDescription>Adicione notas ou comentários sobre esta rota para sua referência futura.</CardDescription>
                </CardHeader>
                <CardContent>
                     <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <Textarea {...field} placeholder="Ex: Campanha de Dia das Mães no Facebook, público de interesse em maquiagem..." rows={4} />
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
                <CardTitle>Configurações Padrão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="aiMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Modo IA</FormLabel>
                        <FormDescription>
                          Permite que a IA analise e bloqueie tráfego
                          suspeito.
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Botão de Emergência</FormLabel>
                        <FormDescription>
                          Habilita o botão para forçar todos os visitantes para a
                          URL falsa.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-destructive"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="text-primary" /> Rotação Inteligente
                </CardTitle>
                 <CardDescription>
                  Distribua o tráfego entre múltiplas URLs Reais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <FormField
                  control={form.control}
                  name="smartRotation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel>Ativar Rotação de URLs</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("smartRotation") && (
                   <FormField
                      control={form.control}
                      name="rotationMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modo de Rotação</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o modo"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="sequential">Sequencial</SelectItem>
                                    <SelectItem value="random">Aleatório</SelectItem>
                                </SelectContent>
                           </Select>
                           <FormDescription>
                                Como o tráfego será distribuído entre as URLs.
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Proteções Avançadas</CardTitle>
                 <CardDescription>
                  Recursos adicionais para ofuscar suas páginas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="randomDelay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel>Atraso Aleatório</FormLabel>
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
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel>Rotação de IP</FormLabel>
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
                  name="cdnInjection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel>Injeção de CDN</FormLabel>
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
                  name="honeypot"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel>Página Honeypot</FormLabel>
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

          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Salvar Alterações" : "Criar Rota"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
