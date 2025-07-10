
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardLayout } from "@/components/dashboard-layout";
import { COUNTRIES } from "@/lib/countries";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "@/hooks/use-toast";
import React from "react";
import { generateFakeUrl } from "@/ai/flows/generate-fake-url";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  slug: z.string().min(3, "O slug deve ter pelo menos 3 caracteres.").regex(/^[a-zA-Z0-9_-]+$/, "O slug pode conter apenas letras, números, hífens e sublinhados."),
  realUrl: z.string().url("Por favor, insira uma URL válida."),
  fakeUrl: z.string().url("Por favor, insira uma URL válida."),
  blockedIps: z.string().optional(),
  blockedUserAgents: z.string().optional(),
  allowedCountries: z.array(z.string()).optional(),
  blockedCountries: z.array(z.string()).optional(),
  blockFacebookBots: z.boolean().default(true),
  enableEmergency: z.boolean().default(false),
  notes: z.string().optional(),
});

export default function NewRoutePage() {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      realUrl: "",
      fakeUrl: "",
      blockedIps: "",
      blockedUserAgents: "",
      allowedCountries: [],
      blockedCountries: [],
      blockFacebookBots: true,
      enableEmergency: true,
      notes: "",
    },
  });

  const handleGenerateFakeUrl = async () => {
    const realUrl = form.getValues("realUrl");
    if (!realUrl) {
      form.setError("realUrl", { type: "manual", message: "Por favor, insira uma URL real primeiro." });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateFakeUrl({ realUrl });
      if (result.fakeUrl) {
        form.setValue("fakeUrl", result.fakeUrl, { shouldValidate: true });
        toast({ title: "Sucesso", description: "URL falsa gerada com sucesso." });
      } else {
        throw new Error("Nenhuma URL retornada");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar uma URL falsa. Por favor, tente novamente ou insira uma manualmente.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Rota Criada",
      description: "Sua nova rota foi criada com sucesso.",
    });
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Criar Nova Rota
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          <Textarea placeholder="123.45.67.89&#10;192.168.1.0/24" className="min-h-32 font-code" {...field} />
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
                          <Textarea placeholder="GoogleBot&#10;AhrefsBot" className="min-h-32 font-code" {...field} />
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
            <Button variant="outline" asChild><Link href="/dashboard">Cancelar</Link></Button>
            <Button type="submit">Criar Rota</Button>
          </div>
        </form>
      </Form>
    </DashboardLayout>
  );
}
