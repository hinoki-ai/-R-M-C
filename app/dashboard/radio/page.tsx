import { Metadata } from 'next';

import RadioPlayer from '@/components/dashboard/radio/radio-player';

export const metadata: Metadata = {
  title: 'Radio - JuntaDeVecinos',
  description: 'Estaciones de radio comunitarias para Pinto Los Pellines',
};

export default function RadioPage() {
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Radio Comunitaria</h1>
        <p className='text-muted-foreground'>
          Escucha estaciones de radio locales y mantente informado sobre noticias comunitarias
        </p>
      </div>

      <RadioPlayer />
    </div>
  );
}