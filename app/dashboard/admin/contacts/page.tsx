'use client';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import { BackButton } from '@/components/shared/back-button';
import { useMutation } from 'convex/react';
import { useConvexQueryWithError } from '@/hooks/use-convex-error-handler';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Edit,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';

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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContactForm } from '@/components/dashboard/admin/contact-form';
import { DataState } from '@/components/shared/data-state';
import { api } from '@/convex/_generated/api';

interface Contact {
  _id: string;
  name: string;
  position?: string;
  department?: string;
  phone?: string;
  email?: string;
  address?: string;
  availability?: string;
  hours?: string;
  type:
    | 'directiva'
    | 'seguridad'
    | 'social'
    | 'municipal'
    | 'health'
    | 'police'
    | 'fire'
    | 'service';
  description?: string;
  location?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

const contactTypeConfig = {
  directiva: { emoji: '🏛️', label: 'Directiva', color: 'text-blue-600' },
  seguridad: { emoji: '🛡️', label: 'Seguridad', color: 'text-red-600' },
  social: { emoji: '🤝', label: 'Social', color: 'text-green-600' },
  municipal: { emoji: '🏛️', label: 'Municipal', color: 'text-purple-600' },
  health: { emoji: '🏥', label: 'Salud', color: 'text-teal-600' },
  police: { emoji: '🚔', label: 'Policía', color: 'text-blue-700' },
  fire: { emoji: '🚒', label: 'Bomberos', color: 'text-orange-600' },
  service: { emoji: '🔧', label: 'Servicio', color: 'text-gray-600' },
};

function AdminContactsContent() {
  const { user } = useUser();
  const {
    data: contactsData,
    error,
    isLoading,
    retry,
  } = useConvexQueryWithError<Contact[]>(api.contacts.getAllContacts);
  const allContacts: Contact[] = contactsData ?? [];
  const deleteContact = useMutation(api.contacts.deleteContact);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<
    'all' | keyof typeof contactTypeConfig
  >('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
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

  const filteredContacts = allContacts.filter((contact: Contact) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'active' && contact.isActive) ||
      (filter === 'inactive' && !contact.isActive);

    const matchesType = typeFilter === 'all' || contact.type === typeFilter;

    return matchesStatus && matchesType;
  });

  const handleCreateContact = () => {
    setSelectedContact(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };

  const handleDeleteContact = async (contactId: string) => {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este contacto? Esta acción lo desactivará permanentemente.'
      )
    ) {
      try {
        await deleteContact({ contactId: contactId as any });
        // The UI will automatically update due to Convex's reactive queries
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error al eliminar el contacto. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <DataState
      loading={isLoading}
      error={error}
      onRetry={retry}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
        <BackButton className="mb-6" />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Contactos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Administra todos los contactos de la comunidad
            </p>
          </div>
          <Button
            onClick={handleCreateContact}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Contacto</span>
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
                    Total Contactos
                  </p>
                  <p className="text-2xl font-bold">
                    {isLoading ? '...' : allContacts.length}
                  </p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Activos
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {isLoading
                      ? '...'
                      : allContacts.filter((c: any) => c.isActive).length}
                  </p>
                </div>
                <Phone className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Inactivos
                  </p>
                  <p className="text-2xl font-bold text-gray-600">
                    {isLoading
                      ? '...'
                      : allContacts.filter((c: any) => !c.isActive).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Categorías
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Object.keys(contactTypeConfig).length}
                  </p>
                </div>
                <Filter className="h-8 w-8 text-purple-500" />
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
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(value: any) => setTypeFilter(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                {Object.entries(contactTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.emoji} {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Contacts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No se encontraron contactos
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === 'all' && typeFilter === 'all'
                  ? 'No hay contactos registrados en el sistema'
                  : 'No hay contactos que coincidan con los filtros seleccionados'}
              </p>
              <Button onClick={handleCreateContact}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Contacto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact: Contact, index: number) => {
                const typeInfo = contactTypeConfig[contact.type];

                return (
                  <div className="space-y-6">
                    <motion.div
                      key={contact._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <span className="text-2xl">{typeInfo.emoji}</span>
                              {contact.name}
                            </CardTitle>
                            <Badge
                              variant={
                                contact.isActive ? 'default' : 'secondary'
                              }
                            >
                              {contact.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <CardDescription className={typeInfo.color}>
                            {typeInfo.label}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 mb-4">
                            {contact.position && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Cargo:
                                </span>
                                <span>{contact.position}</span>
                              </div>
                            )}
                            {contact.department && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Departamento:
                                </span>
                                <span>{contact.department}</span>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="truncate">
                                  {contact.email}
                                </span>
                              </div>
                            )}
                            {contact.location && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{contact.location}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewContact(contact)}
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditContact(contact)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteContact(contact._id)}
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

        <div>
          {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Contacto</DialogTitle>
              <DialogDescription>
                Agrega un nuevo contacto a la base de datos comunitaria.
              </DialogDescription>
            </DialogHeader>
            <ContactForm
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                setSelectedContact(null);
              }}
              onCancel={() => {
                setIsCreateDialogOpen(false);
                setSelectedContact(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Contacto</DialogTitle>
              <DialogDescription>
                Modifica la información del contacto seleccionado.
              </DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <ContactForm
                contact={selectedContact}
                onSuccess={() => {
                  setIsEditDialogOpen(false);
                  setSelectedContact(null);
                }}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedContact(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Contacto</DialogTitle>
              <DialogDescription>
                Información completa del contacto seleccionado.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedContact && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Nombre:</h4>
                    <p>{selectedContact.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Tipo:</h4>
                    <p>
                      {contactTypeConfig[selectedContact.type].emoji}{' '}
                      {contactTypeConfig[selectedContact.type].label}
                    </p>
                  </div>
                  {selectedContact.position && (
                    <div>
                      <h4 className="font-semibold">Cargo:</h4>
                      <p>{selectedContact.position}</p>
                    </div>
                  )}
                  {selectedContact.phone && (
                    <div>
                      <h4 className="font-semibold">Teléfono:</h4>
                      <p>{selectedContact.phone}</p>
                    </div>
                  )}
                  {selectedContact.email && (
                    <div>
                      <h4 className="font-semibold">Email:</h4>
                      <p>{selectedContact.email}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DataState>
  );
}

export default function AdminContactsPage() {
  return <AdminContactsContent />;
}
