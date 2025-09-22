'use client'

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Suspense, useState } from 'react'

import { DocumentDashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { AnnouncementList } from '@/components/dashboard/shared/announcement-card'
import { AnnouncementHeader } from '@/components/dashboard/shared/section-header'
import RssNewsSection from '@/components/dashboard/news/rss-news-section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAnnouncements } from '@/hooks/use-dashboard-data'


// No mock data - using real announcements only

function AnnouncementsContent() {
  const { user } = useUser()
  const { announcements: realAnnouncements, loading, markAsRead, unreadCount } = useAnnouncements(user?.id)

  // Use real data only - no mock fallbacks
  const announcements = realAnnouncements
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all')

  const filteredAnnouncements = announcements.filter(announcement => {
    switch (filter) {
      case 'unread':
        return !announcement.isRead
      case 'high':
        return announcement.priority === 'high'
      default:
        return true
    }
  })

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
  }

  const quickActions = (
    <div className='flex flex-wrap gap-2'>
      <Button
        variant={filter === 'all' ? 'default' : 'outline'}
        size='sm'
        onClick={() => setFilter('all')}
      >
        Todos ({announcements.length})
      </Button>
      <Button
        variant={filter === 'unread' ? 'default' : 'outline'}
        size='sm'
        onClick={() => setFilter('unread')}
        className='relative'
      >
        No Leídos
        {unreadCount > 0 && (
          <Badge variant='destructive' className='ml-1 text-xs'>
            {unreadCount}
          </Badge>
        )}
      </Button>
      <Button
        variant={filter === 'high' ? 'default' : 'outline'}
        size='sm'
        onClick={() => setFilter('high')}
      >
        Prioridad Alta
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() => {
          // Mark all as read functionality would go here
          console.log('Mark all as read')
        }}
      >
        Marcar Todos Leídos
      </Button>
    </div>
  )

  if (!user) {
    return (
      <DocumentDashboardLayout user={{ id: '', name: 'Usuario', email: '', role: 'user', isAdmin: false }} currentSection='announcements'>
        <div className='text-center py-12'>
          <p className='text-gray-600 dark:text-gray-400'>Cargando...</p>
        </div>
      </DocumentDashboardLayout>
    )
  }

  return (
    <DocumentDashboardLayout
      user={{
        id: user.id,
        name: user.firstName || user.username || 'Usuario',
        email: user.primaryEmailAddress?.emailAddress || '',
        role: 'user',
        isAdmin: user.publicMetadata?.role === 'admin' || false
      }}
      currentSection='announcements'
    >
      <div className='space-y-6'>
        <AnnouncementHeader count={unreadCount} />

        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="announcements">Anuncios Comunitarios</TabsTrigger>
            <TabsTrigger value="news">Noticias RSS</TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-6 mt-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'
            >
              <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
                Filtros Rápidos
              </h3>
              {quickActions}
            </motion.div>

            {/* Announcements List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AnnouncementList
                announcements={filteredAnnouncements}
                onMarkAsRead={handleMarkAsRead}
                loading={loading}
                compact={false}
              />
            </motion.div>

            {/* Statistics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800'
            >
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                📊 Estadísticas de Anuncios
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>{announcements.length}</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Total de Anuncios</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>{unreadCount}</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>No Leídos</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-red-600'>
                    {announcements.filter(a => a.priority === 'high').length}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Prioridad Alta</div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <RssNewsSection />
          </TabsContent>
        </Tabs>
      </div>
    </DocumentDashboardLayout>
  )
}

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={
      <DocumentDashboardLayout user={{ id: '', name: 'Usuario', email: '', role: 'user', isAdmin: false }} currentSection='announcements'>
        <div className='text-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>Cargando anuncios...</p>
        </div>
      </DocumentDashboardLayout>
    }>
      <AnnouncementsContent />
    </Suspense>
  )
}