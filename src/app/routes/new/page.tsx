
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard-layout";
import withAuth from "@/components/with-auth";
import { NewRouteForm } from "@/components/new-route-form";

function NewRoutePage() {
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

export default withAuth(NewRoutePage);
