
"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { Loader2, Sparkles, FileText } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { COUNTRIES } from "@/lib/countries";
import { MultiSelect } from "@/components/ui/multi-select";
import { Switch } from "@/components/ui/switch";
import { ROUTE_TEMPLATES } from "@/lib/route-templates";
import { useNewRouteForm } from "@/hooks/use-new-route-form";

export function NewRouteForm() {
  const { form, onSubmit, handleGenerateFakeUrl, isGenerating, applyTemplate, router } = useNewRouteForm();

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        <Input placeholder="promo-abc" {...field} className="rounded-l-none" />
                      </div>
                      <FormDescription>
                        Um identificador único para sua rota.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="realUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Real</FormLabel>
                      <FormControl>
                        <Input placeholder="https://seu-lander-real.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        O destino para tráfego real e de alta qualidade.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Button type="button" variant="outline" onClick={handleGenerateFakeUrl} disabled={isGenerating}>
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
                          Redireciona automaticamente os rastreadores do Facebook (facebookexternalhit, Facebot) para a URL falsa.
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
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="enableEmergency"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Botão de Emergência</FormLabel>
                        <FormDescription>
                          Ative um botão de um clique para forçar todo o tráfego para a URL falsa.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
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
          <Button variant="outline" type="button" onClick={() => router.push('/dashboard')}>Cancelar</Button>
          <Button type="submit">Criar Rota</Button>
        </div>
      </form>
    </FormProvider>
  );
}
