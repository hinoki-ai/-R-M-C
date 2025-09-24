'use client';

import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🇨🇱 Junta de Vecinos
          </h1>
          <p className="text-muted-foreground">
            Únete a Pinto Los Pellines, Ñuble
          </p>
        </div>
        <SignUp
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#10b981', // emerald-500
              colorBackground: '#1f2937', // gray-800
              colorInputBackground: '#374151', // gray-700
              colorInputText: '#f9fafb', // gray-50
              colorText: '#f9fafb', // gray-50
              borderRadius: '0.5rem',
            },
            elements: {
              formButtonPrimary:
                'bg-emerald-600 hover:bg-emerald-700 text-white',
              card: 'bg-gray-800 border-gray-700',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-300',
              socialButtonsBlockButton:
                'bg-gray-700 hover:bg-gray-600 border-gray-600',
              socialButtonsBlockButtonText: 'text-white',
              dividerLine: 'bg-gray-600',
              dividerText: 'text-gray-400',
              formFieldLabel: 'text-gray-300',
              formFieldInput:
                'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
              footerActionLink: 'text-emerald-400 hover:text-emerald-300',
              identityPreviewEditButton:
                'text-emerald-400 hover:text-emerald-300',
            },
          }}
          routing="path"
          path="/sign-up"
          redirectUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
