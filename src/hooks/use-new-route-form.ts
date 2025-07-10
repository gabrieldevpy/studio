
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { generateFakeUrl } from "@/ai/flows/generate-fake-url";
import type { RouteTemplate } from "@/lib/route-templates";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";


const formSchema = z.object({
  slug: z.string().min(3, "O slug deve ter pelo menos 3 caracteres.").regex(/^[a-zA-Z0-9_-]+$/, "O slug pode conter apenas letras, números, hífens e sublinhados."),
  realUrls: z.array(z.object({ value: z.string().url("Por favor, insira uma URL válida.") })).min(1, "É necessária pelo menos uma URL real."),
  fakeUrl: z.string().url("Por favor, insira uma URL válida.").or(z.literal('')),
  notes: z.string().optional(),
  // Standard Settings
  smartRotation: z.boolean().default(false),
  rotationMode: z.enum(['sequential', 'random']).default('sequential'),
  blockedIps: z.string().optional(),
  blockedUserAgents: z.string().optional(),
  allowedCountries: z.array(z.string()).optional(),
  blockedCountries: z.array(z.string()).optional(),
  blockFacebookBots: z.boolean().default(true),
  // Default Settings
  aiMode: z.boolean().default(true),
  enableEmergency: z.boolean().default(false),
  // Advanced Protections
  ipRotation: z.boolean().default(false),
  randomDelay: z.boolean().default(false),
  cdnInjection: z.boolean().default(false),
  honeypot: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function useNewRouteForm(existingRoute?: any) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const isEditMode = !!existingRoute;

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
      ipRotation: false,
      randomDelay: false,
      cdnInjection: false,
      honeypot: false,
    },
  });

  useEffect(() => {
    if (isEditMode && existingRoute) {
      let realUrls;
      if (existingRoute.smartRotation && Array.isArray(existingRoute.realUrl)) {
        realUrls = existingRoute.realUrl.map((url: string) => ({ value: url }));
      } else {
        realUrls = [{ value: existingRoute.realUrl }];
      }

      form.reset({
        slug: existingRoute.slug,
        realUrls: realUrls,
        fakeUrl: existingRoute.fakeUrl || "",
        smartRotation: existingRoute.smartRotation || false,
        rotationMode: existingRoute.rotationMode || 'sequential',
        blockedIps: Array.isArray(existingRoute.blockedIps) ? existingRoute.blockedIps.join('\n') : "",
        blockedUserAgents: Array.isArray(existingRoute.blockedUserAgents) ? existingRoute.blockedUserAgents.join('\n') : "",
        allowedCountries: existingRoute.allowedCountries || [],
        blockedCountries: existingRoute.blockedCountries || [],
        blockFacebookBots: existingRoute.blockFacebookBots ?? true,
        aiMode: existingRoute.aiMode ?? true,
        enableEmergency: existingRoute.enableEmergency ?? false,
        notes: existingRoute.notes || "",
        ipRotation: existingRoute.ipRotation || false,
        randomDelay: existingRoute.randomDelay || false,
        cdnInjection: existingRoute.cdnInjection || false,
        honeypot: existingRoute.honeypot || false,
      });
    }
  }, [isEditMode, existingRoute, form]);


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


  async function onSubmit(values: FormValues) {
    if (!user) {
      toast({ variant: "destructive", title: "Erro", description: "Você precisa estar logado para criar uma rota." });
      return;
    }

    setIsSubmitting(true);
    
    const finalValues = {
      ...values,
      userId: user.uid,
      realUrl: values.smartRotation ? values.realUrls.map(url => url.value) : values.realUrls[0].value,
      // Split textareas into arrays
      blockedIps: values.blockedIps?.split('\n').filter(ip => ip.trim() !== '') || [],
      blockedUserAgents: values.blockedUserAgents?.split('\n').filter(ua => ua.trim() !== '') || [],
    };
    
    if (!values.smartRotation) {
        // @ts-ignore
        delete finalValues.realUrls;
    }

    try {
        if (isEditMode) {
            const routeRef = doc(db, "routes", existingRoute.id);
            await updateDoc(routeRef, finalValues);
            toast({
                title: "Rota Atualizada!",
                description: "Suas alterações foram salvas com sucesso.",
            });
        } else {
            await addDoc(collection(db, "routes"), { ...finalValues, createdAt: new Date() });
            toast({
                title: "Rota Criada!",
                description: "Sua nova rota foi salva e está pronta para uso.",
            });
        }
        router.push("/dashboard");
    } catch (error) {
      console.error("Error saving route: ", error);
      toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Não foi possível salvar a rota. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    onSubmit,
    handleGenerateFakeUrl,
    isGenerating,
    isSubmitting,
    applyTemplate,
    router
  };
}
