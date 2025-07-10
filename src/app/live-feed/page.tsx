"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function LiveFeedPage() {
  return (
    <DashboardLayout>
       <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Live Feed</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Acessos em Tempo Real</CardTitle>
          <CardDescription>
            Acompanhe os visitantes chegando em seus links em tempo real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <Activity className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Funcionalidade em desenvolvimento...</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
