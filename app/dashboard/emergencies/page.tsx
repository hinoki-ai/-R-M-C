'use client';

import {
  IconActivity,
  IconAlertCircle,
  IconAlertTriangle,
  IconCalendar,
  IconCircleCheck,
  IconCloud,
  IconDownload,
  IconEye,
  IconFileText,
  IconMessage,
  IconPhone,
  IconShield,
  IconUsers,
} from '@tabler/icons-react';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';

import PDFViewer from '@/components/dashboard/emergency/pdf-viewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/convex/_generated/api';


// Emergency Contacts Component
function EmergencyContacts() {
  const contacts = [
    { name: 'Policía Local', phone: '133', type: 'emergency' },
    { name: 'Bomberos', phone: '132', type: 'emergency' },
    { name: 'Hospital', phone: '+56 2 1234 5678', type: 'health' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconPhone className='h-5 w-5' />
          Contactos de Emergencia
        </CardTitle>
        <CardDescription>Números importantes para situaciones de emergencia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {contacts.map((contact, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{contact.name}</p>
                <p className='text-sm text-muted-foreground'>{contact.phone}</p>
              </div>
              <Badge variant={contact.type === 'emergency' ? 'destructive' : 'default'}>
                {contact.type === 'emergency' ? 'Emergencia' : 'Salud'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Active Alerts Component
function ActiveAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconAlertTriangle className='h-5 w-5' />
          Alertas Activas
        </CardTitle>
        <CardDescription>Emergencias y alertas actuales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 bg-red-50 rounded border border-red-200'>
            <div>
              <p className='font-medium text-sm'>Alerta de Incendio</p>
              <p className='text-xs text-muted-foreground'>Sector Industrial - Hace 30 min</p>
            </div>
            <Badge variant='destructive'>Crítico</Badge>
          </div>
          <div className='flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200'>
            <div>
              <p className='font-medium text-sm'>Accidente Vehicular</p>
              <p className='text-xs text-muted-foreground'>Intersección Principal - Hace 1 hora</p>
            </div>
            <Badge variant='default'>Medio</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Emergency Protocols Component
function EmergencyProtocols() {
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);

  const protocols = useQuery(api.emergency_protocols.getEmergencyProtocols, {}) || [];
  const recordAccess = useMutation(api.emergency_protocols.recordProtocolAccess);

  const handleViewProtocol = (protocol: any) => {
    setSelectedProtocol(protocol);
    setIsPDFViewerOpen(true);
    recordAccess({ protocolId: protocol._id, accessType: 'view' });
  };

  const handleDownloadProtocol = (protocolId: any) => {
    recordAccess({ protocolId, accessType: 'download' });
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      fire: IconAlertTriangle,
      medical: IconPhone,
      police: IconShield,
      natural_disaster: IconCloud,
      security: IconUsers,
      evacuation: IconMessage,
      general: IconFileText,
    };
    return icons[category as keyof typeof icons] || IconFileText;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      fire: 'text-red-600 bg-red-50',
      medical: 'text-blue-600 bg-blue-50',
      police: 'text-green-600 bg-green-50',
      natural_disaster: 'text-orange-600 bg-orange-50',
      security: 'text-purple-600 bg-purple-50',
      evacuation: 'text-yellow-600 bg-yellow-50',
      general: 'text-gray-600 bg-gray-50',
    };
    return colors[category as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <IconShield className='h-5 w-5' />
            Protocolos de Emergencia
          </CardTitle>
          <CardDescription>Guías y procedimientos descargables para situaciones de emergencia</CardDescription>
        </CardHeader>
        <CardContent>
          {protocols.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <IconFileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>No hay protocolos disponibles actualmente</p>
              <p className='text-sm'>Los protocolos se cargarán automáticamente</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {protocols.map((protocol) => {
                const IconComponent = getCategoryIcon(protocol.category);
                const colorClass = getCategoryColor(protocol.category);

                return (
                  <Card key={protocol._id} className={`hover:shadow-md transition-shadow ${colorClass}`}>
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between mb-3'>
                        <IconComponent className='h-8 w-8 flex-shrink-0' />
                        <Badge variant={protocol.priority === 'critical' ? 'destructive' : 'secondary'} className='text-xs'>
                          {protocol.priority}
                        </Badge>
                      </div>

                      <h3 className='font-semibold mb-2 line-clamp-2'>{protocol.title}</h3>
                      <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>{protocol.description}</p>

                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          className='flex-1'
                          onClick={() => handleViewProtocol(protocol)}
                        >
                          <IconEye className='h-4 w-4 mr-1' />
                          Ver
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleDownloadProtocol(protocol._id)}
                        >
                          <IconDownload className='h-4 w-4' />
                        </Button>
                      </div>

                      {protocol.downloadCount > 0 && (
                        <p className='text-xs text-muted-foreground mt-2'>
                          Descargado {protocol.downloadCount} {protocol.downloadCount === 1 ? 'vez' : 'veces'}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Basic emergency contact cards (fallback) */}
          <div className='mt-6 pt-6 border-t'>
            <h4 className='font-medium mb-3'>Contactos Rápidos</h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center p-4 bg-red-50 rounded border'>
                <IconAlertTriangle className='h-8 w-8 text-red-600 mx-auto mb-2' />
                <p className='text-sm font-medium'>Incendio</p>
                <p className='text-xs text-muted-foreground'>Bomberos: 132</p>
              </div>
              <div className='text-center p-4 bg-blue-50 rounded border'>
                <IconPhone className='h-8 w-8 text-blue-600 mx-auto mb-2' />
                <p className='text-sm font-medium'>Policía</p>
                <p className='text-xs text-muted-foreground'>Carabineros: 133</p>
              </div>
              <div className='text-center p-4 bg-green-50 rounded border'>
                <IconPhone className='h-8 w-8 text-green-600 mx-auto mb-2' />
                <p className='text-sm font-medium'>Médico</p>
                <p className='text-xs text-muted-foreground'>SAMU: 131</p>
              </div>
              <div className='text-center p-4 bg-purple-50 rounded border'>
                <IconMessage className='h-8 w-8 text-purple-600 mx-auto mb-2' />
                <p className='text-sm font-medium'>Punto Reunión</p>
                <p className='text-xs text-muted-foreground'>Plaza Central</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PDFViewer
        protocol={selectedProtocol}
        isOpen={isPDFViewerOpen}
        onClose={() => {
          setIsPDFViewerOpen(false);
          setSelectedProtocol(null);
        }}
        onDownload={handleDownloadProtocol}
      />
    </>
  );
}

// Security Overview Component
function SecurityOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconShield className='h-5 w-5' />
          Seguridad Barrial
        </CardTitle>
        <CardDescription>Monitoreo y alertas de seguridad comunitaria</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-green-600'>8/10</p>
              <p className='text-sm text-muted-foreground'>Cámaras Activas</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-blue-600'>2</p>
              <p className='text-sm text-muted-foreground'>Alertas Hoy</p>
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Estado del Sistema:</span>
              <Badge variant='default'>Operativo</Badge>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Última Verificación:</span>
              <span className='font-medium'>Hace 15 min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Emergency History Component
function EmergencyHistory() {
  const history = [
    {
      id: 1,
      type: 'fire',
      title: 'Respuesta a Incendio',
      location: 'Sector Industrial',
      time: 'Hace 2 días',
      status: 'resolved',
      icon: IconAlertTriangle,
    },
    {
      id: 2,
      type: 'medical',
      title: 'Atención Médica Urgente',
      location: 'Calle Principal',
      time: 'Hace 1 semana',
      status: 'resolved',
      icon: IconPhone,
    },
    {
      id: 3,
      type: 'security',
      title: 'Alerta de Seguridad',
      location: 'Parque Central',
      time: 'Hace 2 semanas',
      status: 'resolved',
      icon: IconShield,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600';
      case 'active':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconActivity className='h-5 w-5' />
          Historial de Emergencias
        </CardTitle>
        <CardDescription>Registro de incidentes y respuestas anteriores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {history.map((incident) => {
            const IconComponent = incident.icon;

            return (
              <div key={incident.id} className='flex items-center gap-3'>
                <div className='p-2 rounded-full bg-muted'>
                  <IconComponent className='h-4 w-4' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>
                    {incident.title}
                  </p>
                  <p className='text-xs text-muted-foreground'>{incident.location} • {incident.time}</p>
                </div>
                <Badge
                  variant='secondary'
                  className={`text-xs ${getStatusColor(incident.status)}`}
                >
                  Resuelto
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function EmergenciesPage() {
  return (
    <div className='space-y-8'>
      {/* Page Header */}
      <div className='px-4 lg:px-6'>
        <h1 className='text-3xl font-bold'>Centro de Emergencias</h1>
        <p className='text-muted-foreground'>
          Sistema completo de gestión de emergencias y seguridad comunitaria
        </p>
      </div>

      {/* Emergency Content */}
      <div className='px-4 lg:px-6 space-y-6'>
        {/* Emergency Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <EmergencyContacts />
          <ActiveAlerts />
          <SecurityOverview />
        </div>

        {/* Protocols and History */}
        <div className='grid gap-6 md:grid-cols-2'>
          <EmergencyProtocols />
          <EmergencyHistory />
        </div>

        {/* Quick Actions */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='cursor-pointer hover:bg-muted/50 transition-colors'>
            <CardContent className='flex flex-col items-center justify-center py-6'>
              <IconPhone className='h-8 w-8 text-red-600 mb-2' />
              <p className='text-sm font-medium'>Llamar Emergencia</p>
            </CardContent>
          </Card>
          <Card className='cursor-pointer hover:bg-muted/50 transition-colors'>
            <CardContent className='flex flex-col items-center justify-center py-6'>
              <IconAlertTriangle className='h-8 w-8 text-orange-600 mb-2' />
              <p className='text-sm font-medium'>Reportar Incidente</p>
            </CardContent>
          </Card>
          <Card className='cursor-pointer hover:bg-muted/50 transition-colors'>
            <CardContent className='flex flex-col items-center justify-center py-6'>
              <IconShield className='h-8 w-8 text-blue-600 mb-2' />
              <p className='text-sm font-medium'>Ver Cámaras</p>
            </CardContent>
          </Card>
          <Card className='cursor-pointer hover:bg-muted/50 transition-colors'>
            <CardContent className='flex flex-col items-center justify-center py-6'>
              <IconFileText className='h-8 w-8 text-green-600 mb-2' />
              <p className='text-sm font-medium'>Protocolos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}