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

const formSchema = z.object({
  slug: z.string().min(3, "Slug must be at least 3 characters.").regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores."),
  realUrl: z.string().url("Please enter a valid URL."),
  fakeUrl: z.string().url("Please enter a valid URL."),
  blockedIps: z.string().optional(),
  blockedUserAgents: z.string().optional(),
  allowedCountries: z.array(z.string()).optional(),
  blockedCountries: z.array(z.string()).optional(),
  enableEmergency: z.boolean().default(false),
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
      enableEmergency: true,
    },
  });

  const handleGenerateFakeUrl = async () => {
    const realUrl = form.getValues("realUrl");
    if (!realUrl) {
      form.setError("realUrl", { type: "manual", message: "Please enter a real URL first." });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateFakeUrl({ realUrl });
      if (result.fakeUrl) {
        form.setValue("fakeUrl", result.fakeUrl, { shouldValidate: true });
        toast({ title: "Success", description: "Fake URL generated successfully." });
      } else {
        throw new Error("No URL returned");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate a fake URL. Please try again or enter one manually.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Route Created",
      description: "Your new route has been created successfully.",
    });
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Create New Route
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Route Details</CardTitle>
                  <CardDescription>
                    Define the core redirection logic for your route.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Slug</FormLabel>
                        <div className="flex items-center">
                          <span className="p-2 rounded-l-md bg-muted text-muted-foreground text-sm">cloakdash.com/cloak/</span>
                          <Input placeholder="promo-abc" {...field} className="rounded-l-none" />
                        </div>
                        <FormDescription>
                          A unique identifier for your route.
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
                        <FormLabel>Real URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-real-lander.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          The destination for real, high-quality traffic.
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
                        <FormLabel>Fake URL</FormLabel>
                        <div className="flex gap-2">
                           <FormControl>
                            <Input placeholder="https://a-safe-page.com" {...field} />
                           </FormControl>
                           <Button type="button" variant="outline" onClick={handleGenerateFakeUrl} disabled={isGenerating}>
                             {isGenerating ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4 text-primary" />}
                             <span className="ml-2 hidden md:inline">Generate with AI</span>
                           </Button>
                        </div>
                        <FormDescription>
                          The destination for bots and unwanted traffic.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Blacklists</CardTitle>
                  <CardDescription>
                    Block specific IPs and User-Agents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="blockedIps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blocked IPs</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123.45.67.89&#10;192.168.1.0/24" className="min-h-32 font-code" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter one IP address or CIDR range per line.
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
                        <FormLabel>Blocked User-Agents</FormLabel>
                        <FormControl>
                          <Textarea placeholder="GoogleBot&#10;AhrefsBot" className="min-h-32 font-code" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter one User-Agent string per line (partial matches supported).
                        </FormDescription>
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
                    Filter traffic based on country.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="allowedCountries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allowed Countries</FormLabel>
                        <MultiSelect
                          options={COUNTRIES}
                          selected={field.value || []}
                          onChange={field.onChange}
                          placeholder="Select countries..."
                          className="w-full"
                        />
                        <FormDescription>
                          Only allow traffic from these countries. Leave empty to allow all.
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
                        <FormLabel>Blocked Countries</FormLabel>
                         <MultiSelect
                          options={COUNTRIES}
                          selected={field.value || []}
                          onChange={field.onChange}
                          placeholder="Select countries..."
                          className="w-full"
                        />
                        <FormDescription>
                          Block traffic from these countries.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                   <FormField
                    control={form.control}
                    name="enableEmergency"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Emergency Button</FormLabel>
                          <FormDescription>
                            Enable a one-click button to force all traffic to the fake URL.
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
            <Button variant="outline" asChild><Link href="/dashboard">Cancel</Link></Button>
            <Button type="submit">Create Route</Button>
          </div>
        </form>
      </Form>
    </DashboardLayout>
  );
}
