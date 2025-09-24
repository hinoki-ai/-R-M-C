'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import {
  IconGridDots,
  IconLayoutGrid,
  IconMaximize,
  IconMinimize,
  IconRefresh,
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { CameraViewer } from './camera-viewer';

interface Camera {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  isActive: boolean;
  isOnline: boolean;
  lastSeen?: number;
  resolution?: string;
  frameRate?: number;
  hasAudio?: boolean;
  streamUrl?: string;
}

interface CameraFeed {
  _id: string;
  cameraId: string;
  url: string;
  isActive: boolean;
  lastAccessed?: number;
  createdAt: number;
}

interface MultiCameraViewerProps {
  camera: Camera;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  onEvent?: (event: string, data?: Record<string, unknown>) => void;
}

type GridLayout = '1x1' | '2x1' | '2x2' | '3x1' | '3x2' | '4x1' | '4x2' | '5x1';

export function MultiCameraViewer({
  camera,
  className,
  showControls = true,
  autoPlay = false,
  onEvent,
}: MultiCameraViewerProps) {
  const [layout, setLayout] = useState<GridLayout>('2x2');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch camera feeds
  const feeds =
    useQuery(api.cameras.getCameraFeeds, {
      cameraId: camera._id as Id<'cameras'>,
    }) || [];

  // Filter active feeds
  const activeFeeds = feeds.filter(feed => feed.isActive);

  // Auto-select appropriate layout based on number of feeds
  useEffect(() => {
    if (activeFeeds.length === 1) {
      setLayout('1x1');
    } else if (activeFeeds.length === 2) {
      setLayout('2x1');
    } else if (activeFeeds.length === 3) {
      setLayout('3x1');
    } else if (activeFeeds.length === 4) {
      setLayout('2x2');
    } else if (activeFeeds.length === 5) {
      setLayout('5x1');
    }
  }, [activeFeeds.length]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    onEvent?.('refresh', {
      cameraId: camera._id,
      feedsCount: activeFeeds.length,
    });
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    onEvent?.(isFullscreen ? 'exit_fullscreen' : 'enter_fullscreen', {
      cameraId: camera._id,
      feedsCount: activeFeeds.length,
    });
  };

  const getGridClassName = (layout: GridLayout) => {
    switch (layout) {
      case '1x1':
        return 'grid-cols-1';
      case '2x1':
        return 'grid-cols-1 sm:grid-cols-2';
      case '2x2':
        return 'grid-cols-2';
      case '3x1':
        return 'grid-cols-1 sm:grid-cols-3';
      case '3x2':
        return 'grid-cols-2 sm:grid-cols-3';
      case '4x1':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      case '4x2':
        return 'grid-cols-2 sm:grid-cols-4';
      case '5x1':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';
      default:
        return 'grid-cols-2';
    }
  };

  const getFeedName = (feed: CameraFeed, index: number) => {
    // Try to extract camera number from URL or use default naming
    const urlParts = feed.url.split('/');
    const lastPart =
      urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || '';
    const cameraNumber = lastPart.match(/(\d+)/)?.[1] || (index + 1).toString();

    return `${camera.name} - Cam ${cameraNumber}`;
  };

  // Create feed cameras from the main camera and feeds
  const feedCameras: Camera[] = activeFeeds.map((feed, index) => ({
    ...camera,
    _id: `${camera._id}_feed_${feed._id}`,
    name: getFeedName(feed, index),
    streamUrl: feed.url,
  }));

  return (
    <Card
      className={cn(
        'overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <IconGridDots className="h-5 w-5" />
            {camera.name}
            <Badge variant="outline" className="ml-2">
              {activeFeeds.length}{' '}
              {activeFeeds.length === 1 ? 'Camera' : 'Cameras'}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${camera.isActive ? 'bg-green-500' : 'bg-gray-500'}`}
            />
            <Badge variant={camera.isActive ? 'default' : 'secondary'}>
              {camera.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          {camera.location && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📍 {camera.location}
            </p>
          )}
          {activeFeeds.length > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-500">Layout:</span>
              <Select
                value={layout}
                onValueChange={(value: GridLayout) => setLayout(value)}
              >
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1x1">1×1</SelectItem>
                  <SelectItem value="2x1">2×1</SelectItem>
                  <SelectItem value="2x2">2×2</SelectItem>
                  <SelectItem value="3x1">3×1</SelectItem>
                  <SelectItem value="3x2">3×2</SelectItem>
                  <SelectItem value="4x1">4×1</SelectItem>
                  <SelectItem value="4x2">4×2</SelectItem>
                  <SelectItem value="5x1">5×1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          {/* Camera Feed Grid */}
          <div className={cn('grid gap-2 p-4', getGridClassName(layout))}>
            {feedCameras.map(feedCamera => (
              <div key={feedCamera._id} className="min-h-[200px]">
                <CameraViewer
                  camera={feedCamera}
                  showControls={false}
                  autoPlay={autoPlay}
                  className="h-full"
                  onEvent={(event, data) => {
                    onEvent?.(event, { ...data, feedId: feedCamera._id });
                  }}
                />
              </div>
            ))}

            {/* Placeholder for inactive feeds or empty slots */}
            {activeFeeds.length === 0 && (
              <div className="col-span-full flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <IconGridDots className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    No active camera feeds configured
                  </p>
                  <p className="text-sm text-gray-500">
                    Add camera feeds to start viewing
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          {showControls && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <IconRefresh className="h-4 w-4" />
                  </Button>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {activeFeeds.length} active feed
                    {activeFeeds.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFullscreenToggle}
                  >
                    {isFullscreen ? (
                      <IconMinimize className="h-4 w-4" />
                    ) : (
                      <IconMaximize className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
