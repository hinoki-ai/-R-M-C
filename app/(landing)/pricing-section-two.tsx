import { Check } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Pricing() {
  return (
    <div className="bg-muted relative py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Planes para tu Comunidad
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg">
            Elige el plan perfecto para las necesidades de tu junta de vecinos
            y comienza a gestionar tu comunidad de manera eficiente
          </p>
        </div>
        <div className="@container relative mt-12 md:mt-20">
          <Card className="@4xl:max-w-full relative mx-auto max-w-sm">
            <div className="@4xl:grid-cols-3 grid">
              <div>
                <CardHeader className="p-8">
                  <CardTitle className="font-medium">Comunidad Básica</CardTitle>
                  <span className="mb-0.5 mt-2 block text-2xl font-semibold">
                    $0 / mo
                  </span>
                  <CardDescription className="text-sm">
                    Hasta 50 vecinos
                  </CardDescription>
                </CardHeader>
                <div className="border-y px-8 py-4">
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/sign-up">Comenzar Gratis</Link>
                  </Button>
                </div>

                <ul role="list" className="space-y-3 p-8">
                  {[
                    'Dashboard básico de comunidad',
                    'Comunicados y anuncios',
                    'Calendario de eventos',
                    'Soporte por email',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check
                        className="text-primary size-3"
                        strokeWidth={3.5}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ring-foreground/10 bg-background rounded-(--radius) @3xl:mx-0 @3xl:-my-3 -mx-1 border-transparent shadow ring-1">
                <div className="@3xl:py-3 @3xl:px-0 relative px-1">
                  <CardHeader className="p-8">
                    <CardTitle className="font-medium">Comunidad Pro</CardTitle>
                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">
                      $29 / mo
                    </span>
                    <CardDescription className="text-sm">
                      Hasta 200 vecinos
                    </CardDescription>
                  </CardHeader>
                  <div className="@3xl:mx-0 -mx-1 border-y px-8 py-4">
                    <Button asChild variant="gradientSunset" className="w-full">
                      <Link href="/sign-up">Comenzar Pro</Link>
                    </Button>
                  </div>

                  <ul role="list" className="space-y-3 p-8">
                    {[
                      'Todo en Comunidad Básica',
                      'Sistema de cámaras de seguridad',
                      'Gestión financiera completa',
                      'Reportes de emergencias 24/7',
                      'App móvil incluida',
                      'Soporte prioritario',
                      'Actualizaciones mensuales',
                      'Almacenamiento ilimitado',
                      'Integraciones avanzadas',
                      'Seguridad certificada',
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check
                          className="text-primary size-3"
                          strokeWidth={3.5}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <CardHeader className="p-8">
                  <CardTitle className="font-medium">Municipal</CardTitle>
                  <span className="mb-0.5 mt-2 block text-2xl font-semibold">
                    Contacto
                  </span>
                  <CardDescription className="text-sm">
                    Comunidades grandes
                  </CardDescription>
                </CardHeader>
                <div className="border-y px-8 py-4">
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/contact">Contactar Ventas</Link>
                  </Button>
                </div>

                <ul role="list" className="space-y-3 p-8">
                  {[
                    'Todo en Comunidad Pro',
                    'Integración municipal completa',
                    'Soporte técnico dedicado',
                    'Implementación personalizada',
                    'Capacitación del equipo',
                    'Reportes avanzados',
                    'API completa',
                    'SLA garantizado',
                    'Seguridad enterprise',
                    'Soporte 24/7 telefónico',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check
                        className="text-primary size-3"
                        strokeWidth={3.5}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
