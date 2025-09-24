'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface GoogleMapsEmbedProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function GoogleMapsEmbed({
  className = '',
  width = 600,
  height = 450,
}: GoogleMapsEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mapa Comunitario
          </CardTitle>
          <CardDescription>Mapa de Pinto Los Pellines, Chile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
            <div className="text-center p-4">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Mapa no disponible</p>
              <p className="text-sm text-gray-500">
                La clave de API de Google Maps no está configurada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pinto Los Pellines coordinates
  const lat = -36.698;
  const lng = -71.897;
  const zoom = 13;

  const embedUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=${zoom}`;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Mapa Comunitario
        </CardTitle>
        <CardDescription>Mapa de Pinto Los Pellines, Chile</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <iframe
            src={embedUrl}
            width={width}
            height={height}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-lg border-0"
            title="Mapa de Pinto Los Pellines"
          />
        </div>
      </CardContent>
    </Card>
  );
}
