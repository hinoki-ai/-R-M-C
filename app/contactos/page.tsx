'use client'

import { useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { Clock, Mail, MapPin, Phone, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'

const getContactTypeColor = (type: string) => {
  switch (type) {
    case 'directiva':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'seguridad':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'social':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'municipal':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'health':
      return 'bg-teal-100 text-teal-800 border-teal-200'
    case 'police':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'fire':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getContactTypeLabel = (type: string) => {
  switch (type) {
    case 'directiva':
      return '🏛️ Directiva'
    case 'seguridad':
      return '🛡️ Seguridad'
    case 'social':
      return '🤝 Social'
    case 'municipal':
      return '🏛️ Municipal'
    case 'health':
      return '🏥 Salud'
    case 'police':
      return '🚔 Policía'
    case 'fire':
      return '🔥 Bomberos'
    case 'service':
      return '🏘️ Servicio'
    default:
      return '📞 Contacto'
  }
}

export default function ContactosPage() {
  // Fetch contacts from database
  const allContacts = useQuery(api.contacts.getContacts) || []
  const directivaContacts = allContacts.filter((c: any) => c.type === 'directiva')
  const seguridadContacts = allContacts.filter((c: any) => c.type === 'seguridad')
  const socialContacts = allContacts.filter((c: any) => c.type === 'social')
  const municipalContacts = allContacts.filter((c: any) => ['municipal', 'health', 'police', 'fire'].includes(c.type))
  const serviceContacts = allContacts.filter((c: any) => c.type === 'service')

  // Combine directiva, seguridad, and social for community contacts
  const communityContacts = [...directivaContacts, ...seguridadContacts, ...socialContacts]
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950'>
      {/* Chilean Cultural Background Pattern */}
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        <div className='absolute top-20 left-12 text-6xl'>🏔️</div>
        <div className='absolute top-32 left-16 text-4xl'>🌽</div>
        <div className='absolute top-60 right-16 text-5xl'>🇨🇱</div>
        <div className='absolute top-80 left-8 text-3xl'>🌻</div>
        <div className='absolute bottom-32 left-20 text-4xl'>🏞️</div>
        <div className='absolute bottom-40 right-12 text-3xl'>🌽</div>
        <div className='absolute bottom-60 left-32 text-3xl'>🐑</div>
        <div className='absolute bottom-20 right-24 text-4xl'>🏘️</div>
        <div className='absolute top-40 right-8 text-3xl'>🌾</div>
        <div className='absolute bottom-80 right-40 text-2xl'>🇨🇱</div>
      </div>

      <div className='relative container mx-auto px-6 py-12'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <div className='text-6xl mb-6'>📞🇨🇱</div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Directorio Comunitario
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Contactos oficiales de la Junta de Vecinos, servicios municipales y
            organizaciones comunitarias de Pinto Los Pellines.
          </p>
        </motion.div>

        {/* Directiva Junta de Vecinos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='mb-12'
        >
          <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            🏛️ Directiva Junta de Vecinos
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {communityContacts.map((contact, index) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow'>
                  <CardHeader>
                    <div className='flex items-start justify-between mb-4'>
                      <Badge className={`${getContactTypeColor(contact.type)} border`}>
                        {getContactTypeLabel(contact.type)}
                      </Badge>
                    </div>
                    <CardTitle className='text-xl mb-2'>
                      {contact.name}
                    </CardTitle>
                    <CardDescription className='text-base font-medium text-gray-700 dark:text-gray-300'>
                      {contact.position || contact.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {contact.phone && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <Phone className='w-4 h-4 mr-2' />
                          <span className='font-mono'>{contact.phone}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <Mail className='w-4 h-4 mr-2' />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      {contact.address && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <MapPin className='w-4 h-4 mr-2' />
                          <span>{contact.address}</span>
                        </div>
                      )}
                      {contact.availability && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <Clock className='w-4 h-4 mr-2' />
                          <span>{contact.availability}</span>
                        </div>
                      )}
                    </div>
                    {(contact.phone || contact.email) && (
                      <div className='mt-6 pt-4 border-t flex gap-2'>
                        {contact.phone && (
                          <Button size='sm' className='flex-1 bg-green-600 hover:bg-green-700'>
                            📞 Llamar
                          </Button>
                        )}
                        {contact.email && (
                          <Button size='sm' variant='outline' className='flex-1'>
                            ✉️ Email
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Servicios Municipales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className='mb-12'
        >
          <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            🏢 Servicios Municipales
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {municipalContacts.map((contact: any, index: number) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow'>
                  <CardHeader>
                    <div className='flex items-start justify-between mb-4'>
                      <Badge className={`${getContactTypeColor(contact.type)} border`}>
                        {getContactTypeLabel(contact.type)}
                      </Badge>
                    </div>
                    <CardTitle className='text-xl mb-2'>
                      {contact.name}
                    </CardTitle>
                    <CardDescription className='text-base font-medium text-gray-700 dark:text-gray-300'>
                      {contact.department || contact.position}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {contact.phone && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <Phone className='w-4 h-4 mr-2' />
                          <span className='font-mono'>{contact.phone}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <Mail className='w-4 h-4 mr-2' />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      {contact.address && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <MapPin className='w-4 h-4 mr-2' />
                          <span>{contact.address}</span>
                        </div>
                      )}
                    </div>
                    {(contact.phone || contact.email) && (
                      <div className='mt-6 pt-4 border-t'>
                        <Button className='w-full bg-blue-600 hover:bg-blue-700'>
                          📞 Contactar Servicio
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Servicios Comunitarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className='mb-12'
        >
          <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            🏘️ Servicios Comunitarios
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {serviceContacts.map((service: any, index: number) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              >
                <Card className='h-full hover:shadow-lg transition-shadow'>
                  <CardHeader>
                    <CardTitle className='text-xl mb-2'>
                      {service.name}
                    </CardTitle>
                    <CardDescription className='text-base'>
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {service.phone && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <Phone className='w-4 h-4 mr-2' />
                          <span className='font-mono'>{service.phone}</span>
                        </div>
                      )}
                      {service.location && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <MapPin className='w-4 h-4 mr-2' />
                          <span>{service.location}</span>
                        </div>
                      )}
                      {service.hours && (
                        <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                          <Clock className='w-4 h-4 mr-2' />
                          <span>{service.hours}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className='text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-8'
        >
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            ¿Necesitas actualizar un contacto?
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto'>
            Si tienes información actualizada sobre contactos o servicios,
            o si deseas agregar un nuevo servicio comunitario, contacta a la secretaría.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button className='bg-blue-600 hover:bg-blue-700'>
              <User className='w-4 h-4 mr-2' />
              Actualizar Contacto
            </Button>
            <Button variant='outline'>
              📝 Sugerir Servicio
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}