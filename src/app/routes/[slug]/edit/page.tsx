
"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import withAuth from "@/components/with-auth";
import { NewRouteForm } from "@/components/new-route-form";
import { auth, db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

function EditRoutePage({ params }: { params: { slug: string } }) {
  const [user] = useAuthState(auth);
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchRouteData = async () => {
      try {
        const routesRef = collection(db, "routes");
        const q = query(routesRef, where("slug", "==", params.slug), where("userId", "==", user.uid), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Rota não encontrada ou você não tem permissão para editá-la.");
        }
        
        const routeDoc = querySnapshot.docs[0];
        setRouteData({ id: routeDoc.id, ...routeDoc.data() });

      } catch (err: any) {
        console.error("Error fetching route data for edit:", err);
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Erro ao carregar a rota",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [user, params.slug]);


  const PageContent = () => {
    if (loading) {
      return (
         <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
      );
    }

    if (error) {
        return <div className="text-destructive text-center p-8">{error}</div>
    }

    return <NewRouteForm existingRoute={routeData} />;
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
          {loading ? <Skeleton className="h-6 w-48" /> : `Editando Rota: /${params.slug}`}
        </h1>
      </div>
      <PageContent />
    </DashboardLayout>
  );
}

export default withAuth(EditRoutePage);
