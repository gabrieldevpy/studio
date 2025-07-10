
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from 'react';
import { notFound } from "next/navigation";
import { auth } from "@/lib/firebase"; // Assuming you export auth for server-side use cases
import { db, admin } from "@/lib/firebase/server";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import withAuth from "@/components/with-auth";
import { NewRouteForm } from "@/components/new-route-form";
import { toast } from "@/hooks/use-toast";

// Server-side function to fetch route data
async function getRouteData(slug: string) {
    // Note: In a real app, you'd get the UID from the server-side session, not hardcoded.
    // This part is tricky with Firebase client-side SDK (`auth`) on the server.
    // For this example, we'll assume we can get the user's context. A better approach
    // would be to use Firebase Admin SDK with session cookies.
    // This function will run on the server.
  try {
    const routesRef = db.collection("routes");
    const q = routesRef.where("slug", "==", slug).limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return null;
    }
    
    const routeDoc = querySnapshot.docs[0];
    const data = routeDoc.data();
    
    // Convert Firestore Timestamps to serializable format if they exist
    const serializableData = JSON.parse(JSON.stringify(data));

    return { id: routeDoc.id, ...serializableData };

  } catch (err: any) {
    console.error("Error fetching route data for edit:", err);
    return null;
  }
}

async function EditRoutePage({ params }: { params: { slug: string } }) {
  const routeData = await getRouteData(params.slug);

  if (!routeData) {
    notFound(); // Triggers the not-found page
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
          Editando Rota: /<span className="font-code">{params.slug}</span>
        </h1>
      </div>
      <NewRouteForm existingRoute={routeData} />
    </DashboardLayout>
  );
}

// We still wrap with withAuth to protect the route on the client-side,
// although the data fetching is now on the server.
export default withAuth(EditRoutePage);
