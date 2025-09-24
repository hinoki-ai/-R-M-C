'use client';

import Link from 'next/link';
import { AramacCopyright } from '@/components/ui/copyright';

const columns = [
  {
    title: 'Plataforma',
    items: [
      { title: 'Características', href: '/#features' },
      { title: 'Precios', href: '/#pricing' },
      { title: 'Panel de Control', href: '/dashboard' },
      { title: 'API', href: '/api' },
    ],
  },
  {
    title: 'Comunidad',
    items: [
      { title: 'Anuncios', href: '/anuncios' },
      { title: 'Comercios', href: '/comercios' },
      { title: 'Radio', href: '/radio' },
      { title: 'Dashboard Comunidad', href: '/dashboard/community' },
    ],
  },
  {
    title: 'Servicios',
    items: [
      { title: 'Calendario', href: '/dashboard/calendar' },
      { title: 'Emergencias', href: '/dashboard/emergencies' },
      { title: 'Documentos', href: '/dashboard/documents' },
      { title: 'Eventos', href: '/dashboard/events' },
    ],
  },
  {
    title: 'Recursos',
    items: [
      { title: 'Clima', href: '/dashboard/weather' },
      { title: 'Mapas', href: '/dashboard/maps' },
      { title: 'Fotos', href: '/dashboard/photos' },
      { title: 'Contactos', href: '/dashboard/contacts' },
    ],
  },
  {
    title: 'Soporte',
    items: [
      { title: 'Centro de Ayuda', href: '/dashboard/help' },
      { title: 'Donar', href: '/donate' },
      { title: 'Configuración', href: '/dashboard/settings' },
    ],
  },
];

export default function FooterSection() {
  
  return (
    <footer className="pt-4 md:pt-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-center justify-end">
          <div className="text-xs text-muted-foreground">
            Región:{' '}
            <button className="underline underline-offset-2">Global</button> /{' '}
            <button className="underline underline-offset-2">EEE</button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
          {columns.map((col, idx) => (
            <div key={idx}>
              <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2 text-sm">
                {col.items.map((l, i) => (
                  <li key={i}>
                    <Link
                      href={l.href}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="my-10 flex flex-wrap items-center justify-end gap-4 border-t pt-6"></div>

        <div className="text-center">
          <AramacCopyright />
        </div>
      </div>
    </footer>
  );
}
