
import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from 'next/dynamic';

const WebhookClientContent = dynamic(() => import('@/components/webhook-client-content'), { 
  ssr: false,
  loading: () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
            <Skeleton className="h-[250px] w-full" />
        </div>
        <div className="lg:col-span-2">
            <Skeleton className="h-[380px] w-full" />
        </div>
      </div>
       <Skeleton className="h-[300px] w-full mt-8" />
    </div>
  )
});

export default function WebhooksPage() {
    return (
        <DashboardLayout>
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold">Webhooks</h1>
            </div>
            <WebhookClientContent />
        </DashboardLayout>
    );
}
