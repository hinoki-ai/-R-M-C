import { Metadata } from 'next';
import { MobileAppDownload } from '@/components/mobile-app-download';

export const metadata: Metadata = {
  title: 'Descargar App | Pinto Los Pellines',
  description: 'Descarga la aplicación móvil de Pinto Los Pellines para acceder a todas las funciones desde tu dispositivo.',
  keywords: 'app móvil, descarga, Pinto Los Pellines, Android, iOS, PWA',
  openGraph: {
    title: 'Descargar App | Pinto Los Pellines',
    description: 'Descarga la aplicación móvil de Pinto Los Pellines',
    type: 'website',
  },
};

// Force dynamic rendering to prevent SSR issues with window access
export const dynamic = 'force-dynamic';

export default function DownloadPage() {
  return (
    <main className="min-h-screen">
      <MobileAppDownload />
    </main>
  );
}