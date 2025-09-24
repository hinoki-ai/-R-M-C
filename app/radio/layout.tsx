import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Radio Comunitaria - JuntaDeVecinos',
  description:
    'Escucha estaciones de radio locales y comunitarias de Pinto Los Pellines',
};

export default function RadioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
