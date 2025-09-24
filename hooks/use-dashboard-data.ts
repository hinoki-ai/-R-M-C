import { useMutation, useQuery } from 'convex/react';
import { useCallback, useEffect, useState } from 'react';

import { api } from '@/convex/_generated/api';
import { delay } from '@/lib/utils/utils';
import { useLoadingAudio } from './use-loading-audio';
import {
  DashboardData,
  MaintenanceRequest,
  PaymentRecord,
  UseDashboardDataReturn,
  User,
} from '@/types/dashboard';

// Specialized hooks for different data types
export function useAnnouncements(userId?: string) {
  // Get announcements directly from Convex
  const announcementsData = useQuery(api.community.getAnnouncements) || [];
  const markAsReadMutation = useMutation(api.community.markAnnouncementAsRead);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const announcements = announcementsData.map((announcement: any) => ({
    id: announcement._id,
    title: announcement.title,
    content: announcement.content,
    author: 'Sistema', // Could be enhanced to get real author name
    publishedAt: new Date(announcement.publishedAt).toISOString(),
    priority: announcement.priority,
    category:
      (announcement.category as
        | 'general'
        | 'emergency'
        | 'event'
        | 'maintenance') || 'general',
    isRead: announcement.readBy?.includes(userId as any) || false,
  }));

  const unreadCount = announcements.filter(
    (announcement: any) => !announcement.isRead
  ).length;

  const markAsRead = useCallback(async (announcementId: string) => {
    try {
      setLoading(true);
      setError(null);
      // Use Convex mutation to mark as read
      await markAsReadMutation({ announcementId: announcementId as any });
    } catch (err) {
      setError('Failed to mark announcement as read');
      console.error('Failed to mark announcement as read:', err);
    } finally {
      setLoading(false);
    }
  }, [markAsReadMutation]);

  const markAllAsRead = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await delay(100);
    } catch (err) {
      setError('Failed to mark all announcements as read');
      console.error('Failed to mark all announcements as read:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    // Convex queries automatically refetch, but we can trigger a manual refetch if needed
  }, []);

  return {
    announcements,
    unreadCount,
    loading: loading || announcementsData === undefined,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  };
}

export function useEvents() {
  const { data, loading, error, refetch } = useDashboardData();

  const events = data?.recentEvents || [];
  const upcomingEvents = events.filter(
    event => new Date(event.date) >= new Date()
  );

  const rsvpToEvent = useCallback(async (eventId: string) => {
    try {
      // In a real app, this would be an API call
      await delay(500);
      // You could update local state or trigger a refetch
    } catch (err) {
      console.error('Failed to RSVP to event:', err);
    }
  }, []);

  return {
    events,
    upcomingEvents,
    loading,
    error,
    rsvpToEvent,
    refetch,
  };
}

export function useMaintenance() {
  const { data, loading, error, refetch } = useDashboardData();

  const maintenanceRequests = data?.pendingMaintenance || [];
  const pendingCount = maintenanceRequests.filter(
    req => req.status === 'pending'
  ).length;

  const submitMaintenanceRequest = useCallback(
    async (
      request: Omit<MaintenanceRequest, 'id' | 'reportedAt' | 'status'>
    ) => {
      try {
        // In a real app, this would be an API call
        await delay(500);

        const newRequest: MaintenanceRequest = {
          ...request,
          id: Date.now().toString(),
          reportedAt: new Date().toISOString(),
          status: 'pending',
        };

        refetch(); // Refresh data
      } catch (err) {
        console.error('Failed to submit maintenance request:', err);
      }
    },
    [refetch]
  );

  return {
    maintenanceRequests,
    pendingCount,
    loading,
    error,
    submitMaintenanceRequest,
    refetch,
  };
}

export function usePayments() {
  const { data, loading, error, refetch } = useDashboardData();

  const payments = data?.recentPayments || [];
  const totalAmount = payments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const submitPayment = useCallback(
    async (
      payment: Omit<PaymentRecord, 'id' | 'date' | 'status' | 'userId'>
    ) => {
      try {
        // In a real app, this would be an API call
        await delay(500);

        const newPayment: PaymentRecord = {
          ...payment,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          status: 'pending',
          userId: data?.user.id || '1',
        };

        refetch(); // Refresh data
      } catch (err) {
        console.error('Failed to submit payment:', err);
      }
    },
    [data?.user.id, refetch]
  );

  return {
    payments,
    totalAmount,
    loading,
    error,
    submitPayment,
    refetch,
  };
}

export function useProjects() {
  const { data, loading, error, refetch } = useDashboardData();

  const projects = data?.activeProjects || [];
  const totalRaised = projects.reduce(
    (sum, project) => sum + project.raised,
    0
  );
  const totalGoal = projects.reduce((sum, project) => sum + project.goal, 0);

  const contributeToProject = useCallback(
    async (projectId: string, amount: number) => {
      try {
        // In a real app, this would be an API call
        await delay(500);
        refetch(); // Refresh data
      } catch (err) {
        console.error('Failed to contribute to project:', err);
      }
    },
    [refetch]
  );

  return {
    projects,
    totalRaised,
    totalGoal,
    loading,
    error,
    contributeToProject,
    refetch,
  };
}

// Real dashboard data hook using Convex
export function useDashboardData(): UseDashboardDataReturn {
  const { useAutoLoading } = useLoadingAudio();

  // Get current user
  const currentUser = useQuery(api.users.current);

  // Get dashboard stats
  const stats = useQuery(api.community.getDashboardStats);

  // Get announcements
  const announcements = useQuery(api.community.getAnnouncements);

  // Get recent events
  const recentEvents = useQuery(api.calendar.getEvents, {
    startDate: new Date().toISOString().split('T')[0], // Today's date
    userId: currentUser?._id,
  });

  // Get maintenance requests
  const pendingMaintenance = useQuery(api.community.getMaintenanceRequests);

  // Get payments
  const recentPayments = useQuery(api.community.getPayments);

  // Get community projects
  const activeProjects = useQuery(api.community.getCommunityProjects);

  // Transform data to match expected format
  const data: DashboardData | null =
    currentUser &&
    stats &&
    announcements &&
    recentEvents &&
    pendingMaintenance &&
    recentPayments &&
    activeProjects
      ? {
          user: {
            id: currentUser._id.toString(),
            name: currentUser.name,
            email: '', // Email not stored in users table for privacy
            role: 'user', // Default role
            isAdmin: false, // Default admin status
          },
          stats: [
            {
              label: 'Vecinos Registrados',
              value: stats.totalUsers.toString(),
              change: '0%', // Use real growth data
              icon: 'Users',
              color: 'text-blue-600',
              trend: 'stable',
            },
            {
              label: 'Proyectos Activos',
              value: stats.activeProjects.toString(),
              change: '0%', // Use real project growth data
              icon: 'Activity',
              color: 'text-green-600',
              trend: 'stable',
            },
            {
              label: 'Solicitudes Pendientes',
              value: stats.pendingMaintenance.toString(),
              change: '0%', // Use real maintenance change data
              icon: 'AlertCircle',
              color: 'text-purple-600',
              trend: 'stable',
            },
            {
              label: 'Aportes Totales',
              value: `$${(stats.totalContributions / 100).toLocaleString()}`,
              change: '0%', // Use real contribution growth data
              icon: 'DollarSign',
              color: 'text-orange-600',
              trend: 'stable',
            },
          ],
          announcements: announcements.map((announcement: any) => ({
            id: announcement._id,
            title: announcement.title,
            content: announcement.content,
            author: currentUser.name, // Simplified - would need to join with users table
            publishedAt: new Date(announcement.publishedAt).toISOString(),
            priority: announcement.priority,
            category:
              (announcement.category as
                | 'general'
                | 'emergency'
                | 'event'
                | 'maintenance') || 'general',
            isRead: announcement.readBy?.includes(currentUser._id) || false,
          })),
          recentEvents: recentEvents.map(event => ({
            id: event._id,
            title: event.title,
            description: event.description || '',
            date: event.startDate,
            time: event.startTime || 'Todo el día',
            location: event.location || 'Por confirmar',
            organizer: currentUser.name, // Simplified - would need to join with users table
            category: 'cultural' as const, // Default category - would need to resolve from categoryId
            isMandatory: false, // Event mandatory status not available in current schema
            attendees: event.attendeeCount || 0, // Use real attendee count from event
          })),
          pendingMaintenance: pendingMaintenance.map(request => ({
            id: request._id,
            title: request.title,
            description: request.description,
            location: request.location,
            priority:
              request.priority === 'critical'
                ? ('high' as const)
                : request.priority,
            status: request.status,
            reportedBy: currentUser.name, // Simplified - would need to join with users table
            reportedAt: new Date(request.reportedAt).toISOString(),
            category: request.category,
            assignedTo: request.assignedTo ? currentUser.name : undefined, // Simplified
          })),
          recentPayments: recentPayments.map(payment => ({
            id: payment._id,
            amount: payment.amount,
            description: payment.description,
            date: payment.paidAt
              ? new Date(payment.paidAt).toISOString().split('T')[0]
              : new Date(payment.createdAt).toISOString().split('T')[0],
            status: payment.status,
            type:
              payment.type === 'event' || payment.type === 'other'
                ? ('contribution' as const)
                : payment.type,
            userId: payment.userId,
          })),
          activeProjects: activeProjects.map(project => ({
            id: project._id,
            title: project.title,
            description: project.description,
            goal: project.goal,
            raised: project.raised,
            deadline: project.deadline,
            category:
              project.category === 'education' || project.category === 'other'
                ? ('cultural' as const)
                : project.category,
            status:
              project.status === 'planning'
                ? ('active' as const)
                : project.status === 'cancelled'
                  ? ('paused' as const)
                  : project.status,
          })),
        }
      : null;

  const loading =
    !currentUser ||
    !stats ||
    !announcements ||
    !recentEvents ||
    !pendingMaintenance ||
    !recentPayments ||
    !activeProjects;
  const error = null; // Convex handles errors internally

  // Auto-manage loading audio for critical dashboard data
  useAutoLoading(loading, 'critical', 2000); // Start hammering after 2 seconds

  const refetch = useCallback(async () => {
    // Convex queries automatically refetch when dependencies change
    // No manual refetch needed - real-time updates handled by Convex
    return Promise.resolve();
  }, []);

  const setData = useCallback(
    (newData: React.SetStateAction<DashboardData | null>) => {
      // This is a read-only hook, setData is not implemented
      console.warn('setData is not implemented in useDashboardData hook');
    },
    []
  );

  return {
    data,
    loading,
    error,
    refetch,
    setData,
  };
}

// Real-time updates hook (for future implementation)
export function useRealtimeUpdates() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // In a real app, this would connect to WebSocket or Server-Sent Events
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { lastUpdate };
}
