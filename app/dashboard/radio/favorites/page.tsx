// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import RadioPlayer from '@/components/dashboard/radio/radio-player';

export default function RadioFavoritesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Radio Favoritas</h1>
        <p className="text-muted-foreground">
          Tus estaciones de radio favoritas para acceder rápidamente
        </p>
      </div>

      <RadioPlayer />
    </div>
  );
}
