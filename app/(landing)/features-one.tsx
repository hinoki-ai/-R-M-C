import { Card } from '@/components/ui/card';

import { Table } from './table';

export default function FeaturesOne() {
  return (
    <section>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <h2 className="text-foreground text-4xl font-semibold">
              Gestión Comunitaria Inteligente
            </h2>
            <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">
              Automatiza la gestión de tu comunidad conectando herramientas
              esenciales como cámaras de seguridad, pagos integrados y
              comunicación eficiente. La inteligencia artificial optimiza
              la coordinación y respuesta a las necesidades comunitarias.
            </p>
            <div className="bg-foreground/5 rounded-3xl p-6">
              <Table />
            </div>
          </div>

          <div className="border-foreground/10 relative mt-16 grid gap-12 border-b pb-12 [--radius:1rem] md:grid-cols-2">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                Seguridad 24/7
              </h3>
              <p className="text-muted-foreground my-4 text-lg">
                Monitoreo continuo con cámaras inteligentes y alertas
                automáticas para mantener segura tu comunidad.
              </p>
              <Card className="aspect-video overflow-hidden px-6 bg-muted/50">
                <Card className="h-full translate-y-6" />
              </Card>
            </div>
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                Gestión Financiera
              </h3>
              <p className="text-muted-foreground my-4 text-lg">
                Control total de ingresos, gastos y pagos comunitarios
                con reportes automáticos y transparencia total.
              </p>
              <Card className="aspect-video overflow-hidden bg-muted/50">
                <Card className="translate-6 h-full" />
              </Card>
            </div>
          </div>

          <blockquote className="before:bg-primary relative mt-12 max-w-xl pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full">
            <p className="text-foreground text-lg">
              Finalmente una plataforma que entiende las necesidades reales
              de las comunidades chilenas. La tecnología al servicio de los vecinos.
            </p>
            <footer className="mt-4 flex items-center gap-2">
              <cite>Directiva Junta de Vecinos</cite>
              <span
                aria-hidden
                className="bg-foreground/15 size-1 rounded-full"
              ></span>
              <span className="text-muted-foreground">Pinto Los Pellines</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
