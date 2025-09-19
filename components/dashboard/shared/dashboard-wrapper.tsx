'use client'

import { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { User } from '@/types/dashboard'

interface DashboardWrapperProps {
  user: User
  children: ReactNode
  title?: string
  backgroundPattern?: 'admin' | 'user' | 'neutral'
}

const backgroundPatterns = {
  admin: 'bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950 dark:via-gray-900 dark:to-green-950',
  user: 'bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-green-950 dark:via-blue-950 dark:to-yellow-950',
  neutral: 'bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'
}

const culturalPatterns = {
  admin: [
    { position: 'top-20 left-10', emoji: '🏔️' },
    { position: 'top-40 right-20', emoji: '🌽' },
    { position: 'bottom-32 left-20', emoji: '🦙' },
    { position: 'bottom-20 right-10', emoji: '🌿' }
  ],
  user: [
    { position: 'top-20 left-12', emoji: '🏔️' },
    { position: 'top-32 left-16', emoji: '🚜' },
    { position: 'top-60 right-16', emoji: '🇨🇱' },
    { position: 'top-80 left-8', emoji: '🌻' },
    { position: 'bottom-32 left-20', emoji: '🏞️' },
    { position: 'bottom-40 right-12', emoji: '🌽' },
    { position: 'bottom-60 left-32', emoji: '🐑' },
    { position: 'bottom-20 right-24', emoji: '🏘️' },
    { position: 'top-40 right-8', emoji: '🌾' },
    { position: 'bottom-80 right-40', emoji: '🇨🇱' }
  ],
  neutral: []
}

export function DashboardWrapper({
  user,
  children,
  title,
  backgroundPattern = 'neutral'
}: DashboardWrapperProps) {
  const pattern = backgroundPatterns[backgroundPattern]
  const emojis = culturalPatterns[backgroundPattern]

  return (
    <div className={`w-full ${pattern} relative`}>
      {/* Chilean Cultural Background Pattern */}
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        {emojis.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} text-6xl`}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* User/Admin Badge */}
      <div className='flex justify-end mb-6'>
        <Badge
          variant={user.isAdmin ? 'destructive' : 'secondary'}
          className={`bg-gradient-to-r ${
            user.isAdmin
              ? 'from-purple-500 to-blue-500'
              : 'from-green-500 to-blue-500'
          }`}
        >
          {user.isAdmin ? 'Acceso Administrador' : user.name}
        </Badge>
      </div>

      {/* Title */}
      {title && (
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>
            {title}
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300'>
            Junta de Vecinos Pinto Los Pellines, Ñuble
          </p>
        </div>
      )}

      {/* Content */}
      <div className='w-full space-y-8'>
        {children}
      </div>
    </div>
  )
}