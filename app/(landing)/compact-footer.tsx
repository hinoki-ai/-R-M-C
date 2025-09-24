'use client';

import Link from 'next/link';
import { AramacCopyright } from '@/components/ui/copyright';
import { ROUTES } from '@/lib/router-context';

export default function CompactFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Plataforma comunitaria de Pinto Los Pellines. Conectando vecinos y
              servicios locales.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <nav className="flex items-center space-x-4 text-sm font-medium">
              <Link
                href={ROUTES.DASHBOARD_CONTACTS}
                className="text-muted-foreground hover:text-foreground"
              >
                Contacto
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground"
              >
                Términos
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 text-center">
          <AramacCopyright />
        </div>
      </div>
    </footer>
  );
}
