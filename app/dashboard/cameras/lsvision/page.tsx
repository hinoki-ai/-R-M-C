'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CameraViewer } from '@/components/camera/camera-viewer';
import { MultiCameraViewer } from '@/components/camera/multi-camera-viewer';
import { api } from '@/convex/_generated/api';
import {
  IconCamera,
  IconWifi,
  IconWifiOff,
  IconAlertCircle,
  IconServer,
  IconBroadcast,
  IconEye,
  IconCpu,
} from '@tabler/icons-react';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default function LSVisionCamerasPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch all cameras and filter for LS Vision cameras
  const cameras = useQuery(api.cameras.getCameras) || [];
  const lsvisionCameras = cameras.filter(
    camera =>
      camera.name.toLowerCase().includes('lsvision') ||
      camera.name.toLowerCase().includes('ls vision')
  );

  // Fetch feeds for all LS Vision cameras
  const cameraFeedsMap =
    useQuery(
      api.cameras.getCamerasWithFeeds,
      lsvisionCameras.length > 0
        ? { cameraIds: lsvisionCameras.map(c => c._id) }
        : 'skip'
    ) || {};

  // Refresh camera status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <IconCamera className="h-8 w-8 text-blue-600" />
          Cámaras de Seguridad - LS Vision
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sistema de vigilancia comunitaria vía O-Kamm - Solo visualización
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <IconServer className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{lsvisionCameras.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cámaras Total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <IconWifi className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {lsvisionCameras.filter(c => c.isOnline).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  En Línea
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <IconBroadcast className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">HLS</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Protocolo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <IconEye className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">O-Kamm</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Proveedor
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {lsvisionCameras.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconAlertCircle className="h-5 w-5 text-yellow-500" />
              Configuración Pendiente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                No hay cámaras LS Vision configuradas en el sistema. Para
                agregar cámaras, configura los UIDs de O-Kamm:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                <div className="font-mono text-sm">
                  <span className="text-gray-500">
                    # Para múltiples cámaras:
                  </span>
                  <br />
                  <span className="text-blue-600">
                    LSVISION_UID_1=VE4386930MLXU
                  </span>
                  <br />
                  <span className="text-blue-600">
                    LSVISION_UID_2=XXXXXXXXXXXX
                  </span>
                  <br />
                  <span className="text-blue-600">
                    LSVISION_UID_3=YYYYYYYYYYYY
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Especificaciones Técnicas:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>
                    • <strong>Protocolo:</strong> HLS (HTTP Live Streaming)
                  </li>
                  <li>
                    • <strong>Proveedor:</strong> O-Kamm Cloud Platform
                  </li>
                  <li>
                    • <strong>Acceso:</strong> Solo visualización (View-Only)
                  </li>
                  <li>
                    • <strong>Latencia:</strong> 3-5 segundos (típica)
                  </li>
                  <li>
                    • <strong>Compatibilidad:</strong> Todos los navegadores
                    modernos
                  </li>
                </ul>
              </div>
              <Button onClick={handleRefresh} variant="outline">
                <IconCpu className="h-4 w-4 mr-2" />
                Escanear Cámaras
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Camera Grid */}
          <div className="grid grid-cols-1 gap-6">
            {lsvisionCameras.map(camera => {
              const feeds = cameraFeedsMap[camera._id] || [];
              const activeFeeds = feeds.filter(feed => feed.isActive);
              const hasMultipleFeeds = activeFeeds.length > 1;

              return (
                <div key={camera._id} className="space-y-4">
                  {/* Camera Header */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <IconCamera className="h-5 w-5 text-blue-600" />
                          {camera.name}
                          {hasMultipleFeeds && (
                            <Badge variant="outline" className="ml-2">
                              {activeFeeds.length} Cameras
                            </Badge>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              camera.isOnline ? 'default' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {camera.isOnline ? (
                              <>
                                <IconWifi className="h-3 w-3 mr-1" />
                                Online
                              </>
                            ) : (
                              <>
                                <IconWifiOff className="h-3 w-3 mr-1" />
                                Offline
                              </>
                            )}
                          </Badge>
                          <Badge
                            variant={camera.isActive ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {camera.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Technical Specs */}
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium text-gray-500">
                            Ubicación:
                          </span>
                          <p className="text-gray-900 dark:text-gray-100">
                            {camera.location || 'Centro Comunitario'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">
                            Resolución:
                          </span>
                          <p className="text-gray-900 dark:text-gray-100">
                            {camera.resolution || '1920x1080'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">
                            Frame Rate:
                          </span>
                          <p className="text-gray-900 dark:text-gray-100">
                            {camera.frameRate || 30} FPS
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">
                            Cámaras:
                          </span>
                          <p className="text-gray-900 dark:text-gray-100">
                            {activeFeeds.length} activas
                          </p>
                        </div>
                      </div>

                      {/* Stream Quality Indicator */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Calidad de Stream</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            HD 1080p
                          </span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Feed */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Live Feed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {camera.isOnline && camera.isActive ? (
                        <div className="space-y-4">
                          {hasMultipleFeeds ? (
                            <MultiCameraViewer
                              camera={{
                                _id: camera._id,
                                name: camera.name,
                                description: camera.description,
                                location: camera.location,
                                isActive: camera.isActive,
                                isOnline: camera.isOnline,
                                lastSeen: camera.lastSeen,
                                resolution: camera.resolution,
                                frameRate: camera.frameRate,
                                hasAudio: camera.hasAudio,
                                streamUrl: camera.streamUrl,
                              }}
                              showControls={true}
                              autoPlay={true}
                              className="w-full"
                            />
                          ) : (
                            <CameraViewer
                              camera={{
                                _id: camera._id,
                                name: camera.name,
                                description: camera.description,
                                location: camera.location,
                                isActive: camera.isActive,
                                isOnline: camera.isOnline,
                                lastSeen: camera.lastSeen,
                                resolution: camera.resolution,
                                frameRate: camera.frameRate,
                                hasAudio: camera.hasAudio,
                                streamUrl: camera.streamUrl,
                              }}
                              showControls={true}
                              autoPlay={true}
                              className="w-full"
                            />
                          )}

                          {/* Technical Stream Info */}
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="font-medium text-gray-500">
                                  Protocol:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                  HLS / O-Kamm
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">
                                  Latency:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                  ~3-5s
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">
                                  Codec:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                  H.264
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">
                                  Bitrate:
                                </span>
                                <p className="text-gray-900 dark:text-gray-100">
                                  2-4 Mbps
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <div className="text-center">
                            <IconCamera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              Camera {camera.isOnline ? 'Inactive' : 'Offline'}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              O-Kamm Stream Unavailable
                            </Badge>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* System Status Footer */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Sistema de Vigilancia LS Vision
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Monitoreo comunitario en tiempo real vía plataforma O-Kamm
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {lsvisionCameras.filter(c => c.isOnline).length}/
                    {lsvisionCameras.length}
                  </div>
                  <p className="text-xs text-gray-500">Cámaras Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
