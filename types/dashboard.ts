import React from 'react'

// Dashboard Types and Interfaces
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  isAdmin: boolean
  avatar?: string
  joinDate?: string
}

export interface DashboardSection {
  id: string
  label: string
  icon: string
  url: string
  description: string
  badge?: string
  priority?: 'high' | 'medium' | 'low'
  adminOnly?: boolean
  userOnly?: boolean
}

export interface Announcement {
  id: string
  title: string
  content: string
  author: string
  publishedAt: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'general' | 'emergency' | 'event' | 'maintenance'
  isRead?: boolean
}

export interface Document {
  id: string
  title: string
  description: string
  type: 'statutes' | 'minutes' | 'regulation' | 'financial' | 'plan'
  fileUrl: string
  fileSize: string
  uploadDate: string
  author: string
  isPublic: boolean
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  category: 'cultural' | 'social' | 'maintenance' | 'assembly'
  isMandatory?: boolean
  attendees?: number
}

export interface MaintenanceRequest {
  id: string
  title: string
  description: string
  location: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  reportedBy: string
  reportedAt: string
  assignedTo?: string
  category: 'roads' | 'lighting' | 'cleaning' | 'infrastructure' | 'other'
  photos?: string[]
}

export interface PaymentRecord {
  id: string
  amount: number
  description: string
  date: string
  status: 'pending' | 'completed' | 'failed'
  type: 'contribution' | 'project' | 'maintenance'
  userId: string
}

export interface WeatherData {
  id: string
  timestamp: string
  lastUpdated?: number
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  precipitation: number
  uvIndex: number
  visibility: number
  description: string
  icon: string
  feelsLike: number
  dewPoint: number
  cloudCover: number
  location: string
  source: 'api' | 'manual' | 'sensor'
  isHistorical?: boolean
}

export interface WeatherAlert {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'extreme'
  type: 'storm' | 'heat' | 'cold' | 'flood' | 'wind' | 'other'
  startTime: string
  endTime: string
  areas: string[]
  instructions: string
  isActive: boolean
  createdBy: string
  createdAt: string
}

export interface WeatherForecast {
  id: string
  date: string
  tempMin: number
  tempMax: number
  humidity: number
  precipitation: number
  precipitationProbability: number
  windSpeed: number
  windDirection: number
  description: string
  icon: string
  uvIndex: number
  sunrise: string
  sunset: string
  location: string
  source: 'api' | 'manual'
  updatedAt: string
}

export interface SystemStats {
  label: string
  value: string
  change: string
  icon: any // Lucide icon component
  color: string
  trend: 'up' | 'down' | 'stable'
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: any // Lucide icon component
  action: () => void
  color: string
  priority?: 'high' | 'medium' | 'low'
  adminOnly?: boolean
}

// Dashboard Configuration
export const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    id: 'overview',
    label: 'Panel General',
    icon: 'IconDashboard',
    url: '/dashboard',
    description: 'Vista general del estado comunitario',
    priority: 'high'
  },
  {
    id: 'cameras',
    label: 'Cámaras de Seguridad',
    icon: 'IconCamera',
    url: '/dashboard/cameras',
    description: 'Sistema de videovigilancia comunitaria',
    priority: 'high'
  },
  {
    id: 'announcements',
    label: 'Anuncios Comunidad',
    icon: 'IconBell',
    url: '/dashboard/announcements',
    description: 'Comunicados y noticias importantes',
    priority: 'medium'
  },
  {
    id: 'documents',
    label: 'Documentos Junta',
    icon: 'IconFileText',
    url: '/dashboard/documents',
    description: 'Documentos oficiales y estatutos',
    priority: 'medium'
  },
  {
    id: 'events',
    label: 'Eventos Comunidad',
    icon: 'IconCalendar',
    url: '/dashboard/events',
    description: 'Calendario de eventos comunitarios',
    priority: 'medium'
  },
  {
    id: 'maintenance',
    label: 'Mantenimiento',
    icon: 'IconSettings',
    url: '/dashboard/maintenance',
    description: 'Reportes y seguimiento de mantenimiento',
    priority: 'medium'
  },
  {
    id: 'payments',
    label: 'Aportes',
    icon: 'IconBarChart',
    url: '/dashboard/payments',
    description: 'Gestión de contribuciones y pagos',
    priority: 'medium'
  },
  {
    id: 'community',
    label: 'Comunidad',
    icon: 'IconUsers',
    url: '/dashboard/community',
    description: 'Información y gestión comunitaria',
    priority: 'low',
    adminOnly: true
  },
  {
    id: 'weather',
    label: 'Clima Comunidad',
    icon: 'IconCloud',
    url: '/dashboard/weather',
    description: 'Pronóstico del tiempo y alertas meteorológicas',
    priority: 'medium',
    adminOnly: true
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: 'IconSettings',
    url: '/dashboard/settings',
    description: 'Configuración personal y del sistema',
    priority: 'low'
  }
]

// Navigation Categories
export const NAVIGATION_GROUPS = {
  primary: ['overview', 'cameras', 'community', 'weather'],
  secondary: ['announcements', 'documents', 'events', 'maintenance', 'payments'],
  system: ['settings']
} as const

// Chilean Community Specific Types
export interface CommunityInfo {
  name: string
  location: string
  region: string
  population: number
  founded: string
  motto: string
  culturalElements: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  goal: number
  raised: number
  deadline: string
  category: 'infrastructure' | 'agricultural' | 'cultural' | 'health'
  status: 'active' | 'completed' | 'paused'
  photos?: string[]
}

// API Response Types
export interface DashboardData {
  user: User
  stats: SystemStats[]
  announcements: Announcement[]
  recentEvents: Event[]
  pendingMaintenance: MaintenanceRequest[]
  recentPayments: PaymentRecord[]
  activeProjects: Project[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Component Props Types
export interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
  currentSection?: string
}

export interface SectionHeaderProps {
  title: string
  description?: string
  icon?: string
  badge?: string
  actions?: React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
}

export interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, item: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

// Hook Types
export interface UseDashboardDataReturn {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setData: React.Dispatch<React.SetStateAction<DashboardData | null>>
}

export interface UseNavigationReturn {
  currentSection: string
  navigateTo: (sectionId: string) => void
  isActive: (sectionId: string) => boolean
}

// Utility Types
export type DashboardRole = 'admin' | 'user'
export type AnnouncementPriority = 'high' | 'medium' | 'low'
export type MaintenanceStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed'
export type EventCategory = 'cultural' | 'social' | 'maintenance' | 'assembly'
export type DocumentType = 'statutes' | 'minutes' | 'regulation' | 'financial' | 'plan'
export type ProjectStatus = 'active' | 'completed' | 'paused'
export type ProjectCategory = 'infrastructure' | 'agricultural' | 'cultural' | 'health'
export type WeatherAlertSeverity = 'low' | 'medium' | 'high' | 'extreme'
export type WeatherAlertType = 'storm' | 'heat' | 'cold' | 'flood' | 'wind' | 'other'
export type WeatherDataSource = 'api' | 'manual' | 'sensor'
export type WeatherForecastSource = 'api' | 'manual'