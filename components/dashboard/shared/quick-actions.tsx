'use client'

import { motion } from 'framer-motion'

import { LoadingState } from '@/components/dashboard/shared/loading-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { QuickAction } from '@/types/dashboard'

interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
  columns?: 1 | 2 | 3 | 4
  loading?: boolean
}

export function QuickActions({
  actions,
  title = 'Acciones Rápidas',
  columns = 2,
  loading = false
}: QuickActionsProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  if (loading) {
    return <LoadingState type='actions' count={columns * 2} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
        {title}
      </h2>
      <div className={`grid ${gridCols[columns]} gap-4 mb-8`}>
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className={`cursor-pointer hover:shadow-lg transition-all border-l-4 ${
              action.priority === 'high' ? 'border-l-red-500' : 'border-l-blue-500'
            }`}>
              <CardContent className='p-6'>
                <div className='flex items-start space-x-4'>
                  <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <action.icon className='h-6 w-6' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <h3 className='font-semibold text-gray-900 dark:text-white truncate'>
                        {action.title}
                      </h3>
                      {action.priority === 'high' && (
                        <Badge variant='destructive' className='text-xs flex-shrink-0'>
                          Alta Prioridad
                        </Badge>
                      )}
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                      {action.description}
                    </p>
                    <Button
                      onClick={action.action}
                      variant='outline'
                      size='sm'
                      className='w-full sm:w-auto'
                    >
                      Acceder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}