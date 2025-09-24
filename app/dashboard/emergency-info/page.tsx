'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Phone, Shield } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/shared/back-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const emergencyContacts = [
  {
    id: 1,
    name: 'Carabineros de Chile',
    number: '133',
    description: 'Policía uniformada - Emergencias y seguridad ciudadana',
    type: 'police',
    available: '24/7',
  },
  {
    id: 2,
    name: 'Ambulancia SAMU',
    number: '131',
    description: 'Servicio de ambulancias y emergencias médicas',
    type: 'medical',
    available: '24/7',
  },
  {
    id: 3,
    name: 'Bomberos Pinto',
    number: '132',
    description: 'Cuerpo de bomberos local - Incendios y rescates',
    type: 'fire',
    available: '24/7',
  },
  {
    id: 4,
    name: 'Hospital Pinto',
    number: '131',
    description: 'Centro de salud de urgencia',
    type: 'medical',
    available: '24/7',
  },
  {
    id: 5,
    name: 'Presidenta Junta de Vecinos',
    number: '+56 9 8889 6773',
    description: 'Doña Rosa del Carmen Pérez Muñoz - Directiva',
    type: 'community',
    available: '08:00 - 20:00',
  },
  {
    id: 6,
    name: 'Ronda Vecinal Nocturna',
    number: '+56 9 8889 6773',
    description: 'Coordinador de rondas de seguridad comunitaria',
    type: 'security',
    available: '20:00 - 06:00',
  },
];

const emergencyProtocols = [
  {
    id: 1,
    title: 'Protocolo de Incendio',
    description: 'Actuación ante incendios forestales o estructurales',
    steps: [
      'Activar alarma de incendio',
      'Evacuar el área inmediatamente',
      'Llamar a Bomberos (133)',
      'No intentar apagar grandes incendios',
      'Ayudar a personas vulnerables',
    ],
    icon: '🔥',
    severity: 'high',
  },
  {
    id: 2,
    title: 'Protocolo de Inundación',
    description: 'Actuación ante lluvias intensas y crecidas de ríos',
    steps: [
      'Monitorear niveles de ríos y quebradas',
      'Preparar kit de emergencia',
      'Elevar objetos valiosos',
      'Tener plan de evacuación',
      'Seguir indicaciones de autoridades',
    ],
    icon: '🌊',
    severity: 'high',
  },
  {
    id: 3,
    title: 'Protocolo Sísmico',
    description: 'Actuación durante y después de un terremoto',
    steps: [
      'Protegerse bajo una mesa resistente',
      'Mantener la calma',
      'Después del sismo, evacuar ordenadamente',
      'Revisar daños estructurales',
      'Ayudar a heridos y damnificados',
    ],
    icon: '🏗️',
    severity: 'high',
  },
  {
    id: 4,
    title: 'Protocolo de Seguridad',
    description:
      'Medidas preventivas y de respuesta ante situaciones de riesgo',
    steps: [
      'Mantener comunicación constante',
      'Reportar situaciones sospechosas',
      'Conocer rutas de evacuación',
      'Tener kit de emergencia preparado',
      'Participar en simulacros comunitarios',
    ],
    icon: '🛡️',
    severity: 'medium',
  },
];

function EmergencyInfoContent() {
  return (
    <>
      <BackButton className="mb-6" />
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight">
              Información de Emergencias
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Contactos importantes y protocolos de actuación para situaciones
              de emergencia en Pinto Los Pellines
            </p>
          </motion.div>
        </div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contactos de Emergencia
              </CardTitle>
              <CardDescription>
                Números importantes para situaciones de emergencia - disponibles
                24/7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {contact.description}
                      </p>
                      <p className="text-sm font-medium text-blue-600 mt-1">
                        {contact.number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Disponible: {contact.available}
                      </p>
                    </div>
                    <Badge
                      variant={
                        contact.type === 'police' ? 'destructive' : 'default'
                      }
                    >
                      {contact.type === 'police'
                        ? 'Policía'
                        : contact.type === 'medical'
                          ? 'Médico'
                          : contact.type === 'fire'
                            ? 'Bomberos'
                            : contact.type === 'community'
                              ? 'Comunidad'
                              : 'Seguridad'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Protocols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Protocolos de Emergencia
              </CardTitle>
              <CardDescription>
                Guías de actuación para diferentes tipos de emergencias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {emergencyProtocols.map(protocol => (
                  <div key={protocol.id} className="border rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{protocol.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {protocol.title}
                          </h3>
                          <Badge
                            variant={
                              protocol.severity === 'high'
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {protocol.severity === 'high'
                              ? 'Alta Prioridad'
                              : 'Media Prioridad'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {protocol.description}
                        </p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">
                            Pasos a seguir:
                          </h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            {protocol.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Preparedness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Preparación para Emergencias
              </CardTitle>
              <CardDescription>
                Información importante para estar preparado ante cualquier
                eventualidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="font-semibold mb-2">
                    Mantén tu teléfono cargado
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Asegúrate de tener batería suficiente y los números de
                    emergencia guardados
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-4xl mb-4">🏠</div>
                  <h3 className="font-semibold mb-2">Conoce tu zona</h3>
                  <p className="text-sm text-muted-foreground">
                    Identifica rutas de evacuación y puntos de encuentro seguros
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="font-semibold mb-2">Kit de emergencia</h3>
                  <p className="text-sm text-muted-foreground">
                    Prepara agua, alimentos no perecederos, medicamentos y
                    documentos importantes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export default function EmergencyInfoPage() {
  return <EmergencyInfoContent />;
}
