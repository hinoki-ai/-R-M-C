'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, User } from 'lucide-react';

import { BackButton } from '@/components/shared/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const contactCategories = [
  {
    id: 'authorities',
    title: 'Autoridades Locales',
    description: 'Gobierno local y autoridades municipales',
    icon: '🏛️',
    contacts: [
      {
        id: 1,
        name: 'Municipalidad de Pinto',
        position: 'Oficina Municipal',
        phone: '+56 43 246 1000',
        email: 'info@municipiopinto.cl',
        address: 'Plaza de Armas 123, Pinto',
        hours: 'Lunes a Viernes: 8:30 - 17:30',
      },
      {
        id: 2,
        name: 'Alcalde de Pinto',
        position: 'Alcaldía',
        phone: '+56 43 246 1001',
        email: 'alcalde@municipiopinto.cl',
        address: 'Municipalidad de Pinto',
        hours: 'Con cita previa',
      },
      {
        id: 3,
        name: 'Dirección de Desarrollo Comunitario',
        position: 'DIDECO',
        phone: '+56 43 246 1020',
        email: 'dideco@municipiopinto.cl',
        address: 'Municipalidad de Pinto',
        hours: 'Lunes a Viernes: 9:00 - 16:00',
      },
    ],
  },
  {
    id: 'community',
    title: 'Organizaciones Comunitarias',
    description: 'Juntas de vecinos y organizaciones locales',
    icon: '👥',
    contacts: [
      {
        id: 4,
        name: 'Junta de Vecinos Pinto Los Pellines',
        position: 'Directiva',
        phone: '+56 9 8889 6773',
        email: 'info@juntapellines.cl',
        address: 'Salón Comunal, Calle Principal',
        hours: 'Lunes a Viernes: 19:00 - 21:00',
      },
      {
        id: 5,
        name: 'Club de Adulto Mayor',
        position: 'Coordinación',
        phone: '+56 9 7777 8888',
        email: 'adultomayor@pinto.cl',
        address: 'Centro Comunitario',
        hours: 'Martes y Jueves: 15:00 - 18:00',
      },
      {
        id: 6,
        name: 'Centro de Padres',
        position: 'Coordinación Escolar',
        phone: '+56 9 6666 7777',
        email: 'centropadres@pinto.cl',
        address: 'Escuela Básica Pinto',
        hours: 'Lunes a Viernes: 18:00 - 20:00',
      },
    ],
  },
  {
    id: 'services',
    title: 'Servicios Públicos',
    description: 'Salud, educación y servicios sociales',
    icon: '🏥',
    contacts: [
      {
        id: 7,
        name: 'Centro de Salud Pinto',
        position: 'Atención Primaria',
        phone: '+56 43 246 1500',
        email: 'cesfam@pinto.cl',
        address: 'Calle Salud 456, Pinto',
        hours: 'Lunes a Viernes: 8:00 - 17:00',
      },
      {
        id: 8,
        name: 'Escuela Básica Pinto',
        position: 'Administración',
        phone: '+56 43 246 2000',
        email: 'escuela.basica@pinto.cl',
        address: 'Calle Educación 789, Pinto',
        hours: 'Lunes a Viernes: 8:00 - 16:00',
      },
      {
        id: 9,
        name: 'Biblioteca Municipal',
        position: 'Atención al Público',
        phone: '+56 43 246 1800',
        email: 'biblioteca@municipiopinto.cl',
        address: 'Plaza de Armas 45, Pinto',
        hours: 'Martes a Sábado: 10:00 - 18:00',
      },
    ],
  },
  {
    id: 'emergency',
    title: 'Emergencias',
    description: 'Servicios de emergencia y seguridad',
    icon: '🚨',
    contacts: [
      {
        id: 10,
        name: 'Carabineros de Chile',
        position: 'Retén Pinto',
        phone: '133',
        email: 'contacto@carabineros.cl',
        address: 'Calle Carabineros 321, Pinto',
        hours: '24/7',
      },
      {
        id: 11,
        name: 'Bomberos Pinto',
        position: 'Cuerpo de Bomberos',
        phone: '132',
        email: 'bomberos@pinto.cl',
        address: 'Calle Bomberos 654, Pinto',
        hours: '24/7',
      },
      {
        id: 12,
        name: 'SAMU',
        position: 'Servicio Médico de Urgencia',
        phone: '131',
        email: 'samu@redsalud.cl',
        address: 'Hospital Regional',
        hours: '24/7',
      },
    ],
  },
];

function ContactsContent() {
  return (
    <div className="space-y-8">
      <BackButton className="mb-6" />
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">
            Directorio de Contactos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Encuentra todos los contactos importantes de Pinto Los Pellines:
            autoridades, servicios públicos, organizaciones comunitarias y
            emergencias.
          </p>
        </motion.div>
      </div>

      {/* Contact Categories */}
      <div className="space-y-8">
        {contactCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <div className="text-xl">{category.title}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {category.description}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.contacts.map(contact => (
                    <div
                      key={contact.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">
                            {contact.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {contact.position}
                          </p>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="truncate">{contact.phone}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span className="truncate">{contact.email}</span>
                            </div>

                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">
                                {contact.address}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium">Horario:</span>
                              <span>{contact.hours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contactos de Emergencia Rápidos
            </CardTitle>
            <CardDescription>
              Los números más importantes para recordar en caso de emergencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🚔</div>
                <div className="font-semibold text-red-700 dark:text-red-400">
                  Carabineros
                </div>
                <div className="text-2xl font-bold text-red-600">133</div>
                <div className="text-sm text-muted-foreground">
                  Policía - Seguridad
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🚒</div>
                <div className="font-semibold text-blue-700 dark:text-blue-400">
                  Bomberos
                </div>
                <div className="text-2xl font-bold text-blue-600">132</div>
                <div className="text-sm text-muted-foreground">
                  Incendios - Rescates
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🚑</div>
                <div className="font-semibold text-green-700 dark:text-green-400">
                  SAMU
                </div>
                <div className="text-2xl font-bold text-green-600">131</div>
                <div className="text-sm text-muted-foreground">
                  Ambulancias - Urgencias
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              ¿Necesitas Agregar un Contacto?
            </CardTitle>
            <CardDescription>
              Ayúdanos a mantener actualizado el directorio comunitario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-6xl">📞</div>
              <p className="text-muted-foreground">
                Si conoces algún servicio, organización o autoridad que debería
                estar en este directorio, contáctanos para agregarlo.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4 mr-2" />
                Sugerir Contacto
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ContactsPage() {
  return <ContactsContent />;
}
