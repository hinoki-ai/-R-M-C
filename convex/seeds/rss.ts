import { mutation } from '../_generated/server';
import { v } from 'convex/values';

// Chilean RSS feeds relevant for Ñuble region and Pinto Los Pellines community
const CHILEAN_RSS_FEEDS = [
  // La Discusión (local newspaper for Ñuble region)
  {
    name: 'La Discusión',
    url: 'https://www.ladiscusion.cl/feed/', // Placeholder - would need real RSS URL
    description: 'Diario regional de Ñuble con noticias locales',
    category: 'local' as const,
    region: 'Ñuble',
    fetchInterval: 60, // 1 hour
    logoUrl: 'https://www.ladiscusion.cl/wp-content/themes/ladiscusion/images/logo.png', // Placeholder
  },
  // National news
  {
    name: 'El Mercurio',
    url: 'https://www.emol.com/feed/', // Placeholder
    description: 'Principales noticias de Chile',
    category: 'news' as const,
    region: 'Nacional',
    fetchInterval: 30, // 30 minutes
    logoUrl: 'https://www.emol.com/logo.png', // Placeholder
  },
  {
    name: 'Cooperativa',
    url: 'https://www.cooperativa.cl/feed/', // Placeholder
    description: 'Radio Cooperativa - noticias y análisis',
    category: 'news' as const,
    region: 'Nacional',
    fetchInterval: 30,
    logoUrl: 'https://www.cooperativa.cl/logo.png', // Placeholder
  },
  // Sports
  {
    name: 'AS Chile',
    url: 'https://chile.as.com/rss/', // Placeholder
    description: 'Deportes y fútbol chileno',
    category: 'sports' as const,
    region: 'Nacional',
    fetchInterval: 45,
    logoUrl: 'https://chile.as.com/logo.png', // Placeholder
  },
  // Local Pinto/Ñuble news
  {
    name: 'Municipalidad de Pinto',
    url: 'https://www.pinto.cl/feed/', // Placeholder - would be municipal RSS
    description: 'Noticias y anuncios municipales',
    category: 'local' as const,
    region: 'Pinto',
    fetchInterval: 120, // 2 hours
    logoUrl: 'https://www.pinto.cl/logo.png', // Placeholder
  },
  // Emergency information
  {
    name: 'ONEMI Ñuble',
    url: 'https://www.onemi.cl/region-de-nuble/feed/', // Placeholder
    description: 'Alertas y emergencias regionales',
    category: 'emergency' as const,
    region: 'Ñuble',
    fetchInterval: 15, // 15 minutes - critical updates
    logoUrl: 'https://www.onemi.cl/logo.png', // Placeholder
  },
  // Politics
  {
    name: 'El Mostrador',
    url: 'https://www.elmostrador.cl/feed/', // Placeholder
    description: 'Análisis político y noticias',
    category: 'politics' as const,
    region: 'Nacional',
    fetchInterval: 60,
    logoUrl: 'https://www.elmostrador.cl/logo.png', // Placeholder
  },
];

export const seedRssFeeds = mutation({
  args: {
    forceProduction: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    console.log('📰 Starting RSS feeds seeding...');

    // PRODUCTION SAFETY CHECK
    const isProduction = process.env.NODE_ENV === 'production' ||
                        process.env.CONVEX_ENV === 'production' ||
                        !process.env.CONVEX_DEV;

    if (isProduction && !args.forceProduction) {
      console.log('🚨 PRODUCTION ENVIRONMENT DETECTED!');
      console.log('❌ RSS seeding is DISABLED by default in production');
      console.log('💡 To seed in production, set forceProduction: true');
      return {
        seeded: 0,
        skipped: true,
        message: 'Production seeding skipped - use forceProduction: true to override'
      };
    }

    let feedsCreated = 0;
    let skipped = 0;

    // Get the first admin user to set as creator
    const adminUser = await ctx.db.query('users').filter(q => q.eq(q.field('role'), 'admin')).first();
    const defaultUser = adminUser || await ctx.db.query('users').first();

    if (!defaultUser) {
      console.log('⚠️ No users found in database. Please create a user first.');
      return {
        seeded: 0,
        skipped: true,
        message: 'No users available to create RSS feeds'
      };
    }

    for (const feedData of CHILEAN_RSS_FEEDS) {
      // Check if feed already exists
      const existing = await ctx.db
        .query('rssFeeds')
        .filter(q =>
          q.and(
            q.eq(q.field('name'), feedData.name),
            q.eq(q.field('region'), feedData.region)
          )
        )
        .first();

      if (existing) {
        console.log(`⏭️ Skipping existing RSS feed: ${feedData.name}`);
        skipped++;
        continue;
      }

      try {
        await ctx.db.insert('rssFeeds', {
          ...feedData,
          isActive: true,
          createdBy: defaultUser._id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        console.log(`✅ Created RSS feed: ${feedData.name}`);
        feedsCreated++;
      } catch (error) {
        console.error(`❌ Failed to create RSS feed ${feedData.name}:`, error);
      }
    }

    console.log(`📰 RSS seeding completed!`);
    console.log(`   Created: ${feedsCreated} feeds`);
    console.log(`   Skipped: ${skipped} existing feeds`);

    return {
      seeded: feedsCreated,
      skipped,
      total: feedsCreated + skipped,
      message: `RSS feeds seeding completed successfully`
    };
  },
});