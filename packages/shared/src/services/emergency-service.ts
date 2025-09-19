import { z } from 'zod'

// Emergency service schemas
export const EmergencyContactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  type: z.enum(['police', 'medical', 'fire', 'community', 'security']),
  description: z.string().min(1, 'La descripción es requerida'),
  available24h: z.boolean().default(false)
})

export const EmergencyReportSchema = z.object({
  type: z.enum(['fire', 'medical', 'security', 'accident', 'natural_disaster', 'other']),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  location: z.string().min(1, 'La ubicación es requerida'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  reporterName: z.string().min(1, 'El nombre del reportador es requerido'),
  reporterPhone: z.string().min(1, 'El teléfono del reportador es requerido'),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional()
})

export const EmergencyProtocolSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  type: z.enum(['fire', 'earthquake', 'flood', 'security', 'medical', 'general']),
  steps: z.array(z.string()).min(1, 'Debe incluir al menos un paso'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  active: z.boolean().default(true)
})

// Emergency service class
export class EmergencyService {
  private static instance: EmergencyService

  static getInstance(): EmergencyService {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService()
    }
    return EmergencyService.instance
  }

  async getEmergencyContacts() {
    // Get list of emergency contacts
    return {
      success: true,
      contacts: [
        {
          id: '1',
          name: 'Carabineros de Chile',
          phone: '133',
          type: 'police' as const,
          description: 'Policía uniformada - Emergencias y seguridad ciudadana',
          available24h: true,
          location: 'Nacional'
        },
        {
          id: '2',
          name: 'SAMU',
          phone: '131',
          type: 'medical' as const,
          description: 'Servicio de ambulancias y emergencias médicas',
          available24h: true,
          location: 'Regional'
        },
        {
          id: '3',
          name: 'Bomberos Pinto',
          phone: '+56 9 1234 5678',
          type: 'fire' as const,
          description: 'Cuerpo de bomberos local - Incendios y rescates',
          available24h: true,
          location: 'Pinto Los Pellines'
        },
        {
          id: '4',
          name: 'Presidenta Junta de Vecinos',
          phone: '+56 9 8765 4321',
          type: 'community' as const,
          description: 'Directiva Junta de Vecinos Pinto Los Pellines',
          available24h: false,
          location: 'Pinto Los Pellines'
        }
      ]
    }
  }

  async getEmergencyProtocols() {
    // Get list of emergency response protocols
    return {
      success: true,
      protocols: [
        {
          id: '1',
          title: 'Protocolo de Incendio',
          description: 'Actuación ante incendios forestales o estructurales',
          type: 'fire' as const,
          steps: [
            'Activar alarma de incendio',
            'Evacuar el área inmediatamente',
            'Llamar a Bomberos (133)',
            'No intentar apagar grandes incendios',
            'Ayudar a personas vulnerables'
          ],
          severity: 'high' as const,
          active: true
        },
        {
          id: '2',
          title: 'Protocolo Sísmico',
          description: 'Actuación durante y después de un terremoto',
          type: 'earthquake' as const,
          steps: [
            'Protegerse bajo una mesa resistente',
            'Mantener la calma',
            'Después del sismo, evacuar ordenadamente',
            'Revisar daños estructurales',
            'Ayudar a heridos y damnificados'
          ],
          severity: 'critical' as const,
          active: true
        },
        {
          id: '3',
          title: 'Protocolo de Seguridad Vecinal',
          description: 'Actuación ante situaciones de inseguridad',
          type: 'security' as const,
          steps: [
            'Contactar inmediatamente a Carabineros (133)',
            'Alertar a la ronda vecinal',
            'No intervenir directamente en riesgos',
            'Documentar lo sucedido',
            'Reportar a la Junta de Vecinos'
          ],
          severity: 'medium' as const,
          active: true
        }
      ]
    }
  }

  async reportEmergency(reportData: z.infer<typeof EmergencyReportSchema>) {
    const validatedData = EmergencyReportSchema.parse(reportData)

    // Submit emergency report
    return {
      success: true,
      report: {
        id: 'emergency-report-' + Date.now(),
        ...validatedData,
        status: 'reported',
        reportedAt: new Date(),
        assignedTo: null,
        estimatedResponseTime: '15-30 minutos'
      }
    }
  }

  async getEmergencyHistory(userId?: string) {
    // Get emergency report history
    return {
      success: true,
      reports: [
        {
          id: '1',
          type: 'medical',
          description: 'Accidente menor en Calle Real',
          location: 'Calle Real 123',
          priority: 'medium',
          status: 'resolved',
          reportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          resolvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        }
      ]
    }
  }

  async getEmergencyAlerts() {
    // Get active emergency alerts
    return {
      success: true,
      alerts: [
        {
          id: '1',
          title: 'Alerta de Viento',
          description: 'Vientos fuertes previstos para las próximas horas',
          severity: 'medium',
          areas: ['Pinto Los Pellines', 'Cobquecura'],
          startTime: new Date(),
          endTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
        }
      ]
    }
  }

  getEmergencyIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'police': '🚔',
      'medical': '🚑',
      'fire': '🔥',
      'community': '🏘️',
      'security': '🛡️',
      'accident': '🚨',
      'natural_disaster': '🌪️',
      'other': '⚠️'
    }
    return iconMap[type] || '🚨'
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  getPriorityLevel(priority: string): number {
    switch (priority) {
      case 'critical':
        return 4
      case 'high':
        return 3
      case 'medium':
        return 2
      case 'low':
        return 1
      default:
        return 2
    }
  }

  // Utility method to format emergency contact for display
  formatEmergencyContact(contact: any): string {
    return `${contact.name}: ${contact.phone}${contact.available24h ? ' (24h)' : ''}`
  }

  // Utility method to get recommended action for emergency type
  getRecommendedAction(type: string): string {
    const actions: { [key: string]: string } = {
      'fire': 'Evacuar el área y llamar a Bomberos (133)',
      'medical': 'Llamar a SAMU (131) o llevar al hospital más cercano',
      'security': 'Contactar a Carabineros (133) y alertar a la ronda vecinal',
      'accident': 'Asegurar la zona, llamar a emergencias y no mover heridos',
      'natural_disaster': 'Seguir protocolos de la ONEMI y evacuar si es necesario',
      'other': 'Contactar a la Junta de Vecinos para asistencia'
    }
    return actions[type] || 'Contactar servicios de emergencia'
  }
}