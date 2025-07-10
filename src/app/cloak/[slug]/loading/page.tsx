"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoadingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrl = searchParams.get('target');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (targetUrl) {
        window.location.href = targetUrl;
      } else {
        // Fallback if target is missing
        router.push('/');
      }
    }, 3000); // 3-second delay

    return () => clearTimeout(timer);
  }, [targetUrl, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h1 className="mt-4 text-2xl font-semibold">Aguarde, estamos redirecionando...</h1>
        <p className="mt-2 text-muted-foreground">Isso levará apenas um momento.</p>
      </div>
    </div>
  );
}
