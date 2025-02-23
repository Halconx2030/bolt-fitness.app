import { Suspense } from 'react';
import { Montserrat } from 'next/font/google';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Inter } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata = {
  title: 'BoltFitness',
  description: 'Tu compañero de entrenamiento personal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://your-supabase-project.supabase.co"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://your-supabase-project.supabase.co" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          <Toaster />
          <VercelAnalytics />
          <SpeedInsights />
        </ErrorBoundary>
      </body>
    </html>
  );
}
