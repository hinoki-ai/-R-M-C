'use client';
// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

// Force dynamic rendering to avoid prerendering issues

// Force dynamic rendering to avoid prerendering issues

import { useUser } from '@clerk/nextjs';
import { BackButton } from '@/components/shared/back-button';
import { useMutation, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Edit,
  Eye,
  Filter,
  Globe,
  Music,
  Plus,
  Radio,
  Trash2,
  Wifi,
  WifiOff,
  RefreshCcw,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { RadioForm } from '@/components/dashboard/admin/radio-form';
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

interface RadioStation {
  _id: string;
  name: string;
  description?: string;
  streamUrl: string;
  logoUrl?: string;
  frequency?: string;
  category:
    | 'news'
    | 'music'
    | 'sports'
    | 'cultural'
    | 'emergency'
    | 'community';
  region: string;
  isActive: boolean;
  isOnline: boolean;
  quality: 'low' | 'medium' | 'high';
  backupStreamUrl?: string;
  lastChecked?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

const qualityConfig = {
  high: { color: 'text-green-600', label: 'Alta' },
  medium: { color: 'text-yellow-600', label: 'Media' },
  low: { color: 'text-red-600', label: 'Baja' },
};

const categoryConfig = {
  news: { emoji: '📰', color: 'text-blue-600', label: 'Noticias' },
  music: { emoji: '🎵', color: 'text-purple-600', label: 'Música' },
  sports: { emoji: '⚽', color: 'text-green-600', label: 'Deportes' },
  cultural: { emoji: '🎭', color: 'text-pink-600', label: 'Cultural' },
  emergency: { emoji: '🚨', color: 'text-red-600', label: 'Emergencia' },
  community: { emoji: '🏘️', color: 'text-orange-600', label: 'Comunidad' },
};

const regionConfig = {
  Ñuble: 'Ñuble',
  Pinto: 'Pinto',
  Recinto: 'Recinto',
  Nacional: 'Nacional',
};

function AdminRadioContent() {
  const { user } = useUser();
  const allStations = useQuery(api.radio.getAllRadioStations) || [];
  const deleteStation = useMutation(api.radio.deleteRadioStation);
  const updateAllStations = useMutation(api.radio.updateAllRadioStations);
  const loading = allStations === undefined;
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [onlineFilter, setOnlineFilter] = useState<
    'all' | 'online' | 'offline'
  >('all');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | keyof typeof categoryConfig
  >('all');
  const [regionFilter, setRegionFilter] = useState<
    'all' | keyof typeof regionConfig
  >('all');
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(
    null
  );
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

  const filteredStations = allStations.filter((station: any) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'active' && station.isActive) ||
      (filter === 'inactive' && !station.isActive);

    const matchesOnline =
      onlineFilter === 'all' ||
      (onlineFilter === 'online' && station.isOnline) ||
      (onlineFilter === 'offline' && !station.isOnline);

    const matchesCategory =
      categoryFilter === 'all' || station.category === categoryFilter;
    const matchesRegion =
      regionFilter === 'all' || station.region === regionFilter;

    return matchesStatus && matchesOnline && matchesCategory && matchesRegion;
  });

  const handleCreateStation = () => {
    setSelectedStation(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditStation = (station: RadioStation) => {
    setSelectedStation(station);
    setIsEditDialogOpen(true);
  };

  const handleViewStation = (station: RadioStation) => {
    setSelectedStation(station);
    setIsViewDialogOpen(true);
  };

  const handleDeleteStation = async (stationId: string) => {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar esta estación de radio? Esta acción no se puede deshacer.'
      )
    ) {
      try {
        await deleteStation({ stationId: stationId as any });
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting radio station:', error);
        alert(
          'Error al eliminar la estación de radio. Por favor, inténtalo de nuevo.'
        );
      }
    }
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
              Gestión de Estaciones de Radio
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Administra todas las estaciones de radio y configuraciones de
              streaming
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  toast.message('Actualizando URLs de transmisión...');
                  const res = await updateAllStations({});
                  toast.success(res?.message || 'Actualización completada');
                } catch (e) {
                  console.error('Error updating streams:', e);
                  toast.error('Error al actualizar streams');
                }
              }}
              className="flex items-center space-x-2"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Actualizar Streams</span>
            </Button>
            <Button
              onClick={handleCreateStation}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Estación</span>
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-4 flex-wrap gap-2">
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
              value={onlineFilter}
              onValueChange={(value: any) => setOnlineFilter(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="online">En línea</SelectItem>
                <SelectItem value="offline">Fuera de línea</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(value: any) => setCategoryFilter(value)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                <SelectItem value="news">Noticias</SelectItem>
                <SelectItem value="music">Música</SelectItem>
                <SelectItem value="sports">Deportes</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="emergency">Emergencia</SelectItem>
                <SelectItem value="community">Comunidad</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={regionFilter}
              onValueChange={(value: any) => setRegionFilter(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Regiones</SelectItem>
                <SelectItem value="Ñuble">Ñuble</SelectItem>
                <SelectItem value="Pinto">Pinto</SelectItem>
                <SelectItem value="Recinto">Recinto</SelectItem>
                <SelectItem value="Nacional">Nacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Estaciones
              </CardTitle>
              <Radio className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allStations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allStations.filter((s: any) => s.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Línea</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {allStations.filter((s: any) => s.isOnline).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fuera de Línea
              </CardTitle>
              <WifiOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {allStations.filter((s: any) => !s.isOnline).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Calidad Alta
              </CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {allStations.filter((s: any) => s.quality === 'high').length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredStations.length === 0 ? (
            <div className="text-center py-12">
              <Radio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay estaciones de radio
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filter === 'all'
                  ? 'Crea tu primera estación de radio para comenzar.'
                  : 'No hay estaciones que coincidan con los filtros seleccionados.'}
              </p>
              {filter === 'all' && (
                <Button onClick={handleCreateStation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Estación
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStations.map((station: any, index: number) => {
                const category =
                  categoryConfig[
                    station.category as keyof typeof categoryConfig
                  ];
                const quality =
                  qualityConfig[station.quality as keyof typeof qualityConfig];

                return (
                  <motion.div
                    key={station._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`border-l-4 ${station.isOnline ? 'border-l-green-500' : 'border-l-red-500'} hover:shadow-lg transition-shadow`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {station.logoUrl ? (
                              <img
                                src={station.logoUrl}
                                alt={station.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <Radio className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-lg flex items-center space-x-2">
                                <span>{station.name}</span>
                                <span className={category.color}>
                                  {category.emoji}
                                </span>
                              </CardTitle>
                              <CardDescription className="flex items-center space-x-2">
                                <span>
                                  {station.frequency || 'Sin frecuencia'}
                                </span>
                                <span>•</span>
                                <span>{station.region}</span>
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                station.isActive ? 'default' : 'secondary'
                              }
                            >
                              {station.isActive ? 'Activa' : 'Inactiva'}
                            </Badge>
                            <Badge
                              variant={
                                station.isOnline ? 'default' : 'destructive'
                              }
                            >
                              {station.isOnline ? 'En línea' : 'Fuera de línea'}
                            </Badge>
                            <Badge variant="outline" className={quality.color}>
                              {quality.label}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-base mt-2">
                          {station.description || 'Sin descripción'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Globe className="w-4 h-4" />
                              <span>{category.label}</span>
                            </span>
                            {station.lastChecked && (
                              <span className="flex items-center space-x-1">
                                <span>Última verificación:</span>
                                <span>
                                  {new Date(
                                    station.lastChecked
                                  ).toLocaleDateString('es-CL')}
                                </span>
                              </span>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {station.region}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewStation(station as any)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStation(station as any)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteStation(station._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Create Station Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Estación de Radio</DialogTitle>
              <DialogDescription>
                Crea una nueva estación de radio con su configuración de
                streaming.
              </DialogDescription>
            </DialogHeader>
            <RadioForm
              onSuccess={() => setIsCreateDialogOpen(false)}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Station Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Estación de Radio</DialogTitle>
              <DialogDescription>
                Modifica los detalles de la estación de radio seleccionada.
              </DialogDescription>
            </DialogHeader>
            {selectedStation && (
              <RadioForm
                station={selectedStation}
                onSuccess={() => setIsEditDialogOpen(false)}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Station Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vista de la Estación de Radio</DialogTitle>
              <DialogDescription>
                Vista previa completa de la configuración de la estación.
              </DialogDescription>
            </DialogHeader>
            {selectedStation && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {selectedStation.logoUrl ? (
                    <img
                      src={selectedStation.logoUrl}
                      alt={selectedStation.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Radio className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedStation.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedStation.frequency || 'Sin frecuencia'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Categoría</label>
                    <p className="text-gray-600 dark:text-gray-400">
                      {categoryConfig[selectedStation.category].label}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Región</label>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedStation.region}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Calidad</label>
                    <p className="text-gray-600 dark:text-gray-400">
                      {qualityConfig[selectedStation.quality].label}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estado</label>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          selectedStation.isActive ? 'default' : 'secondary'
                        }
                      >
                        {selectedStation.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                      <Badge
                        variant={
                          selectedStation.isOnline ? 'default' : 'destructive'
                        }
                      >
                        {selectedStation.isOnline
                          ? 'En línea'
                          : 'Fuera de línea'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    URL de Streaming
                  </label>
                  <p className="text-gray-600 dark:text-gray-400 break-all">
                    {selectedStation.streamUrl}
                  </p>
                  <div className="mt-2">
                    <audio
                      src={selectedStation.streamUrl}
                      controls
                      preload="none"
                      crossOrigin="anonymous"
                      playsInline
                      className="w-full"
                    />
                  </div>
                </div>

                {selectedStation.backupStreamUrl && (
                  <div>
                    <label className="text-sm font-medium">URL de Backup</label>
                    <p className="text-gray-600 dark:text-gray-400 break-all">
                      {selectedStation.backupStreamUrl}
                    </p>
                  </div>
                )}

                {selectedStation.description && (
                  <div>
                    <label className="text-sm font-medium">Descripción</label>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedStation.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>
                      Creada:{' '}
                      {new Date(selectedStation.createdAt).toLocaleDateString(
                        'es-CL'
                      )}
                    </span>
                    <span>
                      Actualizada:{' '}
                      {new Date(selectedStation.updatedAt).toLocaleDateString(
                        'es-CL'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default function AdminRadioPage() {
  return <AdminRadioContent />;
}
