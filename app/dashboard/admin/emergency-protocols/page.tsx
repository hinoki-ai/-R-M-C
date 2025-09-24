'use client';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import { BackButton } from '@/components/shared/back-button';
import { useMutation, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Plus,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { EmergencyProtocolForm } from '@/components/dashboard/admin/emergency-protocol-form';
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

interface EmergencyProtocol {
  _id: string;
  title: string;
  description: string;
  category:
    | 'fire'
    | 'medical'
    | 'police'
    | 'natural_disaster'
    | 'security'
    | 'evacuation'
    | 'general';
  priority: 'critical' | 'high' | 'medium' | 'low';
  pdfUrl: string;
  thumbnailUrl?: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    role: string;
  }>;
  steps: string[];
  isActive: boolean;
  offlineAvailable: boolean;
  downloadCount: number;
  lastDownloaded?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

const priorityConfig = {
  critical: {
    color: 'border-red-500 bg-red-50 dark:bg-red-950/20',
    icon: AlertTriangle,
    badge: 'Crítico',
  },
  high: {
    color: 'border-red-500 bg-red-50 dark:bg-red-950/20',
    icon: AlertTriangle,
    badge: 'Urgente',
  },
  medium: {
    color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
    icon: FileText,
    badge: 'Importante',
  },
  low: {
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
    icon: FileText,
    badge: 'Información',
  },
};

const categoryConfig = {
  fire: { emoji: '🚒', color: 'text-red-600', label: 'Incendio' },
  medical: { emoji: '🚑', color: 'text-blue-600', label: 'Médico' },
  police: { emoji: '🚔', color: 'text-purple-600', label: 'Policial' },
  natural_disaster: {
    emoji: '🌪️',
    color: 'text-orange-600',
    label: 'Desastre Natural',
  },
  security: { emoji: '🔒', color: 'text-gray-600', label: 'Seguridad' },
  evacuation: { emoji: '🏃‍♂️', color: 'text-green-600', label: 'Evacuación' },
  general: { emoji: '📋', color: 'text-slate-600', label: 'General' },
};

function AdminEmergencyProtocolsContent() {
  const { user } = useUser();
  const allProtocols =
    useQuery(api.emergency_protocols.getAllEmergencyProtocols) || [];
  const deleteProtocol = useMutation(
    api.emergency_protocols.deleteEmergencyProtocol
  );
  const loading = allProtocols === undefined;
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [priorityFilter, setPriorityFilter] = useState<
    'all' | 'low' | 'medium' | 'high' | 'critical'
  >('all');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | keyof typeof categoryConfig
  >('all');
  const [selectedProtocol, setSelectedProtocol] =
    useState<EmergencyProtocol | null>(null);
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

  const filteredProtocols = allProtocols.filter((protocol: any) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'active' && protocol.isActive) ||
      (filter === 'inactive' && !protocol.isActive);

    const matchesPriority =
      priorityFilter === 'all' || protocol.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === 'all' || protocol.category === categoryFilter;

    return matchesStatus && matchesPriority && matchesCategory;
  });

  const handleCreateProtocol = () => {
    setSelectedProtocol(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditProtocol = (protocol: EmergencyProtocol) => {
    setSelectedProtocol(protocol);
    setIsEditDialogOpen(true);
  };

  const handleViewProtocol = (protocol: EmergencyProtocol) => {
    setSelectedProtocol(protocol);
    setIsViewDialogOpen(true);
  };

  const handleDeleteProtocol = async (protocolId: string) => {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este protocolo de emergencia? Esta acción no se puede deshacer.'
      )
    ) {
      try {
        await deleteProtocol({ protocolId: protocolId as any });
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting protocol:', error);
        alert('Error al eliminar el protocolo. Por favor, inténtalo de nuevo.');
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
              Gestión de Protocolos de Emergencia
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Administra todos los protocolos de emergencia y respuesta para la
              comunidad
            </p>
          </div>
          <Button
            onClick={handleCreateProtocol}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Protocolo</span>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value: any) => setPriorityFilter(value)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Prioridades</SelectItem>
                <SelectItem value="critical">Críticas</SelectItem>
                <SelectItem value="high">Altas</SelectItem>
                <SelectItem value="medium">Medias</SelectItem>
                <SelectItem value="low">Bajas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(value: any) => setCategoryFilter(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Categorías</SelectItem>
                <SelectItem value="fire">Incendio</SelectItem>
                <SelectItem value="medical">Médico</SelectItem>
                <SelectItem value="police">Policial</SelectItem>
                <SelectItem value="natural_disaster">
                  Desastre Natural
                </SelectItem>
                <SelectItem value="security">Seguridad</SelectItem>
                <SelectItem value="evacuation">Evacuación</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Protocolos
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allProtocols.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {allProtocols.filter((p: any) => p.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Prioridad Alta
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {
                  allProtocols.filter(
                    (p: any) =>
                      p.priority === 'high' || p.priority === 'critical'
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Descargas Totales
              </CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {allProtocols.reduce(
                  (acc: number, p: any) => acc + p.downloadCount,
                  0
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Protocols List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredProtocols.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay protocolos
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filter === 'all'
                  ? 'Crea tu primer protocolo de emergencia para comenzar.'
                  : 'No hay protocolos que coincidan con los filtros seleccionados.'}
              </p>
              {filter === 'all' && (
                <Button onClick={handleCreateProtocol}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Protocolo
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProtocols.map((protocol: any, index: number) => {
                const priority =
                  priorityConfig[
                    protocol.priority as keyof typeof priorityConfig
                  ];
                const category =
                  categoryConfig[
                    protocol.category as keyof typeof categoryConfig
                  ];
                const PriorityIcon = priority.icon;

                return (
                  <motion.div
                    key={protocol._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`border-l-4 ${priority.color} hover:shadow-lg transition-shadow`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <PriorityIcon
                              className={`w-6 h-6 ${priority.color.includes('red') ? 'text-red-600' : priority.color.includes('yellow') ? 'text-yellow-600' : 'text-blue-600'}`}
                            />
                            <div>
                              <CardTitle className="text-lg flex items-center space-x-2">
                                <span>{protocol.title}</span>
                                <span className={category.color}>
                                  {category.emoji}
                                </span>
                              </CardTitle>
                              <CardDescription className="text-base mt-1">
                                {protocol.description.length > 150
                                  ? `${protocol.description.substring(0, 150)}...`
                                  : protocol.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                protocol.isActive ? 'default' : 'secondary'
                              }
                            >
                              {protocol.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                            {protocol.offlineAvailable && (
                              <Badge variant="outline" className="text-xs">
                                Sin conexión
                              </Badge>
                            )}
                            {protocol.priority === 'high' ||
                            protocol.priority === 'critical' ? (
                              <Badge variant="destructive">
                                {priority.badge}
                              </Badge>
                            ) : null}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>{protocol.downloadCount} descargas</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>Contactos:</span>
                              <span className="font-medium">
                                {protocol.emergencyContacts.length}
                              </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>Pasos:</span>
                              <span className="font-medium">
                                {protocol.steps.length}
                              </span>
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {category.label}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewProtocol(protocol as any)
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEditProtocol(protocol as any)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProtocol(protocol._id)}
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

        {/* Create Protocol Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Protocolo de Emergencia</DialogTitle>
              <DialogDescription>
                Crea un nuevo protocolo de emergencia con contactos y
                instrucciones detalladas.
              </DialogDescription>
            </DialogHeader>
            <EmergencyProtocolForm
              onSuccess={() => setIsCreateDialogOpen(false)}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Protocol Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Protocolo de Emergencia</DialogTitle>
              <DialogDescription>
                Modifica los detalles del protocolo de emergencia seleccionado.
              </DialogDescription>
            </DialogHeader>
            {selectedProtocol && (
              <EmergencyProtocolForm
                protocol={selectedProtocol}
                onSuccess={() => setIsEditDialogOpen(false)}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Protocol Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vista del Protocolo de Emergencia</DialogTitle>
              <DialogDescription>
                Vista completa del protocolo de emergencia.
              </DialogDescription>
            </DialogHeader>
            {selectedProtocol && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {selectedProtocol.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {selectedProtocol.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-4">
                    <Badge variant="outline">
                      {categoryConfig[selectedProtocol.category].label}
                    </Badge>
                    <Badge
                      variant={
                        selectedProtocol.priority === 'high' ||
                        selectedProtocol.priority === 'critical'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {priorityConfig[selectedProtocol.priority].badge}
                    </Badge>
                    <Badge
                      variant={
                        selectedProtocol.isActive ? 'default' : 'secondary'
                      }
                    >
                      {selectedProtocol.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {selectedProtocol.offlineAvailable && (
                      <Badge variant="outline">Disponible sin conexión</Badge>
                    )}
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Contactos de Emergencia
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProtocol.emergencyContacts.map(
                      (contact, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {contact.role}
                          </div>
                          <div className="text-sm font-mono">
                            {contact.phone}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Instrucciones Paso a Paso
                  </h4>
                  <div className="space-y-3">
                    {selectedProtocol.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <span>Descargas: {selectedProtocol.downloadCount}</span>
                    <span>
                      Creado:{' '}
                      {new Date(selectedProtocol.createdAt).toLocaleDateString(
                        'es-CL'
                      )}
                    </span>
                    <span>
                      Actualizado:{' '}
                      {new Date(selectedProtocol.updatedAt).toLocaleDateString(
                        'es-CL'
                      )}
                    </span>
                  </div>
                  {selectedProtocol.pdfUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={selectedProtocol.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default function AdminEmergencyProtocolsPage() {
  return <AdminEmergencyProtocolsContent />;
}
