import { mutation } from '../_generated/server';
import { v } from 'convex/values';

// Emergency protocols for Ñuble region, Chile
const EMERGENCY_PROTOCOLS = [
  // Fire emergency protocol
  {
    title: 'Protocolo de Incendio',
    description: 'Procedimiento de emergencia para incendios forestales y urbanos',
    category: 'fire' as const,
    priority: 'critical' as const,
    pdfUrl: 'https://example.com/protocols/incendio-protocolo.pdf', // Placeholder - would be actual PDF URL
    thumbnailUrl: 'https://example.com/thumbnails/incendio-thumb.png', // Placeholder
    emergencyContacts: [
      { name: 'Bomberos Pinto', phone: '132', role: 'Servicio de Bomberos' },
      { name: 'CONAF Ñuble', phone: '+56-42-222-0000', role: 'Corporación Nacional Forestal' },
      { name: 'Policía Local', phone: '133', role: 'Carabineros de Chile' },
      { name: 'ONEMI Ñuble', phone: '2-2234-5000', role: 'Oficina Nacional de Emergencias' },
    ],
    steps: [
      'Evaluar la situación y determinar el tipo de incendio',
      'Alertar inmediatamente a los servicios de emergencia (Bomberos 132)',
      'Si es seguro, intentar controlar el fuego con extintores',
      'Evacuar el área siguiendo las rutas de escape designadas',
      'Dirigirse al punto de reunión establecido (Plaza Central)',
      'No regresar hasta que las autoridades lo permitan',
      'Reportar cualquier lesión o daño adicional',
    ],
  },
  // Medical emergency protocol
  {
    title: 'Emergencia Médica',
    description: 'Protocolo para situaciones médicas de urgencia',
    category: 'medical' as const,
    priority: 'high' as const,
    pdfUrl: 'https://example.com/protocols/emergencia-medica.pdf', // Placeholder
    thumbnailUrl: 'https://example.com/thumbnails/medica-thumb.png', // Placeholder
    emergencyContacts: [
      { name: 'SAMU', phone: '131', role: 'Servicio de Atención Médica de Urgencia' },
      { name: 'Hospital Pinto', phone: '+56-42-123-4567', role: 'Hospital local' },
      { name: 'Clínica Ñuble', phone: '+56-42-234-5678', role: 'Clínica privada' },
      { name: 'Cruz Roja', phone: '600-360-1000', role: 'Servicio voluntario' },
    ],
    steps: [
      'Evaluar el estado del paciente y determinar la urgencia',
      'Llamar inmediatamente al SAMU (131) si es una emergencia grave',
      'Proporcionar RCP si el paciente no respira y conoce el procedimiento',
      'No mover al paciente si hay sospecha de lesión en columna',
      'Mantener al paciente cómodo y vigilado',
      'Informar a familiares o contactos de emergencia',
      'Acompañar al paciente hasta la llegada de ayuda profesional',
    ],
  },
  // Police/security emergency protocol
  {
    title: 'Emergencia de Seguridad',
    description: 'Protocolo para situaciones de seguridad y delitos',
    category: 'security' as const,
    priority: 'high' as const,
    pdfUrl: 'https://example.com/protocols/emergencia-seguridad.pdf', // Placeholder
    thumbnailUrl: 'https://example.com/thumbnails/seguridad-thumb.png', // Placeholder
    emergencyContacts: [
      { name: 'Carabineros', phone: '133', role: 'Policía Nacional' },
      { name: 'PDI Pinto', phone: '+56-42-345-6789', role: 'Policía de Investigaciones' },
      { name: 'Guardia Municipal', phone: '+56-42-456-7890', role: 'Seguridad municipal' },
      { name: 'Fiscalía Local', phone: '+56-42-567-8901', role: 'Ministerio Público' },
    ],
    steps: [
      'Asegurar su propia seguridad primero',
      'Llamar inmediatamente a Carabineros (133)',
      'Proporcionar ubicación exacta y descripción detallada',
      'No confrontar al sospechoso si representa peligro',
      'Documentar lo sucedido con fotos/videos si es seguro',
      'Cooperar con las autoridades cuando lleguen',
      'Reportar a la comunidad a través de la app si es relevante',
      'Buscar apoyo psicológico si es necesario',
    ],
  },
  // Natural disaster protocol (earthquake focus for Chile)
  {
    title: 'Desastre Natural - Terremoto',
    description: 'Protocolo de respuesta ante terremotos y réplicas',
    category: 'natural_disaster' as const,
    priority: 'critical' as const,
    pdfUrl: 'https://example.com/protocols/terremoto-protocolo.pdf', // Placeholder
    thumbnailUrl: 'https://example.com/thumbnails/terremoto-thumb.png', // Placeholder
    emergencyContacts: [
      { name: 'ONEMI Nacional', phone: '2-2234-5000', role: 'Oficina Nacional de Emergencias' },
      { name: 'Carabineros', phone: '133', role: 'Policía Nacional' },
      { name: 'Bomberos', phone: '132', role: 'Servicio de Bomberos' },
      { name: 'Defensa Civil', phone: '+56-42-678-9012', role: 'Protección Civil' },
    ],
    steps: [
      'Mantener la calma y protegerse bajo una mesa resistente',
      'Cubrir cabeza y cuello con brazos para protección',
      'Después del movimiento, evacuar ordenadamente siguiendo rutas designadas',
      'No usar ascensores durante la evacuación',
      'Dirigirse al punto de reunión establecido (Plaza Central)',
      'Evaluar daños y reportar heridos a servicios de emergencia',
      'Escuchar radio o app para actualizaciones oficiales',
      'No regresar a estructuras dañadas sin autorización',
    ],
  },
  // Evacuation protocol
  {
    title: 'Protocolo de Evacuación',
    description: 'Procedimiento general de evacuación comunitaria',
    category: 'evacuation' as const,
    priority: 'high' as const,
    pdfUrl: 'https://example.com/protocols/evacuacion-protocolo.pdf', // Placeholder
    thumbnailUrl: 'https://example.com/thumbnails/evacuacion-thumb.png', // Placeholder
    emergencyContacts: [
      { name: 'Centro de Operaciones', phone: '+56-42-789-0123', role: 'Junta de Vecinos' },
      { name: 'Defensa Civil', phone: '+56-42-890-1234', role: 'Protección Civil' },
      { name: 'Carabineros', phone: '133', role: 'Control de tránsito' },
      { name: 'Bomberos', phone: '132', role: 'Apoyo logístico' },
    ],
    steps: [
      'Atender las señales de alerta (sirenas, app, megáfonos)',
      'Preparar kit de emergencia básico (documentos, medicamentos, agua)',
      'Cerrar válvulas de gas y electricidad si es seguro',
      'Ayudar a personas vulnerables (ancianos, discapacitados)',
      'Evacuar siguiendo las rutas marcadas y señaléticas',
      'No usar vehículos particulares para evitar congestionamiento',
      'Dirigirse al punto de reunión designado',
      'Registrar llegada en el punto de reunión',
      'Esperar instrucciones de las autoridades',
    ],
  },
];

export const seedEmergencyProtocols = mutation({
  args: {
    forceProduction: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    console.log('📋 Starting emergency protocols seeding...');

    // PRODUCTION SAFETY CHECK
    const isProduction = process.env.NODE_ENV === 'production' ||
                        process.env.CONVEX_ENV === 'production' ||
                        !process.env.CONVEX_DEV;

    if (isProduction && !args.forceProduction) {
      console.log('🚨 PRODUCTION ENVIRONMENT DETECTED!');
      console.log('❌ Emergency protocols seeding is DISABLED by default in production');
      console.log('💡 To seed in production, set forceProduction: true');
      return {
        seeded: 0,
        skipped: true,
        message: 'Production seeding skipped - use forceProduction: true to override'
      };
    }

    let protocolsCreated = 0;
    let skipped = 0;

    // Get the first admin user to set as creator
    const adminUser = await ctx.db.query('users').filter(q => q.eq(q.field('role'), 'admin')).first();
    const defaultUser = adminUser || await ctx.db.query('users').first();

    if (!defaultUser) {
      console.log('⚠️ No users found in database. Please create a user first.');
      return {
        seeded: 0,
        skipped: true,
        message: 'No users available to create emergency protocols'
      };
    }

    for (const protocolData of EMERGENCY_PROTOCOLS) {
      // Check if protocol already exists
      const existing = await ctx.db
        .query('emergencyProtocols')
        .filter(q =>
          q.and(
            q.eq(q.field('title'), protocolData.title),
            q.eq(q.field('category'), protocolData.category)
          )
        )
        .first();

      if (existing) {
        console.log(`⏭️ Skipping existing protocol: ${protocolData.title}`);
        skipped++;
        continue;
      }

      try {
        await ctx.db.insert('emergencyProtocols', {
          ...protocolData,
          isActive: true,
          offlineAvailable: true,
          downloadCount: 0,
          createdBy: defaultUser._id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        console.log(`✅ Created emergency protocol: ${protocolData.title}`);
        protocolsCreated++;
      } catch (error) {
        console.error(`❌ Failed to create protocol ${protocolData.title}:`, error);
      }
    }

    console.log(`📋 Emergency protocols seeding completed!`);
    console.log(`   Created: ${protocolsCreated} protocols`);
    console.log(`   Skipped: ${skipped} existing protocols`);

    return {
      seeded: protocolsCreated,
      skipped,
      total: protocolsCreated + skipped,
      message: `Emergency protocols seeding completed successfully`
    };
  },
});