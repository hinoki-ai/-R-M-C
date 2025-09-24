import PublicRadioPlayer from '@/components/public/public-radio-player';
import AuroraBorealisShader from '@/components/ui/aurora-borealis-shader';
import { PublicLayout } from '@/components/layout/public-layout';

export default function RadioPage() {
  return (
    <PublicLayout>
      <div className="relative min-h-screen">
        <AuroraBorealisShader />
        <div className="relative z-10 space-y-8 p-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">
              Radio Comunitaria
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Escucha estaciones de radio locales y comunitarias. Mantente
              informado con noticias, disfruta de música regional y conoce la
              cultura de Pinto Los Pellines.
            </p>
          </div>

          <PublicRadioPlayer />
        </div>
      </div>
    </PublicLayout>
  );
}
