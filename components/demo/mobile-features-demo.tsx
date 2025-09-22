'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TouchButton } from '@/components/ui/touch-button';
import { TouchCard } from '@/components/ui/touch-card';
import { useOfflineFirst } from '@/hooks/use-offline-first';

import { usePerformanceAnimations } from '@/hooks/use-performance-animations';

export function MobileFeaturesDemo() {
  const [demoState, setDemoState] = useState({
    counter: 0,
    lastAction: '',
    animations: 0,
  });

  const counterRef = useRef<HTMLDivElement>(null);
  const { fadeIn, scale, isReducedMotion, metrics, useIntersectionAnimation } = usePerformanceAnimations();
  const { isOnline, isSlowConnection, wasOffline, queueForSync, offlineFetch } = useOfflineFirst();

  const { ref: demoRef, isVisible } = useIntersectionAnimation(0.5) as { ref: React.RefObject<HTMLDivElement>, isVisible: boolean };

  // Animate counter on mount
  useEffect(() => {
    if (isVisible && counterRef.current && !isReducedMotion) {
      fadeIn(counterRef.current, 800);
    }
  }, [isVisible, fadeIn, isReducedMotion]);

  const handleCounterIncrement = async () => {
    setDemoState(prev => ({ ...prev, counter: prev.counter + 1, lastAction: 'Incremented' }));

    if (counterRef.current) {
      await scale(counterRef.current, 1.1, 150);
      await scale(counterRef.current, 1, 150);
    }
  };

  const handleSwipeDemo = (direction: string) => {
    setDemoState(prev => ({
      ...prev,
      animations: prev.animations + 1,
      lastAction: `Swiped ${direction}`
    }));
  };

  const handleOfflineAction = () => {
    queueForSync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Offline action completed');
    });
  };

  return (
    <div ref={demoRef} className='space-y-6 p-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            📱 Mobile-First Features Demo
            {!isOnline && <Badge variant='destructive'>Offline</Badge>}
            {isSlowConnection && <Badge variant='secondary'>Slow Connection</Badge>}
          </CardTitle>
          <CardDescription>
            Experience native mobile interactions with performance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Performance Metrics */}
          <div className='grid grid-cols-2 gap-4'>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-2xl font-bold'>{metrics.fps}</div>
                <p className='text-xs text-muted-foreground'>FPS</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-2xl font-bold'>{metrics.frameTime.toFixed(1)}ms</div>
                <p className='text-xs text-muted-foreground'>Frame Time</p>
              </CardContent>
            </Card>
          </div>

          {/* Touch Button Demo */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Touch Interactions</h3>
            <div className='flex flex-wrap gap-3'>
              <TouchButton
                variant='gradientPrimary'
                haptic='medium'
                onLongPress={() => setDemoState(prev => ({ ...prev, lastAction: 'Long Press!' }))}
                className='min-w-[120px]'
              >
                Long Press Me
              </TouchButton>

              <TouchButton
                variant='gradientOcean'
                haptic='light'
                onClick={handleCounterIncrement}
              >
                Increment
              </TouchButton>

              <TouchButton
                variant='outline'
                enableRipple={false}
                onClick={handleOfflineAction}
              >
                Queue Action
              </TouchButton>
            </div>
          </div>

          {/* Counter Display */}
          <div
            ref={counterRef}
            className='text-center p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg'
          >
            <div className='text-4xl font-bold text-primary mb-2'>{demoState.counter}</div>
            <p className='text-sm text-muted-foreground'>{demoState.lastAction}</p>
          </div>

          {/* Swipe Cards Demo */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Swipe Gestures</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <TouchCard
                onSwipeLeft={() => handleSwipeDemo('Left')}
                onSwipeRight={() => handleSwipeDemo('Right')}
                className='p-6'
              >
                <h4 className='font-semibold mb-2'>Swipe Card</h4>
                <p className='text-sm text-muted-foreground'>
                  Swipe left or right to trigger actions
                </p>
              </TouchCard>

              <TouchCard
                onSwipeUp={() => handleSwipeDemo('Up')}
                onSwipeDown={() => handleSwipeDemo('Down')}
                className='p-6'
              >
                <h4 className='font-semibold mb-2'>Vertical Swipe</h4>
                <p className='text-sm text-muted-foreground'>
                  Swipe up or down for different actions
                </p>
              </TouchCard>
            </div>
          </div>

          {/* Offline Features */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Offline Capabilities</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Card>
                <CardContent className='pt-6'>
                  <div className={`text-2xl ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                    {isOnline ? '🟢' : '🔴'}
                  </div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='text-2xl text-blue-500'>⚡</div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    {isSlowConnection ? 'Slow' : 'Fast'} Connection
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='text-2xl text-purple-500'>{demoState.animations}</div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    Animations Triggered
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Status Messages */}
          <div className='text-center space-y-2'>
            {wasOffline && (
              <Badge variant='outline' className='animate-pulse'>
                🔄 Back Online - Syncing...
              </Badge>
            )}
            {isReducedMotion && (
              <Badge variant='secondary'>
                ♿ Reduced Motion Enabled
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}