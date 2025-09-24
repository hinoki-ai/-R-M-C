'use client';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Suspense, useState, useEffect } from 'react';

import RssNewsSection from '@/components/dashboard/news/rss-news-section';
import { AnnouncementList } from '@/components/dashboard/shared/announcement-card';
import { AnnouncementHeader } from '@/components/dashboard/shared/section-header';
import { BackButton } from '@/components/shared/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnnouncements } from '@/hooks/use-dashboard-data';
import { useAudioSystem } from '@/hooks/use-audio-system';

// Type for announcement objects
type Announcement = {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'general' | 'emergency' | 'event' | 'maintenance';
  isRead: boolean;
};

// No mock data - using real announcements only

function AnnouncementsContent() {
  const { user } = useUser();
  const {
    announcements: realAnnouncements,
    loading,
    markAsRead,
    unreadCount,
  } = useAnnouncements(user?.id);
  const { playVoice, playUI, playAlert } = useAudioSystem();

  // Use real data only - no mock fallbacks
  const announcements: Announcement[] = realAnnouncements;
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  // Track previously seen announcements to play sounds for new ones
  const [previousUnreadCount, setPreviousUnreadCount] = useState(unreadCount);

  useEffect(() => {
    // Play sound when new announcements arrive
    if (unreadCount > previousUnreadCount && unreadCount > 0) {
      const newAnnouncements = announcements.filter(a => !a.isRead);
      const hasCritical = newAnnouncements.some(a => a.priority === 'critical');
      const hasHigh = newAnnouncements.some(a => a.priority === 'high');

      if (hasCritical) {
        playAlert('emergency'); // Critical announcements get emergency alert
      } else if (hasHigh) {
        playVoice('announce', 'general', 0); // High priority gets announcement sound
      } else {
        playUI('notification', 'general'); // Regular notifications get UI sound
      }
    }
    setPreviousUnreadCount(unreadCount);
  }, [
    unreadCount,
    previousUnreadCount,
    announcements,
    playAlert,
    playVoice,
    playUI,
  ]);

  const filteredAnnouncements = announcements.filter(
    (announcement: Announcement) => {
      switch (filter) {
        case 'unread':
          return !announcement.isRead;
        case 'high':
          return announcement.priority === 'high';
        default:
          return true;
      }
    }
  );

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    playUI('feedback', 'success');
  };

  const handleFilterChange = (newFilter: 'all' | 'unread' | 'high') => {
    setFilter(newFilter);
    playUI('click', 'navigation');
  };

  const handleMarkAllRead = async () => {
    // In real implementation, this would mark all as read
    playUI('success');
    console.log('Mark all as read');
  };

  const quickActions = (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={filter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFilterChange('all')}
      >
        Todos ({announcements.length})
      </Button>
      <Button
        variant={filter === 'unread' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFilterChange('unread')}
        className="relative"
      >
        No Leídos
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-1 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>
      <Button
        variant={filter === 'high' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFilterChange('high')}
      >
        Prioridad Alta
      </Button>
      <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
        Marcar Todos Leídos
      </Button>
    </div>
  );

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton className="mb-6" />
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
            className="bg-card rounded-lg p-4 border border-border"
          >
            <h3 className="text-sm font-medium text-foreground mb-3">
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
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              📊 Estadísticas de Anuncios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {announcements.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total de Anuncios
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {unreadCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  No Leídos
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {
                    announcements.filter(
                      (a: Announcement) => a.priority === 'high'
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Prioridad Alta
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <RssNewsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando anuncios...
          </p>
        </div>
      }
    >
      <AnnouncementsContent />
    </Suspense>
  );
}
