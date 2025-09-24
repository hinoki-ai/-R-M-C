'use client';

import { AlertTriangle, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SetupError() {
  const missingVars = [];

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    missingVars.push('NEXT_PUBLIC_CONVEX_URL');
  }

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    missingVars.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }

  if (missingVars.length === 0) {
    return null; // No missing variables, don't show error
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold text-destructive">
            Configuración Requerida
          </CardTitle>
          <CardDescription className="text-lg">
            La aplicación no puede iniciarse porque faltan variables de entorno críticas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>Variables faltantes:</strong> {missingVars.join(', ')}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Pasos para solucionar:</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Copia el archivo <code className="bg-muted px-1 py-0.5 rounded">.env.example</code> a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code></li>
                <li>Completa las variables requeridas con tus claves API reales</li>
                <li>Reinicia el servidor de desarrollo</li>
              </ol>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Variables requeridas mínimas:</h4>
              <pre className="text-sm text-muted-foreground">
{`# Archivo: .env.local
NEXT_PUBLIC_CONVEX_URL=https://tu-app-convex.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_tu_clave_clerk`}
              </pre>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.open('https://docs.convex.dev', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Documentación Convex
            </Button>
            <Button
              onClick={() => window.open('https://clerk.com/docs', '_blank')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Documentación Clerk
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Si ya configuraste las variables, intenta recargar la página o reiniciar el servidor.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}