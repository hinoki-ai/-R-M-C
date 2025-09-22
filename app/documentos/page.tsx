'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Download, Eye, File, FileText, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const documents = [
  {
    id: 1,
    title: 'Estatutos Junta de Vecinos Pinto Los Pellines',
    description: 'Documento fundacional aprobado por Municipalidad de Pinto - Actualizado enero 2024',
    category: 'legal',
    type: 'PDF',
    size: '2.4 MB',
    date: '2024-01-15',
    author: 'Municipalidad de Pinto',
    downloads: 145
  },
  {
    id: 2,
    title: 'Acta Asamblea Ordinaria Octubre 2025',
    description: 'Aprobación presupuesto anual 2026 y proyectos comunitarios',
    category: 'minutes',
    type: 'PDF',
    size: '1.8 MB',
    date: '2025-10-20',
    author: 'Secretaría Junta',
    downloads: 89
  },
  {
    id: 3,
    title: 'Reglamento de Seguridad Vecinal',
    description: 'Protocolos de rondas nocturnas y sistema de alertas comunitarias',
    category: 'security',
    type: 'PDF',
    size: '3.2 MB',
    date: '2024-06-10',
    author: 'Comisión Seguridad',
    downloads: 203
  },
  {
    id: 4,
    title: 'Estados Financieros 2024',
    description: 'Balance anual y ejecución presupuestaria - Auditado por Comisión Revisora',
    category: 'financial',
    type: 'XLSX',
    size: '890 KB',
    date: '2024-12-31',
    author: 'Tesorera Junta',
    downloads: 67
  },
  {
    id: 5,
    title: 'Plan de Desarrollo Comunal 2025-2028',
    description: 'Proyecto participativo: Mejoramiento infraestructura rural y agricultura sostenible',
    category: 'planning',
    type: 'PDF',
    size: '5.1 MB',
    date: '2024-09-01',
    author: 'Directiva Junta',
    downloads: 134
  },
  {
    id: 6,
    title: 'Reglamento de Uso Salón Comunal',
    description: 'Normas para el uso de espacios comunitarios y arriendo de instalaciones',
    category: 'facilities',
    type: 'PDF',
    size: '1.2 MB',
    date: '2024-03-15',
    author: 'Administración',
    downloads: 156
  },
  {
    id: 7,
    title: 'Censo Poblacional 2024',
    description: 'Registro actualizado de familias y habitantes del sector rural',
    category: 'census',
    type: 'XLSX',
    size: '456 KB',
    date: '2024-07-01',
    author: 'Secretaría Junta',
    downloads: 98
  },
  {
    id: 8,
    title: 'Proyecto Sistema de Riego Comunitario',
    description: 'Estudio técnico y presupuesto para implementación de riego por goteo',
    category: 'projects',
    type: 'PDF',
    size: '4.7 MB',
    date: '2024-11-10',
    author: 'Comisión Agrícola',
    downloads: 76
  }
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'legal':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'minutes':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'security':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'financial':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'planning':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'facilities':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    case 'census':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'projects':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'legal':
      return '⚖️'
    case 'minutes':
      return '📝'
    case 'security':
      return '🛡️'
    case 'financial':
      return '💰'
    case 'planning':
      return '📋'
    case 'facilities':
      return '🏢'
    case 'census':
      return '👥'
    case 'projects':
      return '🚧'
    default:
      return '📄'
  }
}

export default function DocumentosPage() {
  return (
    <div className='min-h-screen relative'>
      {/* Background Image */}
      <div className='fixed inset-0 -z-10'>
        <Image
          src='/images/backgrounds/bg1.jpg'
          alt='Documents Page Background'
          fill
          className='object-cover object-center'
          priority
          quality={90}
        />
      </div>

      <div className='relative container mx-auto px-6 py-12 z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <div className='text-6xl mb-6'>📄🇨🇱</div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
            Centro de Documentos
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Accede a estatutos, actas de reuniones, documentos oficiales y toda la
            documentación importante de la Junta de Vecinos Pinto Los Pellines.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='bg-card rounded-lg p-6 mb-8'
        >
          <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Mostrando {documents.length} documentos • Ordenados por fecha
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm'>
                📅 Por Fecha
              </Button>
              <Button variant='outline' size='sm'>
                📂 Por Categoría
              </Button>
              <Button variant='outline' size='sm'>
                🔍 Buscar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Documents Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className='h-full hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex items-start justify-between mb-4'>
                    <Badge className={`${getCategoryColor(document.category)} border`}>
                      <span className='mr-1'>{getCategoryIcon(document.category)}</span>
                      {document.category === 'legal' ? 'Legal' :
                       document.category === 'minutes' ? 'Actas' :
                       document.category === 'security' ? 'Seguridad' :
                       document.category === 'financial' ? 'Financiero' :
                       document.category === 'planning' ? 'Planificación' :
                       document.category === 'facilities' ? 'Instalaciones' :
                       document.category === 'census' ? 'Censo' : 'Proyectos'}
                    </Badge>
                    <Badge variant='outline' className='text-xs'>
                      {document.type}
                    </Badge>
                  </div>
                  <CardTitle className='text-lg mb-2'>
                    {document.title}
                  </CardTitle>
                  <CardDescription className='text-base'>
                    {document.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                      <File className='w-4 h-4 mr-2' />
                      <span>{document.size}</span>
                    </div>
                    <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                      <Calendar className='w-4 h-4 mr-2' />
                      <span>{new Date(document.date).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                      <User className='w-4 h-4 mr-2' />
                      <span>{document.author}</span>
                    </div>
                    <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                      <Download className='w-4 h-4 mr-2' />
                      <span>{document.downloads} descargas</span>
                    </div>
                  </div>
                  <div className='mt-6 pt-4 border-t flex gap-2'>
                    <Button size='sm' className='flex-1 bg-blue-600 hover:bg-blue-700'>
                      <Eye className='w-4 h-4 mr-2' />
                      Ver Online
                    </Button>
                    <Button size='sm' variant='outline' className='flex-1'>
                      <Download className='w-4 h-4 mr-2' />
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Document Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className='bg-card rounded-lg p-8 mb-8'
        >
          <h2 className='text-2xl font-bold text-center text-gray-900 dark:text-white mb-8'>
            📂 Categorías de Documentos
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg'>
              <div className='text-2xl mb-2'>⚖️</div>
              <h3 className='font-semibold text-sm mb-1'>Documentos Legales</h3>
              <p className='text-xs text-gray-600 dark:text-gray-400'>Estatutos, reglamentos</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg'>
              <div className='text-2xl mb-2'>📝</div>
              <h3 className='font-semibold text-sm mb-1'>Actas de Reuniones</h3>
              <p className='text-xs text-gray-600 dark:text-gray-400'>Asambleas y comisiones</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg'>
              <div className='text-2xl mb-2'>💰</div>
              <h3 className='font-semibold text-sm mb-1'>Informes Financieros</h3>
              <p className='text-xs text-gray-600 dark:text-gray-400'>Presupuestos y balances</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg'>
              <div className='text-2xl mb-2'>🚧</div>
              <h3 className='font-semibold text-sm mb-1'>Proyectos</h3>
              <p className='text-xs text-gray-600 dark:text-gray-400'>Iniciativas comunitarias</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className='text-center bg-card rounded-lg p-8'
        >
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            ¿Necesitas subir un documento?
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto'>
            Si eres parte de la directiva o tienes documentos importantes para compartir
            con la comunidad, puedes solicitar la publicación contactando a la secretaría.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button className='bg-green-600 hover:bg-green-700'>
              <FileText className='w-4 h-4 mr-2' />
              Solicitar Publicación
            </Button>
            <Button variant='outline'>
              📞 Contactar Secretaría
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}