'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mountain } from 'lucide-react';

interface WikilocEmbedProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function WikilocEmbed({
  className = '',
  width = 600,
  height = 450,
}: WikilocEmbedProps) {
  // Wikiloc URL for Salto Los Pellines trail
  const wikilocUrl =
    'https://pt.wikiloc.com/wikiloc/map.do?sw=-36.83010462263656%2C-71.63569351767103&ne=-36.80749537736346%2C-71.60745048232894&place=Salto%20Los%20Pellines&page=1';

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mountain className="w-5 h-5" />
          Sendero Salto Los Pellines
        </CardTitle>
        <CardDescription>
          Ruta de senderismo en Wikiloc - Pinto Los Pellines, Chile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <iframe
            src={wikilocUrl}
            width={width}
            height={height}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-lg border-0"
            title="Sendero Salto Los Pellines - Wikiloc"
          />
        </div>
        <div className="mt-3 text-center space-y-2">
          <a
            href={wikilocUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Ver en Wikiloc →
          </a>
          <div className="text-xs text-gray-500">
            Contribución colaborativa de{' '}
            <a
              href="https://pt.wikiloc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Wikiloc
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
