// Application constants
export const APP_CONFIG = {
  name: 'Junta de Vecinos Pinto Los Pellines',
  version: '1.0.0',
  region: 'Ñuble, Chile',
  coordinates: {
    latitude: -36.7007,
    longitude: -72.3007
  }
} as const

// Chilean emergency numbers
export const EMERGENCY_NUMBERS = {
  fire: '133',
  police: '149',
  ambulance: '131',
  electricity: '+56 9 8765 4321'
} as const

// Community categories
export const COMMUNITY_CATEGORIES = [
  'Reunión',
  'Ambiental',
  'Seguridad',
  'Salud',
  'Cultural',
  'Educación',
  'Deportes',
  'Social'
] as const

// User roles
export const USER_ROLES = {
  admin: 'admin',
  user: 'user',
  moderator: 'moderator'
} as const

// Event status
export const EVENT_STATUS = {
  planned: 'planned',
  confirmed: 'confirmed',
  cancelled: 'cancelled',
  completed: 'completed'
} as const

// Priority levels
export const PRIORITY_LEVELS = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  urgent: 'urgent'
} as const