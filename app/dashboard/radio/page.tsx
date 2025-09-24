// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import RadioPlayer from '@/components/dashboard/radio/radio-player';
import { BackButton } from '@/components/shared/back-button';

export default function RadioPage() {
  return (
    <>
      <BackButton className="mb-6" />
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Radio Comunitaria
          </h1>
          <p className="text-muted-foreground">
            Escucha estaciones de radio locales y mantente informado sobre
            noticias comunitarias
          </p>
        </div>

        <RadioPlayer />
      </div>
    </>
  );
}
