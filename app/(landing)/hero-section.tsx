"use client";

import { Mail, SendHorizonal } from 'lucide-react';
import React, { useState } from 'react';

import { AnimatedGroup } from '@/components/ui/animated-group';
import { Button } from '@/components/ui/button';
import { TextEffect } from '@/components/ui/text-effect';
import { ShaderAnimation } from '@/components/ui/shader-animation';

import { HeroHeader } from './header';
import { LogoCloud } from './logo-cloud';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <>
      <HeroHeader />

      {/* CLEAN BACKGROUND - BG2 IMAGE */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/backgrounds/bg2.jpg"
          alt="Pinto Los Pellines Background"
          fill
          className="object-cover object-center opacity-100"
          priority
          quality={95}
        />
      </div>

      {/* Shader Animation Background */}
      {!animationComplete && (
        <div className="fixed inset-0 z-0">
          <ShaderAnimation
            duration={6}
            onComplete={() => setAnimationComplete(true)}
          />
        </div>
      )}

      <main
        className={`relative z-10 overflow-hidden transition-opacity duration-1000 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}
      >
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
            <div className="text-center space-y-12">

              {/* Main Title with Supreme Text Effects */}
              <div className="space-y-8">
                <TextEffect
                  preset="fade-in-blur"
                  per="word"
                  speedSegment={0.3}
                  as="h1"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground drop-shadow-2xl"
                >
                  🇨🇱 Junta de Vecinos
                </TextEffect>

                <TextEffect
                  preset="fade-in-blur"
                  per="word"
                  speedSegment={0.3}
                  delay={0.5}
                  as="h2"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-xl"
                >
                  Pinto Los Pellines, Ñuble
                </TextEffect>

                <TextEffect
                  preset="fade-in-blur"
                  per="line"
                  speedSegment={0.3}
                  delay={1}
                  as="p"
                  className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed drop-shadow-lg"
                >
                  La plataforma comunitaria más avanzada de Chile con tecnología de vanguardia,
                  cámaras de seguridad inteligentes, pagos integrados y gestión completa de la comunidad.
                </TextEffect>
              </div>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  item: transitionVariants.item,
                }}
                className="mt-12"
              >
                <form action="" className="mx-auto max-w-sm">
                  <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.5rem)] border pr-2 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                    <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" />

                    <input
                      placeholder="Tu correo electrónico"
                      className="h-12 w-full bg-transparent pl-12 focus:outline-none"
                      type="email"
                    />

                    <div className="md:pr-1.5 lg:pr-0">
                      <Button
                        aria-label="enviar"
                        variant="gradientCool"
                        size="sm"
                        className="rounded-(--radius)"
                      >
                        <span className="hidden md:block">Comenzar</span>
                        <SendHorizonal
                          className="relative mx-auto size-5 md:hidden"
                          strokeWidth={2}
                        />
                      </Button>
                    </div>
                  </div>
                </form>

                <div
                  aria-hidden
                  className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left"
                >
                  <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                    <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                  </div>
                  <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                    <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black">
                      <AppComponent />

                      <div className="bg-muted rounded-[1rem] p-4 pb-16 dark:bg-white/5"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5"></div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
        <LogoCloud />
      </main>
    </>
  );
}

const AppComponent = () => {
  return (
    <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
      <div className="flex items-center gap-1.5 text-orange-400">
        <svg
          className="size-5"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 32 32"
        >
          <g fill="none">
            <path
              fill="#ff6723"
              d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"
            ></path>
            <path
              fill="#ffb02e"
              d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"
            ></path>
          </g>
        </svg>
        <div className="text-sm font-medium">Comunidad</div>
      </div>
      <div className="space-y-3">
        <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">
          Esta semana, la participación comunitaria ha aumentado
          significativamente.
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-xl font-medium">
                156
              </span>
              <span className="text-muted-foreground text-xs">
                Vecinos activos
              </span>
            </div>
            <div className="flex h-5 items-center rounded bg-gradient-to-l from-emerald-400 to-indigo-600 px-2 text-xs text-white">
              Esta semana
            </div>
          </div>
          <div className="space-y-1">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-xl font-medium">
                89
              </span>
              <span className="text-muted-foreground text-xs">
                Vecinos activos
              </span>
            </div>
            <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded px-2 text-xs dark:bg-white/20">
              Semana pasada
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
