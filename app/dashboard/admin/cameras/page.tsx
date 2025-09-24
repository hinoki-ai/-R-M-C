'use client';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import { BackButton } from '@/components/shared/back-button';
import { useMutation, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Edit,
  Eye,
  Filter,
  Plus,
  Trash2,
  Wifi,
  WifiOff,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

import { CameraForm } from '@/components/dashboard/admin/camera-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';

interface Camera {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  streamUrl: string;
  isActive: boolean;
  isOnline: boolean;
  lastSeen?: number;
  resolution?: string;
  frameRate?: number;
  hasAudio?: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

const statusConfig = {
  online: {
    color: 'border-green-500 bg-green-50 dark:bg-green-950/20',
    icon: Wifi,
    badge: 'En línea',
  },
  offline: {
    color: 'border-red-500 bg-red-50 dark:bg-red-950/20',
    icon: WifiOff,
    badge: 'Fuera de línea',
  },
  inactive: {
    color: 'border-gray-500 bg-gray-50 dark:bg-gray-950/20',
    icon: Settings,
    badge: 'Inactiva',
  },
};

function AdminCamerasContent() {
  const { user } = useUser();
  const allCameras = useQuery(api.cameras.getAllCameras) || [];
  const deleteCamera = useMutation(api.cameras.deleteCamera);
  const loading = allCameras === undefined;
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'online' | 'offline' | 'inactive'
  >('all');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Acceso Denegado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Solo los administradores pueden acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  const getCameraStatus = (camera: Camera) => {
    if (!camera.isActive) return 'inactive';
    return camera.isOnline ? 'online' : 'offline';
  };

  const filteredCameras = allCameras.filter((camera: any) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'active' && camera.isActive) ||
      (filter === 'inactive' && !camera.isActive);

    const cameraStatus = getCameraStatus(camera);
    const matchesOnlineStatus =
      statusFilter === 'all' || cameraStatus === statusFilter;

    return matchesStatus && matchesOnlineStatus;
  });

  const handleCreateCamera = () => {
    setSelectedCamera(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditCamera = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsEditDialogOpen(true);
  };

  const handleViewCamera = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsViewDialogOpen(true);
  };

  const handleDeleteCamera = async (cameraId: string) => {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar esta cámara? Esta acción no se puede deshacer.'
      )
    ) {
      try {
        await deleteCamera({ cameraId: cameraId as any });
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting camera:', error);
        alert('Error al eliminar la cámara. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return 'Nunca';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Ahora mismo';
  };

  return (
    <>
      <BackButton className="mb-6" />
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Cámaras
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Administra todas las cámaras de seguridad del sistema
            </p>
          </div>
          <Button
            onClick={handleCreateCamera}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Cámara</span>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Cámaras
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : allCameras.length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    En Línea
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {loading
                      ? '...'
                      : allCameras.filter((c: any) => c.isOnline && c.isActive)
                          .length}
                  </p>
                </div>
                <Wifi className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Fuera de Línea
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {loading
                      ? '...'
                      : allCameras.filter((c: any) => !c.isOnline && c.isActive)
                          .length}
                  </p>
                </div>
                <WifiOff className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Inactivas
                  </p>
                  <p className="text-2xl font-bold text-gray-600">
                    {loading
                      ? '...'
                      : allCameras.filter((c: any) => !c.isActive).length}
                  </p>
                </div>
                <Settings className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filtros:
              </span>
            </div>

            <Select
              value={filter}
              onValueChange={(value: any) => setFilter(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="online">En Línea</SelectItem>
                <SelectItem value="offline">Fuera de Línea</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Cameras Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCameras.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No se encontraron cámaras
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === 'all' && statusFilter === 'all'
                  ? 'No hay cámaras registradas en el sistema'
                  : 'No hay cámaras que coincidan con los filtros seleccionados'}
              </p>
              <Button onClick={handleCreateCamera}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Cámara
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCameras.map((camera: any, index: number) => {
                const status = getCameraStatus(camera);
                const statusInfo = statusConfig[status];

                return (
                  <div className="space-y-6">
                    <motion.div
                      key={camera._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {camera.name}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`${statusInfo.color} border`}
                            >
                              {statusInfo.badge}
                            </Badge>
                          </div>
                          <CardDescription>
                            {camera.description || 'Sin descripción'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Ubicación:
                              </span>
                              <span>
                                {camera.location || 'No especificada'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Última vez visto:
                              </span>
                              <span>{formatLastSeen(camera.lastSeen)}</span>
                            </div>
                            {camera.resolution && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Resolución:
                                </span>
                                <span>{camera.resolution}</span>
                              </div>
                            )}
                            {camera.hasAudio && (
                              <Badge variant="outline" className="text-xs">
                                Audio
                              </Badge>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCamera(camera)}
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCamera(camera)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCamera(camera._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Create/Edit Dialogs */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Cámara</DialogTitle>
              <DialogDescription>
                Agrega una nueva cámara de seguridad al sistema.
              </DialogDescription>
            </DialogHeader>
            <CameraForm
              onSuccess={() => setIsCreateDialogOpen(false)}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Cámara</DialogTitle>
              <DialogDescription>
                Modifica la configuración de la cámara seleccionada.
              </DialogDescription>
            </DialogHeader>
            {selectedCamera && (
              <CameraForm
                camera={selectedCamera}
                onSuccess={() => setIsEditDialogOpen(false)}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles de la Cámara</DialogTitle>
              <DialogDescription>
                Información completa de la cámara seleccionada.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedCamera && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Nombre:</h4>
                    <p>{selectedCamera.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Descripción:</h4>
                    <p>{selectedCamera.description || 'Sin descripción'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Ubicación:</h4>
                    <p>{selectedCamera.location || 'No especificada'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">URL del Stream:</h4>
                    <p className="font-mono text-sm break-all">
                      {selectedCamera.streamUrl}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default function AdminCamerasPage() {
  return <AdminCamerasContent />;
}
