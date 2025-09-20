import { useState, useEffect, useCallback } from 'react'
import { DashboardData, UseDashboardDataReturn, User, MaintenanceRequest, PaymentRecord } from '@/types/dashboard'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { delay } from '@/lib/utils/utils'


// Specialized hooks for different data types
export function useAnnouncements(userId?: string) {
  const { data, loading, error, refetch } = useDashboardData()

  const announcements = data?.announcements || []
  const unreadCount = announcements.filter(announcement => !announcement.isRead).length

  const markAsRead = useCallback(async (announcementId: string) => {
    try {
      // In a real app, this would be an API call
      await delay(500)
      console.log(`Marked announcement ${announcementId} as read`)
      refetch() // Refresh data from server
    } catch (err) {
      console.error('Failed to mark announcement as read:', err)
    }
  }, [refetch])

  const markAllAsRead = useCallback(async () => {
    try {
      await delay(500)
      console.log('Marked all announcements as read')
      refetch() // Refresh data from server
    } catch (err) {
      console.error('Failed to mark all announcements as read:', err)
    }
  }, [refetch])

  return {
    announcements,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch
  }
}

export function useEvents() {
  const { data, loading, error, refetch } = useDashboardData()

  const events = data?.recentEvents || []
  const upcomingEvents = events.filter(event =>
    new Date(event.date) >= new Date()
  )

  const rsvpToEvent = useCallback(async (eventId: string) => {
    try {
      // In a real app, this would be an API call
      await delay(500)
      console.log(`RSVP to event ${eventId}`)
      // You could update local state or trigger a refetch
    } catch (err) {
      console.error('Failed to RSVP to event:', err)
    }
  }, [])

  return {
    events,
    upcomingEvents,
    loading,
    error,
    rsvpToEvent,
    refetch
  }
}

export function useMaintenance() {
  const { data, loading, error, refetch } = useDashboardData()

  const maintenanceRequests = data?.pendingMaintenance || []
  const pendingCount = maintenanceRequests.filter(req => req.status === 'pending').length

  const submitMaintenanceRequest = useCallback(async (request: Omit<MaintenanceRequest, 'id' | 'reportedAt' | 'status'>) => {
    try {
      // In a real app, this would be an API call
      await delay(500)

      const newRequest: MaintenanceRequest = {
        ...request,
        id: Date.now().toString(),
        reportedAt: new Date().toISOString(),
        status: 'pending'
      }

      console.log('New maintenance request:', newRequest)
      refetch() // Refresh data
    } catch (err) {
      console.error('Failed to submit maintenance request:', err)
    }
  }, [refetch])

  return {
    maintenanceRequests,
    pendingCount,
    loading,
    error,
    submitMaintenanceRequest,
    refetch
  }
}

export function usePayments() {
  const { data, loading, error, refetch } = useDashboardData()

  const payments = data?.recentPayments || []
  const totalAmount = payments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0)

  const submitPayment = useCallback(async (payment: Omit<PaymentRecord, 'id' | 'date' | 'status' | 'userId'>) => {
    try {
      // In a real app, this would be an API call
      await delay(500)

      const newPayment: PaymentRecord = {
        ...payment,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: 'pending',
        userId: data?.user.id || '1'
      }

      console.log('New payment:', newPayment)
      refetch() // Refresh data
    } catch (err) {
      console.error('Failed to submit payment:', err)
    }
  }, [data?.user.id, refetch])

  return {
    payments,
    totalAmount,
    loading,
    error,
    submitPayment,
    refetch
  }
}

export function useProjects() {
  const { data, loading, error, refetch } = useDashboardData()

  const projects = data?.activeProjects || []
  const totalRaised = projects.reduce((sum, project) => sum + project.raised, 0)
  const totalGoal = projects.reduce((sum, project) => sum + project.goal, 0)

  const contributeToProject = useCallback(async (projectId: string, amount: number) => {
    try {
      // In a real app, this would be an API call
      await delay(500)
      console.log(`Contribute $${amount} to project ${projectId}`)
      refetch() // Refresh data
    } catch (err) {
      console.error('Failed to contribute to project:', err)
    }
  }, [refetch])

  return {
    projects,
    totalRaised,
    totalGoal,
    loading,
    error,
    contributeToProject,
    refetch
  }
}

// Real dashboard data hook using Convex
export function useDashboardData(): UseDashboardDataReturn {
  // Get current user
  const currentUser = useQuery(api.users.current)

  // Get dashboard stats
  const stats = useQuery(api.community.getDashboardStats)

  // Get announcements
  const announcements = useQuery(api.community.getAnnouncements)

  // Get recent events
  const recentEvents = useQuery(api.calendar.getEvents, {
    limit: 5,
    upcomingOnly: true
  })

  // Get maintenance requests
  const pendingMaintenance = useQuery(api.community.getMaintenanceRequests)

  // Get payments
  const recentPayments = useQuery(api.community.getPayments)

  // Get community projects
  const activeProjects = useQuery(api.community.getCommunityProjects)

  // Transform data to match expected format
  const data: DashboardData | null = currentUser && stats && announcements && recentEvents && pendingMaintenance && recentPayments && activeProjects ? {
    user: {
      id: currentUser._id,
      name: currentUser.name,
      email: '', // Email not stored in users table for privacy
      role: 'user', // Default role
      isAdmin: false // Default admin status
    },
    stats: [
      {
        label: 'Vecinos Registrados',
        value: stats.totalUsers.toString(),
        change: stats.userGrowth || '0%', // Use real growth data
        icon: 'Users',
        color: 'text-blue-600',
        trend: stats.userGrowth && parseFloat(stats.userGrowth) > 0 ? 'up' : 'stable'
      },
      {
        label: 'Proyectos Activos',
        value: stats.activeProjects.toString(),
        change: stats.projectGrowth || '0%', // Use real project growth data
        icon: 'Activity',
        color: 'text-green-600',
        trend: stats.projectGrowth && parseFloat(stats.projectGrowth) > 0 ? 'up' : 'stable'
      },
      {
        label: 'Solicitudes Pendientes',
        value: stats.pendingMaintenance.toString(),
        change: stats.maintenanceChange || '0%', // Use real maintenance change data
        icon: 'AlertCircle',
        color: 'text-purple-600',
        trend: stats.maintenanceChange && parseFloat(stats.maintenanceChange) > 0 ? 'up' : 'stable'
      },
      {
        label: 'Aportes Totales',
        value: `$${(stats.totalContributions / 100).toLocaleString()}`,
        change: stats.contributionGrowth || '0%', // Use real contribution growth data
        icon: 'DollarSign',
        color: 'text-orange-600',
        trend: stats.contributionGrowth && parseFloat(stats.contributionGrowth) > 0 ? 'up' : 'stable'
      }
    ],
    announcements: announcements.map(announcement => ({
      id: announcement._id,
      title: announcement.title,
      content: announcement.content,
      author: currentUser.name, // Simplified - would need to join with users table
      publishedAt: new Date(announcement.publishedAt).toISOString(),
      priority: announcement.priority,
      category: announcement.category,
      isRead: announcement.readBy?.includes(currentUser._id) || false
    })),
    recentEvents: recentEvents.map(event => ({
      id: event._id,
      title: event.title,
      description: event.description || '',
      date: event.startDate,
      time: event.startTime || 'Todo el día',
      location: event.location || 'Por confirmar',
      organizer: currentUser.name, // Simplified - would need to join with users table
      category: event.categoryId, // Would need to resolve category name
      isMandatory: event.isMandatory || false, // Use real data from event
      attendees: event.attendeeCount || 0 // Use real attendee count from event
    })),
    pendingMaintenance: pendingMaintenance.map(request => ({
      id: request._id,
      title: request.title,
      description: request.description,
      location: request.location,
      priority: request.priority,
      status: request.status,
      reportedBy: currentUser.name, // Simplified - would need to join with users table
      reportedAt: new Date(request.reportedAt).toISOString(),
      category: request.category,
      assignedTo: request.assignedTo ? currentUser.name : undefined // Simplified
    })),
    recentPayments: recentPayments.map(payment => ({
      id: payment._id,
      amount: payment.amount,
      description: payment.description,
      date: payment.paidAt ? new Date(payment.paidAt).toISOString().split('T')[0] : new Date(payment.createdAt).toISOString().split('T')[0],
      status: payment.status,
      type: payment.type,
      userId: payment.userId
    })),
    activeProjects: activeProjects.map(project => ({
      id: project._id,
      title: project.title,
      description: project.description,
      goal: project.goal,
      raised: project.raised,
      deadline: project.deadline,
      category: project.category,
      status: project.status
    }))
  } : null

  const loading = !currentUser || !stats || !announcements || !recentEvents || !pendingMaintenance || !recentPayments || !activeProjects
  const error = null // Convex handles errors internally

  const refetch = useCallback(async () => {
    // Convex queries automatically refetch when dependencies change
    // No manual refetch needed - real-time updates handled by Convex
    return Promise.resolve()
  }, [])

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Real-time updates hook (for future implementation)
export function useRealtimeUpdates() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // In a real app, this would connect to WebSocket or Server-Sent Events
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return { lastUpdate }
}