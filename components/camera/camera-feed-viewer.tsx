'use client';

import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CameraFeedViewerProps {
  cameraId: string;
  location: string;
  className?: string;
}

export function CameraFeedViewer({
  cameraId,
  location,
  className
}: CameraFeedViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setConnectionStatus('connecting');
    const handleCanPlay = () => setConnectionStatus('connected');
    const handleError = () => setConnectionStatus('error');

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);


    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  return (
    <Card className={className}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>Camera {cameraId}</CardTitle>
          <div className='flex items-center gap-2'>
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
              {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting' : 'Offline'}
            </Badge>
          </div>
        </div>
        <p className='text-sm text-muted-foreground'>{location}</p>
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className='relative bg-black rounded-lg overflow-hidden'>
          <video
            ref={videoRef}
            className='w-full h-48 object-cover'
            muted={isMuted}
            playsInline
          >
            Your browser does not support the video tag.
          </video>


          {/* Controls overlay */}
          <div className='absolute bottom-2 left-2 flex gap-2'>
            <Button
              size='sm'
              variant='secondary'
              onClick={togglePlayback}
              className='bg-black/50 hover:bg-black/70 border-0'
            >
              {isPlaying ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
            </Button>

            <Button
              size='sm'
              variant='secondary'
              onClick={toggleMute}
              className='bg-black/50 hover:bg-black/70 border-0'
            >
              {isMuted ? <VolumeX className='w-4 h-4' /> : <Volume2 className='w-4 h-4' />}
            </Button>

            <Button
              size='sm'
              variant='secondary'
              onClick={toggleFullscreen}
              className='bg-black/50 hover:bg-black/70 border-0'
            >
              <Maximize className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Status indicators */}
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>Real-time neighborhood monitoring</span>
          <span>Controlled from original app</span>
        </div>

        {/* Camera info */}
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-medium'>Resolution:</span>
            <span className='ml-2'>1080p</span>
          </div>
          <div>
            <span className='font-medium'>Night Vision:</span>
            <span className='ml-2 text-green-600'>✓ Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}