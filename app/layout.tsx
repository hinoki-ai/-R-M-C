import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import { MobileInitializer } from '@/components/mobile/mobile-initializer';
import ConvexClientProvider from '@/components/providers/convex-client-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { OfflineIndicator } from '@/components/shared/offline-indicator';
import { PWA } from '@/components/shared/pwa';

import { RootErrorBoundary } from '@/components/shared/root-error-boundary';

// Font configuration
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pinto Los Pellines - Plataforma de Gestión Comunitaria',
  description: 'Plataforma avanzada de gestión comunitaria con cámaras de seguridad, integración de pagos y herramientas completas de gestión vecinal.',
  keywords: ['comunidad', 'vecindario', 'seguridad', 'gestión', 'cámaras', 'pagos'],
  authors: [{ name: 'ARAMAC' }],
  creator: 'ARAMAC',
  publisher: 'ARAMAC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://hinoki-ai.github.io/-R-M-C'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pinto Los Pellines - Plataforma de Gestión Comunitaria',
    description: 'Plataforma avanzada de gestión comunitaria con cámaras de seguridad, integración de pagos y herramientas completas de gestión vecinal.',
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
    description: 'Plataforma avanzada de gestión comunitaria con cámaras de seguridad, integración de pagos y herramientas completas de gestión vecinal.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overscroll-none`}
      >
        <RootErrorBoundary>
          <ThemeProvider>
            <OfflineIndicator />
            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
              <ConvexClientProvider>
                <MobileInitializer />
                {children}
                <PWA />
              </ConvexClientProvider>
            </ClerkProvider>
          </ThemeProvider>
        </RootErrorBoundary>
      </body>
    </html>
  );
}
