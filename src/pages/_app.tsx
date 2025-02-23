import { AuthProvider } from '@/contexts/AuthContext';
import type { AppProps } from 'next/app';
import PageTransition from '@/components/ui/PageTransition';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PageTransition>
        <Component {...pageProps} />
      </PageTransition>
    </AuthProvider>
  );
}
