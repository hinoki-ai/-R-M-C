import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';

import './globals.css';

import { RouterProvider } from '@/lib/router-context';
import { MobileInitializer } from '@/components/mobile/mobile-initializer';
import ConvexClientProvider from '@/components/providers/convex-client-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { OfflineIndicator } from '@/components/shared/offline-indicator';
import { PWA } from '@/components/shared/pwa';
import { SetupError } from '@/components/setup-error';

import { RootErrorBoundary } from '@/components/shared/root-error-boundary';

// Font configuration using system fonts
const geistSans = {
  variable: '--font-geist-sans',
  className: '',
};

const geistMono = {
  variable: '--font-geist-mono',
  className: '',
};

export const metadata: Metadata = {
  title: 'Pinto Los Pellines - Plataforma de Gestión Comunitaria',
  description:
    'Plataforma avanzada de gestión comunitaria con cámaras de seguridad, integración de pagos y herramientas completas de gestión vecinal.',
  keywords: [
    'comunidad',
    'vecindario',
    'seguridad',
    'gestión',
    'cámaras',
    'pagos',
  ],
  authors: [{ name: 'ARAMAC' }],
  creator: 'ARAMAC',
  publisher: 'ARAMAC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://hinoki-ai.github.io/-R-M-C'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pinto Los Pellines - Plataforma de Gestión Comunitaria',
    description:
      'Plataforma avanzada de gestión comunitaria con cámaras de seguridad, integración de pagos y herramientas completas de gestión vecinal.',
    url: '/',
    siteName: 'Pinto Los Pellines',
    images: [
      {
        url: '/hero-section-main-app-dark.png',
        width: 1200,
        height: 630,
        alt: 'Vista previa de la plataforma Pinto Los Pellines',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pinto Los Pellines - Plataforma de Gestión Comunitaria',
    description:
      'Plataforma avanzada de gestión comunitaria con cámaras de seguridad, integración de pagos y herramientas completas de gestión vecinal.',
    images: ['/hero-section-main-app-dark.png'],
    creator: '@ARAMAC',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1.5,
  userScalable: false,
};

// Client-side wrapper to ensure Next.js children render within RouterProvider
function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <RouterProvider>{children}</RouterProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check for missing environment variables early
  const missingCriticalVars =
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.NEXT_PUBLIC_CONVEX_URL;

  // Clerk Frontend API is configured via environment; modern ClerkProvider does not need frontendApi prop

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overscroll-none`}
      >
        <RootErrorBoundary>
          {missingCriticalVars ? (
            <SetupError />
          ) : (
            <ThemeProvider>
              <OfflineIndicator />
              {/* Register PWA and offline capabilities */}
              <PWA />
              <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
                <ConvexClientProvider>
                  <MobileInitializer />
                  <ClientWrapper>{children}</ClientWrapper>
                </ConvexClientProvider>
              </ClerkProvider>
            </ThemeProvider>
          )}
        </RootErrorBoundary>
      </body>
    </html>
  );
}
