import { z } from 'zod'

// User types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'user', 'moderator']),
  isAdmin: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type User = z.infer<typeof UserSchema>

// Announcement types
export const AnnouncementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string().optional(),
  category: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  authorId: z.string(),
  isPublished: z.boolean(),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Announcement = z.infer<typeof AnnouncementSchema>

// Event types
export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  time: z.string(),
  location: z.string(),
  category: z.string(),
  status: z.enum(['planned', 'confirmed', 'cancelled', 'completed']),
  maxAttendees: z.number().optional(),
  attendees: z.array(z.string()),
  organizerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Event = z.infer<typeof EventSchema>

// Emergency types
export const EmergencyContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  description: z.string(),
  category: z.string(),
  isActive: z.boolean()
})

export type EmergencyContact = z.infer<typeof EmergencyContactSchema>

// Weather types
export const WeatherDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windDirection: z.string(),
  condition: z.string(),
  forecast: z.array(z.object({
    date: z.date(),
    condition: z.string(),
    minTemp: z.number(),
    maxTemp: z.number()
  }))
})

export type WeatherData = z.infer<typeof WeatherDataSchema>

// API Response types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional()
})

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number()
})

export type Pagination = z.infer<typeof PaginationSchema>

export const PaginatedResponseSchema = z.object({
  items: z.array(z.any()),
  pagination: PaginationSchema
})

export type PaginatedResponse<T> = {
  items: T[]
  pagination: Pagination
}