'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Radio, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

interface RadioStation {
  _id: string;
  name: string;
  description?: string;
  streamUrl: string;
  logoUrl?: string;
  frequency?: string;
  category: string;
  region: string;
  isActive?: boolean;
  isOnline?: boolean;
  quality?: string;
  lastChecked?: number;
  createdAt?: number;
  isFavorite?: boolean;
  lastPlayed?: number;
  playCount?: number;
}

const RadioPlayer: React.FC = () => {
  const { user } = useUser();
  const audioRef = useRef<HTMLAudioElement>(null);

  // State management
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Convex queries and mutations
  const allStations = useQuery(api.radio.getRadioStations) || [];
  const userFavorites = useQuery(api.radio.getUserFavorites, { userId: user?.id as any }) || [];
  const toggleFavorite = useMutation(api.radio.toggleFavorite);
  const recordPlay = useMutation(api.radio.recordPlay);

  // Get stations by category
  const getStationsByCategory = (category: string) => {
    if (category === 'favorites') return userFavorites;
    if (category === 'all') return allStations;
    return allStations.filter(station => station.category === category);
  };

  const categories = [
    { id: 'all', label: 'Todas', icon: Radio },
    { id: 'news', label: 'Noticias', icon: Radio },
    { id: 'music', label: 'Música', icon: Radio },
    { id: 'cultural', label: 'Cultural', icon: Radio },
    { id: 'emergency', label: 'Emergencia', icon: Radio },
    { id: 'favorites', label: 'Favoritas', icon: Heart },
  ];

  // Audio controls
  const playStation = async (station: RadioStation) => {
    if (!audioRef.current || !user?.id) return;

    try {
      setIsLoading(true);

      if (currentStation?._id !== station._id) {
        audioRef.current.src = station.streamUrl;
        setCurrentStation(station);
        // Record play event
        await recordPlay({ userId: user.id as any, stationId: station._id as any });
      }

      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
      toast.success(`Reproduciendo: ${station.name}`);
    } catch (error) {
      console.error('Error playing radio:', error);
      setIsLoading(false);
      toast.error('Error al reproducir la estación');
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

  const handleFavoriteToggle = async (station: RadioStation) => {
    if (!user?.id) return;

    try {
      const result = await toggleFavorite({
        userId: user.id as any,
        stationId: station._id as any,
      });

      toast.success(result.isFavorite ? 'Agregado a favoritos' : 'Removido de favoritos');
    } catch (error) {
      toast.error('Error al actualizar favoritos');
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      toast.error('Error de conexión con la radio');
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, []);

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
      <audio ref={audioRef} preload="none" />

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
          <CardTitle>Estaciones de Radio</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  <category.icon className="h-4 w-4 mr-1" />
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getStationsByCategory(category.id).map((station) => (
                    <Card
                      key={station._id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        currentStation?._id === station._id ? 'ring-2 ring-primary' : ''
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
                              <h4 className="font-medium truncate">{station.name}</h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {station.frequency} • {station.region}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={getQualityBadge(station.quality || 'unknown')} className="text-xs">
                                  {station.quality || 'Desconocida'}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${getCategoryColor(station.category)} text-white`}>
                                  {station.category}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            {category.id === 'favorites' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFavoriteToggle(station);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                              </Button>
                            )}
                            {category.id !== 'favorites' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFavoriteToggle(station);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    station.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                                  }`}
                                />
                              </Button>
                            )}
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

export default RadioPlayer;