
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dynamic from 'next/dynamic';

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the form component with SSR disabled
const NewRouteForm = dynamic(() => import('@/components/new-route-form').then(mod => mod.NewRouteForm), {
  ssr: false,
  loading: () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[450px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[250px] w-full" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    </div>
  ),
});

export default function NewRoutePage() {
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
      <NewRouteForm />
    </DashboardLayout>
  );
}
