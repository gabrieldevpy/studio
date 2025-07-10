
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { generateFakeUrl } from "@/ai/flows/generate-fake-url";
import type { RouteTemplate } from "@/lib/route-templates";

const formSchema = z.object({
  slug: z.string().min(3, "O slug deve ter pelo menos 3 caracteres.").regex(/^[a-zA-Z0-9_-]+$/, "O slug pode conter apenas letras, números, hífens e sublinhados."),
  realUrl: z.string().url("Por favor, insira uma URL válida.").or(z.literal('')),
  fakeUrl: z.string().url("Por favor, insira uma URL válida.").or(z.literal('')),
  blockedIps: z.string().optional(),
  blockedUserAgents: z.string().optional(),
  allowedCountries: z.array(z.string()).optional(),
  blockedCountries: z.array(z.string()).optional(),
  blockFacebookBots: z.boolean().default(true),
  enableEmergency: z.boolean().default(false),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function useNewRouteForm() {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
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

  const applyTemplate = (template: RouteTemplate) => {
    form.reset({
      ...form.getValues(), // preserve existing values not in template
      slug: template.slug,
      blockedIps: template.blockedIps.join('\n'),
      blockedUserAgents: template.blockedUserAgents.join('\n'),
      allowedCountries: template.allowedCountries,
      blockedCountries: [],
      blockFacebookBots: template.blockFacebookBots,
      enableEmergency: template.enableEmergency,
      realUrl: form.getValues('realUrl'), // ensure these are not cleared
      fakeUrl: form.getValues('fakeUrl'),
      notes: form.getValues('notes'),
    });
    
    toast({
      title: `Template "${template.name}" Aplicado`,
      description: "Os campos do formulário foram preenchidos. Revise e complete o restante."
    });
  };

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: "Rota Criada",
      description: "Sua nova rota foi criada com sucesso.",
    });
    router.push("/dashboard");
  }

  return {
    form,
    onSubmit,
    handleGenerateFakeUrl,
    isGenerating,
    applyTemplate,
    router
  };
}
