'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Apple,
  CheckCircle,
  Download,
  ExternalLink,
  Globe,
  Play,
  QrCode,
  Shield,
  Smartphone,
  Star,
  Tablet,
  Users,
  Zap,
} from 'lucide-react';
import React, { Suspense, useEffect, useState } from 'react';
import { Browser } from '@capacitor/browser';
import { Device } from '@capacitor/device';

import { AnimatedGroup } from '@/components/ui/animated-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TextEffect } from '@/components/ui/text-effect';
import { TouchButton } from '@/components/ui/touch-button';

interface DownloadPlatform {
  name: string;
  icon: React.ReactNode;
  description: string;
  downloadUrl: string;
  storeBadge?: string;
  qrCode?: string;
  version: string;
  size: string;
  rating?: number;
  downloads?: string;
}

// Loading skeleton component for better UX
function DownloadSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded-lg mx-auto w-64 mb-4"></div>
        <div className="h-4 bg-muted rounded mx-auto w-96"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg p-6 space-y-4">
              <div className="h-16 bg-muted-foreground/20 rounded-lg"></div>
              <div className="h-6 bg-muted-foreground/20 rounded w-3/4"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
              <div className="h-10 bg-muted-foreground/20 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobileAppDownload() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [userAgent, setUserAgent] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeDeviceInfo = async () => {
      try {
        // Check if we're on the client side before accessing navigator
        if (typeof window !== 'undefined') {
          setUserAgent(navigator.userAgent);
          // Get detailed device information using Capacitor Device plugin
          const info = await Device.getInfo();
          setDeviceInfo(info);
        }
      } catch (error) {
        // Fallback to user agent detection if Capacitor plugins aren't available
        if (typeof window !== 'undefined') {
          setUserAgent(navigator.userAgent);
        }
        console.log('Device plugin not available, using fallback detection');
      }
    };

    initializeDeviceInfo();

    // Simulate component loading for better UX
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Cross-platform compatibility check
  const [compatibility, setCompatibility] = useState({
    pwaSupported: false,
    serviceWorkerSupported: false,
    webAppInstallSupported: false,
    touchSupported: false,
    geolocationSupported: false,
    cameraSupported: false,
  });

  useEffect(() => {
    // Comprehensive compatibility detection
    const checkCompatibility = () => {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return;
      }

      setCompatibility({
        pwaSupported: 'serviceWorker' in navigator && 'caches' in window,
        serviceWorkerSupported: 'serviceWorker' in navigator,
        webAppInstallSupported:
          'onbeforeinstallprompt' in window ||
          window.matchMedia('(display-mode: standalone)').matches,
        touchSupported:
          'ontouchstart' in window || navigator.maxTouchPoints > 0,
        geolocationSupported: 'geolocation' in navigator,
        cameraSupported:
          'mediaDevices' in navigator &&
          'getUserMedia' in navigator.mediaDevices,
      });
    };

    checkCompatibility();
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        return () => observer.disconnect();
      } catch (e) {
        // Performance API not fully supported
      }
    }
  }, []);

  const platforms: DownloadPlatform[] = [
    {
      name: 'Android',
      icon: <Play className="w-8 h-8 text-green-500" />,
      description: 'Descarga la APK directamente',
      downloadUrl:
        'https://github.com/hinoki-ai/-R-M-C/releases/download/v1.0.0/pinto-pellines-v1.0.0.apk',
      storeBadge: 'APK Directa',
      version: '1.0.0',
      size: '45 MB',
      rating: 4.8,
      downloads: '10,000+',
    },
    {
      name: 'iOS',
      icon: <Apple className="w-8 h-8 text-gray-800 dark:text-white" />,
      description: 'Descarga la IPA (requiere sideloading)',
      downloadUrl:
        'https://github.com/hinoki-ai/-R-M-C/releases/download/v1.0.0/pinto-pellines-v1.0.0.ipa',
      storeBadge: 'IPA Directa',
      version: '1.0.0',
      size: '52 MB',
      rating: 4.9,
      downloads: '8,500+',
    },
    {
      name: 'PWA',
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      description: 'Instala como aplicación web progresiva',
      downloadUrl: '#',
      storeBadge: 'Web App',
      version: '1.0.0',
      size: 'Sin descarga',
      rating: 4.7,
      downloads: '25,000+',
    },
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: 'Seguridad 24/7',
      description: 'Acceso seguro a todas las funciones de la comunidad',
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'Notificaciones Instantáneas',
      description: 'Recibe alertas de emergencias y anuncios importantes',
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: 'Comunidad Conectada',
      description: 'Mantente al día con eventos y actividades locales',
    },
  ];

  const handleDownload = async (platform: DownloadPlatform) => {
    setIsDownloading(true);
    setSelectedPlatform(platform.name);

    try {
      if (platform.name === 'PWA') {
        // Handle PWA installation with proper error handling
        if (typeof window !== 'undefined' && (window as any).installPWA) {
          const success = await (window as any).installPWA();
          if (success) {
            console.log('PWA installation successful');
          } else {
            console.log('PWA installation cancelled or failed');
            // Fallback: show manual installation instructions
            alert(
              'Para instalar la app, toca el botón "Compartir" en tu navegador y selecciona "Añadir a pantalla de inicio"'
            );
          }
        } else {
          // Fallback for browsers without install prompt
          alert('Para instalar la app: toca ⋮ → "Añadir a pantalla de inicio"');
        }
      } else {
        // Use Capacitor Browser plugin for better mobile experience
        try {
          await Browser.open({
            url: platform.downloadUrl,
            presentationStyle: 'popover',
          });
        } catch (browserError) {
          // Fallback to window.open if Browser plugin fails
          console.log('Browser plugin not available, using fallback');
          const newWindow = window.open(
            platform.downloadUrl,
            '_blank',
            'noopener,noreferrer'
          );
          if (!newWindow) {
            // Final fallback: direct navigation
            window.location.href = platform.downloadUrl;
          }
        }
      }

      // Success feedback
      setDownloadComplete(true);
    } catch (error) {
      console.error('Download failed:', error);
      // Show user-friendly error message
      alert('Error al descargar. Por favor intenta de nuevo.');
    } finally {
      setIsDownloading(false);
      setTimeout(() => {
        setDownloadComplete(false);
        setSelectedPlatform(null);
      }, 3000);
    }
  };

  const getRecommendedPlatform = () => {
    // Use Capacitor Device plugin info if available for better accuracy
    if (deviceInfo) {
      // Check if window is available for standalone detection
      const isStandalone = typeof window !== 'undefined' ?
        window.matchMedia('(display-mode: standalone)').matches : false;

      // If already installed as PWA, don't recommend stores
      if (isStandalone) return 'PWA';

      // Use device platform information from Capacitor
      if (deviceInfo.platform === 'android') return 'Android';
      if (deviceInfo.platform === 'ios') return 'iOS';

      // For web/desktop, recommend PWA
      return 'PWA';
    }

    // Fallback to user agent detection
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);

    // Check if running in a mobile app context (only if window is available)
    const isStandalone = typeof window !== 'undefined' ?
      window.matchMedia('(display-mode: standalone)').matches : false;

    // If already installed as PWA, don't recommend stores
    if (isStandalone) return 'PWA';

    // Prioritize native apps for mobile devices
    if (isAndroid) return 'Android';
    if (isIOS) return 'iOS';

    // For desktop or unknown devices, recommend PWA
    return 'PWA';
  };

  const recommended = getRecommendedPlatform();

  if (!isLoaded) {
    return (
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <DownloadSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
      aria-labelledby="download-heading"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <TextEffect
            preset="fade-in-blur"
            per="word"
            as="h2"
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            📱 Descarga Nuestra App
          </TextEffect>
          <TextEffect
            preset="fade-in-blur"
            per="line"
            delay={0.5}
            as="p"
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Accede a todas las funciones de la comunidad Pinto Los Pellines
            desde tu dispositivo móvil. Mantente conectado, informado y seguro
            con nuestra aplicación nativa.
          </TextEffect>
        </div>

        {/* Features Grid */}
        <AnimatedGroup
          preset="scale"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/50 border-border/50 hover:bg-card/80 transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </AnimatedGroup>

        {/* Download Platforms */}
        <div className="max-w-6xl mx-auto">
          <AnimatedGroup
            preset="slide"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {platforms.map((platform, index) => (
              <Card
                key={platform.name}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  platform.name === recommended
                    ? 'ring-2 ring-primary shadow-2xl shadow-primary/25'
                    : 'hover:shadow-xl'
                }`}
              >
                {platform.name === recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold z-10">
                    🎯 Recomendado para tu dispositivo
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {platform.icon}
                  </div>
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    {platform.name}
                    {platform.storeBadge && (
                      <Badge variant="secondary" className="text-xs">
                        {platform.storeBadge}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {platform.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Platform Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">
                        Versión
                      </div>
                      <div className="text-muted-foreground">
                        {platform.version}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">
                        Tamaño
                      </div>
                      <div className="text-muted-foreground">
                        {platform.size}
                      </div>
                    </div>
                    {platform.rating && (
                      <div className="text-center col-span-2">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">
                            {platform.rating}
                          </span>
                          <span className="text-muted-foreground">/ 5.0</span>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {platform.downloads} descargas
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Download Button */}
                  <div className="pt-4">
                    <AnimatePresence mode="wait">
                      {isDownloading && selectedPlatform === platform.name ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="text-center py-4"
                        >
                          <div className="inline-flex items-center gap-2 text-primary">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            >
                              <Download className="w-5 h-5" />
                            </motion.div>
                            <span className="font-medium">Descargando...</span>
                          </div>
                        </motion.div>
                      ) : downloadComplete &&
                        selectedPlatform === platform.name ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="text-center py-4"
                        >
                          <div className="inline-flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">
                              ¡Descarga completada!
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <TouchButton
                          onClick={() => handleDownload(platform)}
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          haptic="medium"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Descargar {platform.name}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </TouchButton>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* QR Code for mobile access */}
                  {platform.name !== 'PWA' && (
                    <div className="text-center pt-2">
                      <div
                        className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => {
                          // In a real implementation, this would open a modal with QR code
                          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(platform.downloadUrl)}`;
                          window.open(qrUrl, '_blank');
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(platform.downloadUrl)}`;
                            window.open(qrUrl, '_blank');
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Generar código QR para ${platform.name}`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Ver código QR</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </AnimatedGroup>
        </div>

        {/* Security & Trust Badges */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              🔒 Seguridad Garantizada
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tu privacidad y seguridad son nuestra prioridad. Nuestra
              aplicación cumple con los más altos estándares de seguridad.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-foreground">
                SSL Encriptado
              </div>
              <div className="text-xs text-muted-foreground">
                Comunicación segura
              </div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-foreground">
                Privacidad
              </div>
              <div className="text-xs text-muted-foreground">
                Datos protegidos
              </div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-foreground">
                Actualizaciones
              </div>
              <div className="text-xs text-muted-foreground">
                Seguridad constante
              </div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-foreground">
                Certificado
              </div>
              <div className="text-xs text-muted-foreground">
                App Store verificada
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-muted-foreground">
            ¿Problemas con la descarga?{' '}
            <Button variant="link" className="p-0 h-auto font-normal">
              Contacta nuestro soporte
            </Button>
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Datos seguros
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Actualizaciones automáticas
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Comunidad activa
            </span>
          </div>

          {/* Device compatibility indicators */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {compatibility.touchSupported && (
              <Badge variant="outline" className="text-xs">
                👆 Touch Enabled
              </Badge>
            )}
            {compatibility.pwaSupported && (
              <Badge variant="outline" className="text-xs">
                📱 PWA Compatible
              </Badge>
            )}
            {compatibility.cameraSupported && (
              <Badge variant="outline" className="text-xs">
                📷 Camera Ready
              </Badge>
            )}
            {compatibility.geolocationSupported && (
              <Badge variant="outline" className="text-xs">
                📍 GPS Available
              </Badge>
            )}
            {compatibility.webAppInstallSupported && (
              <Badge variant="outline" className="text-xs">
                ⚡ Install Prompt
              </Badge>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
