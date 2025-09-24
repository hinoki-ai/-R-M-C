import { v } from 'convex/values';
import { mutation } from '../_generated/server';

export const seedContacts = mutation({
  args: {},
  handler: async ctx => {
    console.log('📞 Seeding contact data...');

    const contacts = [
      // Directiva Junta de Vecinos
      {
        name: 'María González',
        position: 'Presidenta',
        department: 'Directiva',
        phone: '+56 9 8765 4321',
        email: 'presidenta@juntapellines.cl',
        address: 'Centro Comunitario, Pinto Los Pellines',
        availability: 'Lunes a Viernes 9:00-18:00',
        hours: '9:00-18:00',
        type: 'directiva' as const,
        description: 'Presidenta de la Junta de Vecinos de Pinto Los Pellines',
        location: 'Centro Comunitario',
      },
      {
        name: 'Juan Pérez',
        position: 'Secretario',
        department: 'Directiva',
        phone: '+56 9 7654 3210',
        email: 'secretario@juntapellines.cl',
        address: 'Centro Comunitario, Pinto Los Pellines',
        availability: 'Lunes a Viernes 9:00-17:00',
        hours: '9:00-17:00',
        type: 'directiva' as const,
        description: 'Secretario de la Junta de Vecinos',
        location: 'Centro Comunitario',
      },
      {
        name: 'Ana López',
        position: 'Tesorera',
        department: 'Directiva',
        phone: '+56 9 6543 2109',
        email: 'tesorera@juntapellines.cl',
        address: 'Centro Comunitario, Pinto Los Pellines',
        availability: 'Lunes a Viernes 10:00-16:00',
        hours: '10:00-16:00',
        type: 'directiva' as const,
        description: 'Tesorera de la Junta de Vecinos',
        location: 'Centro Comunitario',
      },

      // Seguridad
      {
        name: 'Carlos Rodríguez',
        position: 'Coordinador de Seguridad',
        department: 'Seguridad Comunitaria',
        phone: '+56 9 5432 1098',
        email: 'seguridad@juntapellines.cl',
        address: 'Centro Comunitario, Pinto Los Pellines',
        availability: '24/7',
        hours: '24/7',
        type: 'seguridad' as const,
        description: 'Coordinador de seguridad comunitaria',
        location: 'Centro Comunitario',
      },

      // Servicios Sociales
      {
        name: 'Patricia Morales',
        position: 'Coordinadora Social',
        department: 'Servicios Sociales',
        phone: '+56 9 4321 0987',
        email: 'social@juntapellines.cl',
        address: 'Centro Comunitario, Pinto Los Pellines',
        availability: 'Lunes a Viernes 8:00-16:00',
        hours: '8:00-16:00',
        type: 'social' as const,
        description: 'Coordinadora de programas sociales',
        location: 'Centro Comunitario',
      },

      // Servicios Municipales
      {
        name: 'Municipalidad de Pinto',
        position: 'Oficina Municipal',
        department: 'Municipalidad',
        phone: '+56 42 123 4567',
        email: 'municipalidad@pinto.cl',
        address: 'Plaza de Armas 123, Pinto',
        availability: 'Lunes a Viernes 8:30-17:00',
        hours: '8:30-17:00',
        type: 'municipal' as const,
        description: 'Oficina central de la Municipalidad de Pinto',
        location: 'Plaza de Armas',
      },
      {
        name: 'Oficina de Agua Potable',
        position: 'Agua Potable',
        department: 'Servicios Básicos',
        phone: '+56 42 123 4568',
        email: 'agua@pinto.cl',
        address: 'Calle Los Pinos 456, Pinto',
        availability: 'Lunes a Viernes 8:00-16:00',
        hours: '8:00-16:00',
        type: 'municipal' as const,
        description: 'Servicio de agua potable municipal',
        location: 'Calle Los Pinos 456',
      },

      // Salud
      {
        name: 'Centro de Salud Pinto',
        position: 'Centro Médico',
        department: 'Salud',
        phone: '+56 42 123 4569',
        email: 'salud@pinto.cl',
        address: 'Avenida Principal 789, Pinto',
        availability: 'Lunes a Viernes 8:00-18:00, Sábado 9:00-13:00',
        hours: '8:00-18:00',
        type: 'health' as const,
        description: 'Centro de salud familiar de Pinto',
        location: 'Avenida Principal 789',
      },
      {
        name: 'Farmacia Pinto',
        position: 'Farmacia',
        department: 'Salud',
        phone: '+56 42 123 4570',
        email: 'farmacia@pinto.cl',
        address: 'Calle Comercio 321, Pinto',
        availability: 'Lunes a Domingo 9:00-20:00',
        hours: '9:00-20:00',
        type: 'health' as const,
        description: 'Farmacia municipal de Pinto',
        location: 'Calle Comercio 321',
      },

      // Policía
      {
        name: 'Retén Pinto',
        position: 'Carabineros',
        department: 'Policía',
        phone: '133',
        email: 'reten@pinto.cl',
        address: 'Calle Seguridad 654, Pinto',
        availability: '24/7',
        hours: '24/7',
        type: 'police' as const,
        description: 'Retén de Carabineros de Pinto',
        location: 'Calle Seguridad 654',
      },

      // Bomberos
      {
        name: 'Cuerpo de Bomberos Pinto',
        position: 'Bomberos',
        department: 'Emergencias',
        phone: '132',
        email: 'bomberos@pinto.cl',
        address: 'Avenida Emergencias 987, Pinto',
        availability: '24/7',
        hours: '24/7',
        type: 'fire' as const,
        description: 'Cuerpo de Bomberos de Pinto',
        location: 'Avenida Emergencias 987',
      },

      // Servicios Comunitarios
      {
        name: 'Club Deportivo Pinto',
        position: 'Deportes',
        department: 'Deportes',
        phone: '+56 9 3210 9876',
        email: 'deportes@pinto.cl',
        address: 'Cancha Municipal, Pinto',
        availability: 'Lunes a Domingo 6:00-22:00',
        hours: '6:00-22:00',
        type: 'service' as const,
        description: 'Club deportivo comunitario',
        location: 'Cancha Municipal',
      },
      {
        name: 'Biblioteca Municipal',
        position: 'Biblioteca',
        department: 'Educación',
        phone: '+56 42 123 4571',
        email: 'biblioteca@pinto.cl',
        address: 'Centro Cultural, Pinto',
        availability: 'Martes a Sábado 10:00-18:00',
        hours: '10:00-18:00',
        type: 'service' as const,
        description: 'Biblioteca pública municipal',
        location: 'Centro Cultural',
      },
    ];

    // Get the first admin user for createdBy
    const adminUser = await ctx.db.query('users').first();
    if (!adminUser) {
      throw new Error(
        'No admin user found. Please create an admin user first.'
      );
    }

    const now = Date.now();
    let created = 0;

    for (const contactData of contacts) {
      try {
        await ctx.db.insert('contacts', {
          ...contactData,
          isActive: true,
          createdBy: adminUser._id,
          createdAt: now,
          updatedAt: now,
        });
        created++;
      } catch (error) {
        console.error(`Failed to create contact ${contactData.name}:`, error);
      }
    }

    console.log(`✅ Created ${created} contacts`);

    return {
      contactsCreated: created,
      message: `Successfully seeded ${created} contacts`,
    };
  },
});
