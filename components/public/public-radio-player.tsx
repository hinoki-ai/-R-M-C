'use client';

import {
  Pause,
  Play,
  Radio,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

interface RadioStation {
  _id: string;
  name: string;
  description?: string;
  streamUrl: string;
  backupStreamUrl?: string;
  logoUrl?: string;
  frequency?: string;
  category: string;
  region: string;
  isActive?: boolean;
  isOnline?: boolean;
  quality?: string;
  lastChecked?: number;
  createdAt?: number;
}

const PublicRadioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // State management
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Convex queries
  const allStations = useQuery(api.radio.getRadioStations) || [];

  // Get stations by category
  const getStationsByCategory = (category: string) => {
    if (category === 'all') return allStations;
    return allStations.filter(station => station.category === category);
  };

  const categories = [
    { id: 'all', label: 'Todas', icon: Radio },
    { id: 'news', label: 'Noticias', icon: Radio },
    { id: 'music', label: 'Música', icon: Radio },
    { id: 'sports', label: 'Deportes', icon: Radio },
    { id: 'cultural', label: 'Cultural', icon: Radio },
    { id: 'emergency', label: 'Emergencia', icon: Radio },
    { id: 'community', label: 'Comunitaria', icon: Radio },
  ];

  // Stream health check with broad browser support (manual timeout)
  const checkStreamHealth = async (streamUrl: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(streamUrl, {
        method: 'HEAD',
        signal: controller.signal,
        // Some radio servers block CORS; failures are handled gracefully below
        mode: 'no-cors',
      });
      clearTimeout(timeout);
      // In no-cors mode, status is 0. Treat it as unknown but not fatal.
      return response.ok || response.status === 0;
    } catch {
      return false;
    }
  };

  // Enhanced audio controls with backup stream support and improved error handling
  const playStation = async (
    station: RadioStation,
    retryCount = 0,
    useBackup = false
  ) => {
    if (!audioRef.current) return;

    const maxRetries = 3;
    const streamUrl =
      useBackup && station.backupStreamUrl
        ? station.backupStreamUrl
        : station.streamUrl;
    const streamType = useBackup ? 'backup' : 'primary';

    try {
      setIsLoading(true);

      if (currentStation?._id !== station._id || useBackup) {
        // Stop current playback before changing source
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        // Set CORS attribute BEFORE setting src
        audioRef.current.crossOrigin = 'anonymous';
        // Set new source with enhanced handling
        audioRef.current.src = streamUrl;
        audioRef.current.preload = 'metadata'; // Preload metadata for better UX

        // Set audio format hints for better compatibility
        if (streamUrl.includes('.m3u8') || streamUrl.includes('.m3u')) {
          // HLS stream
          console.log('Detected HLS stream format');
        }

        audioRef.current.load();
        setCurrentStation(station);
      }

      // Enhanced loading with multiple event handling
      await Promise.race([
        new Promise((resolve, reject) => {
          let resolved = false;

          const onCanPlay = () => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve(void 0);
            }
          };

          const onCanPlayThrough = () => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve(void 0);
            }
          };

          const onError = (e: Event) => {
            if (!resolved) {
              resolved = true;
              cleanup();
              reject(new Error(`Audio load failed: ${streamType} stream`));
            }
          };

          const onStalled = () => {
            // Don't reject on stall, just log
            console.warn('Audio stalled during loading');
          };

          const cleanup = () => {
            if (audioRef.current) {
              audioRef.current.removeEventListener('canplay', onCanPlay);
              audioRef.current.removeEventListener(
                'canplaythrough',
                onCanPlayThrough
              );
              audioRef.current.removeEventListener('error', onError);
              audioRef.current.removeEventListener('stalled', onStalled);
            }
          };

          audioRef.current?.addEventListener('canplay', onCanPlay);
          audioRef.current?.addEventListener(
            'canplaythrough',
            onCanPlayThrough
          );
          audioRef.current?.addEventListener('error', onError);
          audioRef.current?.addEventListener('stalled', onStalled);

          // Timeout after 15 seconds
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              cleanup();
              reject(new Error(`Audio load timeout: ${streamType} stream`));
            }
          }, 15000);
        }),
        new Promise(resolve => setTimeout(resolve, 500)), // Minimum wait
      ]);

      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);

      const streamMsg = useBackup ? ` (transmisión alternativa)` : '';
      toast.success(`Reproduciendo: ${station.name}${streamMsg}`);
    } catch (error) {
      console.error(
        `Error playing radio ${streamType} stream (attempt ${retryCount + 1}):`,
        error
      );
      setIsLoading(false);
      setIsPlaying(false);

      // Try backup stream if primary fails and we haven't tried backup yet
      if (
        !useBackup &&
        station.backupStreamUrl &&
        retryCount < maxRetries - 1
      ) {
        console.log(`Trying backup stream for ${station.name}`);
        toast.info(`Probando transmisión alternativa...`);
        setTimeout(() => playStation(station, retryCount + 1, true), 1000);
        return;
      }

      // Retry logic for network/streaming errors
      if (retryCount < maxRetries - 1) {
        console.log(
          `Retrying station ${station.name} (attempt ${retryCount + 2})`
        );
        toast.info(
          `Reintentando conexión... (${retryCount + 2}/${maxRetries})`
        );
        setTimeout(() => playStation(station, retryCount + 1, useBackup), 3000);
        return;
      }

      toast.error(
        `Error al reproducir: ${station.name}. Verifica tu conexión a internet.`
      );
    }
  };

  const pauseStation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseStation();
    } else if (currentStation) {
      playStation(currentStation);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Enhanced audio event handlers with better error handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      console.log('Audio load started');
      setIsLoading(true);
    };

    const handleError = (event: Event) => {
      console.error('Audio error:', event);
      setIsLoading(false);
      setIsPlaying(false);

      const target = event.target as HTMLAudioElement;
      let errorMessage = 'Error de conexión con la radio';

      if (target?.error) {
        switch (target.error.code) {
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Error de red. Verifica tu conexión a internet.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Formato de audio no soportado por esta estación.';
            break;
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Reproducción cancelada.';
            break;
          default:
            errorMessage = 'Error desconocido de reproducción.';
        }
      }

      toast.error(errorMessage);
    };

    const handleEnded = () => {
      console.log('Audio ended');
      setIsPlaying(false);
    };

    const handleStalled = () => {
      console.log('Audio stalled - buffering issue');
      setIsLoading(true);
    };

    const handleWaiting = () => {
      console.log('Audio waiting - buffering');
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      console.log('Audio playing successfully');
      setIsLoading(false);
      setIsBuffering(false);
      setIsPlaying(true);
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
      setIsLoading(false);
      setIsBuffering(false);
    };

    const handlePause = () => {
      console.log('Audio paused');
      setIsPlaying(false);
    };

    // Add all event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, []);

  // Stream health monitoring - check every 30 seconds
  useEffect(() => {
    if (!currentStation || !isPlaying) return;

    const healthCheck = setInterval(async () => {
      if (currentStation.backupStreamUrl) {
        const isHealthy = await checkStreamHealth(
          currentStation.streamUrl === audioRef.current?.src
            ? currentStation.streamUrl
            : currentStation.backupStreamUrl
        );

        if (!isHealthy && audioRef.current?.error) {
          console.log('Stream health check failed, attempting failover');
          // If current stream is unhealthy and we're getting errors, try backup
          if (
            currentStation.backupStreamUrl &&
            audioRef.current.src !== currentStation.backupStreamUrl
          ) {
            playStation(currentStation, 0, true);
          }
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(healthCheck);
  }, [currentStation, isPlaying]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      news: 'bg-blue-500',
      music: 'bg-purple-500',
      sports: 'bg-green-500',
      cultural: 'bg-orange-500',
      emergency: 'bg-red-500',
      community: 'bg-indigo-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getQualityBadge = (quality: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      low: 'secondary',
      medium: 'default',
      high: 'default',
    };
    return variants[quality] || 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="none" controls={false} playsInline />

      {/* Now Playing Card */}
      {currentStation && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Radio className="h-5 w-5" />
                Reproduciendo Ahora
              </span>
              {currentStation.isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {currentStation.logoUrl ? (
                  <img
                    src={currentStation.logoUrl}
                    alt={currentStation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Radio className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{currentStation.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentStation.frequency} • {currentStation.region}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMute}
                  className="h-8 w-8 p-0"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={togglePlayPause}
                  disabled={isLoading}
                  className="h-10 w-10 rounded-full"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : isBuffering ? (
                    <div className="animate-pulse">
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-white animate-pulse"></div>
                        <div className="w-1 h-4 bg-white animate-pulse delay-100"></div>
                        <div className="w-1 h-4 bg-white animate-pulse delay-200"></div>
                      </div>
                    </div>
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stations Browser */}
      <Card>
        <CardHeader>
          <CardTitle>Estaciones de Radio Comunitarias</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              {categories.map(category => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs"
                >
                  <category.icon className="h-4 w-4 mr-1" />
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(category => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getStationsByCategory(category.id).map(station => (
                    <Card
                      key={station._id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        currentStation?._id === station._id
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                      onClick={() => playStation(station)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            {station.logoUrl ? (
                              <img
                                src={station.logoUrl}
                                alt={station.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Radio className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">
                                {station.name}
                              </h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {station.frequency} • {station.region}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  variant={getQualityBadge(
                                    (station as any).quality || 'unknown'
                                  )}
                                  className="text-xs"
                                >
                                  {(station as any).quality || 'Desconocida'}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getCategoryColor(station.category)} text-white`}
                                >
                                  {station.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {getStationsByCategory(category.id).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay estaciones disponibles en esta categoría</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicRadioPlayer;
