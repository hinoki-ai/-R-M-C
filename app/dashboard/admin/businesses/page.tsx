'use client';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import { BackButton } from '@/components/shared/back-button';
import { useMutation, useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import {
  Edit,
  Eye,
  MapPin,
  Phone,
  Plus,
  Star,
  Store,
  Trash2,
  User,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';

import { BusinessForm } from '@/components/dashboard/admin/business-form';
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

interface Business {
  _id: string;
  name: string;
  description: string;
  category: 'supermercado' | 'panaderia' | 'restaurante' | 'farmacia' | 'ferreteria' | 'otros';
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  hours: string;
  rating: number;
  featured: boolean;
  isActive: boolean;
  ownerId?: string;
  ownerName: string;
  verified: boolean;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

const categoryLabels = {
  supermercado: 'Supermercado',
  panaderia: 'Panadería',
  restaurante: 'Restaurante',
  farmacia: 'Farmacia',
  ferreteria: 'Ferretería',
  otros: 'Otros',
};

const categoryIcons = {
  supermercado: '🏪',
  panaderia: '🍞',
  restaurante: '🍽️',
  farmacia: '💊',
  ferreteria: '🔧',
  otros: '🏪',
};

function AdminBusinessesContent() {
  const { user } = useUser();
  const allBusinesses = useQuery(api.businesses.getAllBusinesses) || [];
  const deleteBusiness = useMutation(api.businesses.deleteBusiness);
  const toggleFeatured = useMutation(api.businesses.toggleBusinessFeatured);
  const toggleVerified = useMutation(api.businesses.toggleBusinessVerified);
  const toggleActive = useMutation(api.businesses.toggleBusinessActive);
  const loading = allBusinesses === undefined;
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'featured' | 'unverified' | 'inactive'>('all');

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

  const filteredBusinesses = allBusinesses.filter((business: any) => {
    switch (filter) {
      case 'featured':
        return business.featured;
      case 'unverified':
        return !business.verified;
      case 'inactive':
        return !business.isActive;
      default:
        return true;
    }
  });

  const handleEdit = (business: Business) => {
    setSelectedBusiness(business);
    setIsFormOpen(true);
  };

  const handleView = (business: Business) => {
    setSelectedBusiness(business);
    setIsViewOpen(true);
  };

  const handleDelete = async (businessId: string) => {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este negocio? Esta acción no se puede deshacer.'
      )
    ) {
      try {
        await deleteBusiness({ businessId: businessId as any });
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting business:', error);
        alert(
          'Error al eliminar el negocio. Por favor, inténtalo de nuevo.'
        );
      }
    }
  };

  const handleToggleFeatured = async (businessId: string) => {
    try {
      await toggleFeatured({ businessId: businessId as any });
      // The UI will automatically update due to Convex's reactive queries
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert(
        'Error al cambiar el estado destacado. Por favor, inténtalo de nuevo.'
      );
    }
  };

  const handleToggleVerified = async (businessId: string) => {
    try {
      await toggleVerified({ businessId: businessId as any });
      // The UI will automatically update due to Convex's reactive queries
    } catch (error) {
      console.error('Error toggling verified status:', error);
      alert(
        'Error al cambiar el estado verificado. Por favor, inténtalo de nuevo.'
      );
    }
  };

  const handleToggleActive = async (businessId: string) => {
    try {
      await toggleActive({ businessId: businessId as any });
      // The UI will automatically update due to Convex's reactive queries
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert(
        'Error al cambiar el estado activo. Por favor, inténtalo de nuevo.'
      );
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <BackButton className="mb-6" />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Administración de Comercios
          </h1>
          <p className="text-muted-foreground">
            Gestiona el directorio de comercios locales de la comunidad
          </p>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos ({allBusinesses.length})
          </Button>
          <Button
            variant={filter === 'featured' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('featured')}
          >
            Destacados ({allBusinesses.filter((b: any) => b.featured).length})
          </Button>
          <Button
            variant={filter === 'unverified' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unverified')}
          >
            Sin Verificar ({allBusinesses.filter((b: any) => !b.verified).length})
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('inactive')}
          >
            Inactivos ({allBusinesses.filter((b: any) => !b.isActive).length})
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedBusiness(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar Comercio
          </Button>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{allBusinesses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Destacados</p>
                  <p className="text-2xl font-bold">{allBusinesses.filter((b: any) => b.featured).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-4 w-4 text-blue-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Verificados</p>
                  <p className="text-2xl font-bold">{allBusinesses.filter((b: any) => b.verified).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-4 w-4 text-green-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Activos</p>
                  <p className="text-2xl font-bold">{allBusinesses.filter((b: any) => b.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Businesses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay comercios
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filter === 'all'
                  ? 'No hay comercios registrados aún.'
                  : 'No hay comercios que coincidan con el filtro seleccionado.'}
              </p>
              {filter === 'all' && (
                <Button onClick={() => {
                  setSelectedBusiness(null);
                  setIsFormOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Comercio
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business: any) => (
              <Card key={business._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{categoryIcons[business.category as keyof typeof categoryIcons]}</span>
                      <div>
                        <CardTitle className="text-lg">{business.name}</CardTitle>
                        <CardDescription>{categoryLabels[business.category as keyof typeof categoryLabels]}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {business.featured && (
                        <Badge variant="secondary" className="text-xs">Destacado</Badge>
                      )}
                      {!business.verified && (
                        <Badge variant="outline" className="text-xs">Sin Verificar</Badge>
                      )}
                      {!business.isActive && (
                        <Badge variant="destructive" className="text-xs">Inactivo</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {business.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{business.address}</span>
                    </div>

                    {business.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{business.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < business.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({business.rating})
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(business)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(business)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleFeatured(business._id)}
                    >
                      <Star className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleVerified(business._id)}
                    >
                      <User className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(business._id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Business Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedBusiness ? 'Editar Comercio' : 'Agregar Comercio'}
              </DialogTitle>
              <DialogDescription>
                {selectedBusiness
                  ? 'Modifica la información del comercio'
                  : 'Agrega un nuevo comercio al directorio comunitario'
                }
              </DialogDescription>
            </DialogHeader>
            <BusinessForm
              business={selectedBusiness}
              onSave={() => setIsFormOpen(false)}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Business View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedBusiness?.name}</DialogTitle>
              <DialogDescription>
                Información detallada del comercio
              </DialogDescription>
            </DialogHeader>
            {selectedBusiness && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Categoría</h4>
                    <p>{categoryLabels[selectedBusiness.category]}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Rating</h4>
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < selectedBusiness.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Descripción</h4>
                  <p className="text-sm text-muted-foreground">{selectedBusiness.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Dirección</h4>
                  <p className="text-sm text-muted-foreground">{selectedBusiness.address}</p>
                </div>
                {selectedBusiness.phone && (
                  <div>
                    <h4 className="font-semibold">Teléfono</h4>
                    <p className="text-sm text-muted-foreground">{selectedBusiness.phone}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">Horario</h4>
                  <p className="text-sm text-muted-foreground">{selectedBusiness.hours}</p>
                </div>
                <div className="flex gap-2">
                  {selectedBusiness.featured && <Badge>Destacado</Badge>}
                  {selectedBusiness.verified && <Badge variant="outline">Verificado</Badge>}
                  {selectedBusiness.isActive ? (
                    <Badge variant="secondary">Activo</Badge>
                  ) : (
                    <Badge variant="destructive">Inactivo</Badge>
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

export default function AdminBusinessesPage() {
  return <AdminBusinessesContent />;
}
