import { Metadata } from 'next';

import PublicRadioPlayer from '@/components/public/public-radio-player';

export const metadata: Metadata = {
  title: 'Radio Comunitaria - JuntaDeVecinos',
  description: 'Escucha estaciones de radio locales y comunitarias de Pinto Los Pellines. Mantente informado con las noticias y programación cultural de tu comunidad.',
  keywords: 'radio comunitaria, Pinto Los Pellines, radio local, noticias, música, cultura',
  openGraph: {
    title: 'Radio Comunitaria - JuntaDeVecinos',
    description: 'Escucha estaciones de radio locales y comunitarias de Pinto Los Pellines',
    type: 'website',
  },
};

export default function RadioPage() {
  return (
    <div className='space-y-8'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold tracking-tight'>Radio Comunitaria</h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          Escucha estaciones de radio locales y comunitarias. Mantente informado con noticias,
          disfruta de música regional y conoce la cultura de Pinto Los Pellines.
        </p>
      </div>

      <PublicRadioPlayer />
    </div>
  );
}