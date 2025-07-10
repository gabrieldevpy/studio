import { notFound } from "next/navigation";
import { db } from "@/lib/firebase/server";
import EditRouteClientPage from "@/components/edit-route-client-page";

async function getRouteData(slug: string) {
  try {
    const routesRef = db.collection("routes");
    const q = routesRef.where("slug", "==", slug).limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return null;
    }

    const routeDoc = querySnapshot.docs[0];
    const data = routeDoc.data();

    // Convert Firestore Timestamps to serializable format (JSON stringify/parse is a safe way)
    const serializableData = JSON.parse(JSON.stringify(data));

    return { id: routeDoc.id, ...serializableData };
  } catch (err: any) {
    console.error("Error fetching route data for edit:", err);
    return null;
  }
}

export default async function EditRoutePage({ params }: { params: { slug: string } }) {
  const routeData = await getRouteData(params.slug);

  if (!routeData) {
    notFound(); // Triggers the not-found page
  }

  return <EditRouteClientPage routeData={routeData} />;
}
