
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
  realUrls: z.array(z.object({ value: z.string().url("Por favor, insira uma URL válida.") })).min(1, "É necessária pelo menos uma URL real."),
  fakeUrl: z.string().url("Por favor, insira uma URL válida.").or(z.literal('')),
  smartRotation: z.boolean().default(false),
  rotationMode: z.enum(['sequential', 'random']).default('sequential'),
  blockedIps: z.string().optional(),
  blockedUserAgents: z.string().optional(),
  allowedCountries: z.array(z.string()).optional(),
  blockedCountries: z.array(z.string()).optional(),
  blockFacebookBots: z.boolean().default(true),
  aiMode: z.boolean().default(true),
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
      realUrls: [{ value: "" }],
      fakeUrl: "",
      smartRotation: false,
      rotationMode: 'sequential',
      blockedIps: "",
      blockedUserAgents: "",
      allowedCountries: [],
      blockedCountries: [],
      blockFacebookBots: true,
      aiMode: true,
      enableEmergency: true,
      notes: "",
    },
  });

  const handleGenerateFakeUrl = async (realUrl?: string) => {
    if (!realUrl) {
      form.setError("realUrls.0.value", { type: "manual", message: "Por favor, insira uma URL real primeiro." });
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
    const currentValues = form.getValues();
    form.reset({
      ...currentValues,
      slug: template.slug,
      blockedIps: template.blockedIps.join('\n'),
      blockedUserAgents: template.blockedUserAgents.join('\n'),
      allowedCountries: template.allowedCountries,
      blockedCountries: [],
      blockFacebookBots: template.blockFacebookBots,
      aiMode: template.aiMode,
      enableEmergency: template.enableEmergency,
      // Keep URLs if they exist
      realUrls: currentValues.realUrls[0]?.value ? currentValues.realUrls : [{ value: '' }],
      fakeUrl: currentValues.fakeUrl || '',
    });
    
    toast({
      title: `Template "${template.name}" Aplicado`,
      description: "Os campos do formulário foram preenchidos. Revise e complete o restante."
    });
  };


  function onSubmit(values: FormValues) {
    const finalValues = {
        ...values,
        realUrl: values.smartRotation ? values.realUrls.map(url => url.value) : values.realUrls[0].value,
    };
    // remove single-item array properties for cleaner data
    if (!values.smartRotation) {
        // @ts-ignore
        delete finalValues.realUrls;
        // @ts-ignore
        finalValues.realUrl = finalValues.realUrl[0] || '';
    }

    console.log("Submitting:", finalValues);
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
