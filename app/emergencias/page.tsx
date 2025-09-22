'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Clock, Phone, Shield } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const emergencyContacts = [
  {
    id: 1,
    name: 'Carabineros de Chile',
    number: '133',
    description: 'Policía uniformada - Emergencias y seguridad ciudadana',
    type: 'police',
    available: '24/7'
  },
  {
    id: 2,
    name: 'Ambulancia SAMU',
    number: '131',
    description: 'Servicio de ambulancias y emergencias médicas',
    type: 'medical',
    available: '24/7'
  },
  {
    id: 3,
    name: 'Bomberos Pinto',
    number: '132',
    description: 'Cuerpo de bomberos local - Incendios y rescates',
    type: 'fire',
    available: '24/7'
  },
  {
    id: 4,
    name: 'Hospital Pinto',
    number: '131',
    description: 'Centro de salud de urgencia',
    type: 'medical',
    available: '24/7'
  },
  {
    id: 5,
    name: 'Presidenta Junta de Vecinos',
    number: '+56 9 8889 6773',
    description: 'Doña Rosa del Carmen Pérez Muñoz - Directiva',
    type: 'community',
    available: '08:00 - 20:00'
  },
  {
    id: 6,
    name: 'Ronda Vecinal Nocturna',
    number: '+56 9 8889 6773',
    description: 'Coordinador de rondas de seguridad comunitaria',
    type: 'security',
    available: '20:00 - 06:00'
  }
]

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
      'Ayudar a personas vulnerables'
    ],
    icon: '🔥',
    severity: 'high'
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
      'Seguir indicaciones de autoridades'
    ],
    icon: '🌊',
    severity: 'high'
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
      'Ayudar a heridos y damnificados'
    ],
    icon: '🏗️',
    severity: 'critical'
  },
  {
    id: 4,
    title: 'Protocolo de Seguridad Vecinal',
    description: 'Actuación ante situaciones de inseguridad',
    steps: [
      'Contactar inmediatamente a Carabineros (133)',
      'Alertar a la ronda vecinal',
      'No intervenir directamente en riesgos',
      'Documentar lo sucedido',
      'Reportar a la Junta de Vecinos'
    ],
    icon: '🛡️',
    severity: 'medium'
  }
]

const getContactTypeColor = (type: string) => {
  switch (type) {
    case 'police':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'medical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'fire':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'security':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'community':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function EmergenciasPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950'>

      <div className='relative container mx-auto px-6 py-12'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <div className='text-6xl mb-6'>🚨🇨🇱</div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Centro de Emergencias
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Información crítica y contactos de emergencia para Pinto Los Pellines.
            Mantente preparado y seguro en nuestro sector rural.
          </p>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='mb-12'
        >
          <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            📞 Contactos de Emergencia
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow'>
                  <CardHeader>
                    <div className='flex items-start justify-between mb-4'>
                      <Badge className={`${getContactTypeColor(contact.type)} border`}>
                        {contact.type === 'police' ? '🚔 Policía' :
                         contact.type === 'medical' ? '🚑 Médico' :
                         contact.type === 'fire' ? '🔥 Bomberos' :
                         contact.type === 'security' ? '🛡️ Seguridad' : '🏘️ Comunidad'}
                      </Badge>
                      <span className='text-sm text-gray-500'>
                        {contact.available}
                      </span>
                    </div>
                    <CardTitle className='text-xl mb-2'>
                      {contact.name}
                    </CardTitle>
                    <CardDescription className='text-base'>
                      {contact.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                        <Phone className='w-4 h-4 mr-2' />
                        <span className='font-mono text-lg'>{contact.number}</span>
                      </div>
                      <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                        <Clock className='w-4 h-4 mr-2' />
                        <span>Disponible: {contact.available}</span>
                      </div>
                    </div>
                    <div className='mt-6 pt-4 border-t'>
                      <Button className='w-full bg-red-600 hover:bg-red-700'>
                        📞 Llamar Ahora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Protocols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className='mb-12'
        >
          <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            📋 Protocolos de Emergencia
          </h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {emergencyProtocols.map((protocol, index) => (
              <motion.div
                key={protocol.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow'>
                  <CardHeader>
                    <div className='flex items-start justify-between mb-4'>
                      <Badge className={`${getSeverityColor(protocol.severity)} border`}>
                        <span className='mr-1'>{protocol.icon}</span>
                        {protocol.severity === 'critical' ? 'Crítico' :
                         protocol.severity === 'high' ? 'Alto' : 'Medio'}
                      </Badge>
                    </div>
                    <CardTitle className='text-xl mb-2'>
                      {protocol.title}
                    </CardTitle>
                    <CardDescription className='text-base'>
                      {protocol.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      <h4 className='font-semibold text-gray-900 dark:text-white mb-3'>Pasos a seguir:</h4>
                      <ol className='space-y-2'>
                        {protocol.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className='flex items-start text-sm text-gray-600 dark:text-gray-400'>
                            <span className='bg-gray-200 dark:bg-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0'>
                              {stepIndex + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Emergency Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 mb-8'
        >
          <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            🛡️ Sistema de Seguridad Comunitaria
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='bg-card border-border hover:bg-card/80 transition-all duration-300 hover:scale-105 h-full'>
              <CardHeader className='text-center pb-4'>
                <div className='text-4xl mb-4'>👥</div>
                <CardTitle className='text-xl text-foreground mb-3'>Ronda Vecinal</CardTitle>
                <Badge className='bg-blue-500/20 text-blue-300 border-blue-500/30'>Activo</Badge>
              </CardHeader>
              <CardContent className='pt-0'>
                <p className='text-muted-foreground text-sm text-center mb-6 leading-relaxed'>
                  Patrullas nocturnas organizadas por la comunidad para mantener la seguridad del barrio.
                </p>
                <div className='text-center mt-auto'>
                  <Button variant='outline' className='w-full'>📍 Ver Mapa de Rondas</Button>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-card border-border hover:bg-card/80 transition-all duration-300 hover:scale-105 h-full'>
              <CardHeader className='text-center pb-4'>
                <div className='text-4xl mb-4'>🚨</div>
                <CardTitle className='text-xl text-foreground mb-3'>Alerta Comunitaria</CardTitle>
                <Badge className='bg-green-500/20 text-green-300 border-green-500/30'>Disponible</Badge>
              </CardHeader>
              <CardContent className='pt-0'>
                <p className='text-muted-foreground text-sm text-center mb-6 leading-relaxed'>
                  Sistema de alertas rápidas vía WhatsApp para emergencias y situaciones de riesgo.
                </p>
                <div className='text-center mt-auto'>
                  <Button variant='outline' className='w-full'>📱 Unirse al Grupo</Button>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-card border-border hover:bg-card/80 transition-all duration-300 hover:scale-105 h-full'>
              <CardHeader className='text-center pb-4'>
                <div className='text-4xl mb-4'>🏥</div>
                <CardTitle className='text-xl text-foreground mb-3'>Brigada de Salud</CardTitle>
                <Badge className='bg-red-500/20 text-red-300 border-red-500/30'>Listo</Badge>
              </CardHeader>
              <CardContent className='pt-0'>
                <p className='text-muted-foreground text-sm text-center mb-6 leading-relaxed'>
                  Voluntarios capacitados en primeros auxilios disponibles 24/7 para emergencias médicas.
                </p>
                <div className='text-center mt-auto'>
                  <Button variant='outline' className='w-full'>👨‍⚕️ Ver Brigadistas</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Emergency Preparedness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className='text-center bg-red-50 dark:bg-red-950/20 rounded-lg p-8'
        >
          <AlertTriangle className='w-16 h-16 text-red-600 mx-auto mb-6' />
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            Mantente Preparado
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto'>
            La prevención es la mejor herramienta contra emergencias. Conoce tu entorno,
            prepara tu kit de emergencia y participa activamente en los simulacros comunitarios.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button className='bg-red-600 hover:bg-red-700'>
              <Shield className='w-4 h-4 mr-2' />
              Kit de Emergencia
            </Button>
            <Button variant='outline'>
              📚 Guía de Prevención
            </Button>
            <Button variant='outline'>
              🎯 Simulacros
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
