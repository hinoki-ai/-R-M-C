import { v } from 'convex/values';

import { mutation } from '../_generated/server';

// Real Chilean RSS feeds for Ñuble region and Pinto Los Pellines community
const CHILEAN_RSS_FEEDS = [
  // La Discusión (local newspaper for Ñuble region)
  {
    name: 'La Discusión',
    url: 'https://www.ladiscusion.cl/feed/',
    description: 'Diario regional de Ñuble con noticias locales',
    category: 'local' as const,
    region: 'Ñuble',
    fetchInterval: 60, // 1 hour
    logoUrl: 'https://www.ladiscusion.cl/wp-content/themes/ladiscusion/images/logo.png',
  },
  // National news
  {
    name: 'Emol',
    url: 'https://www.emol.com/feed/',
    description: 'Principales noticias de Chile',
    category: 'news' as const,
    region: 'Nacional',
    fetchInterval: 30, // 30 minutes
    logoUrl: 'https://static.emol.cl/emol50/img/logo-emol.svg',
  },
  {
    name: 'Radio Cooperativa',
    url: 'https://www.cooperativa.cl/feed/',
    description: 'Radio Cooperativa - noticias y análisis',
    category: 'news' as const,
    region: 'Nacional',
    fetchInterval: 30,
    logoUrl: 'https://www.cooperativa.cl/wp-content/themes/cooperativa/images/logo-cooperativa.svg',
  },
  // Sports
  {
    name: 'AS Chile',
    url: 'https://chile.as.com/rss.xml',
    description: 'Deportes y fútbol chileno',
    category: 'sports' as const,
    region: 'Nacional',
    fetchInterval: 45,
    logoUrl: 'https://as01.epimg.net/img/comunes/favicons/as/v2.0/apple-touch-icon.png',
  },
  // Local Pinto/Ñuble news - using regional news
  {
    name: 'Diario La Tribuna',
    url: 'https://www.latribuna.cl/feed/',
    description: 'Noticias regionales de Ñuble y Biobío',
    category: 'local' as const,
    region: 'Ñuble',
    fetchInterval: 120, // 2 hours
    logoUrl: 'https://www.latribuna.cl/wp-content/themes/latribuna/images/logo.png',
  },
  // Emergency information
  {
    name: 'ONEMI Chile',
    url: 'https://www.onemi.cl/feed/',
    description: 'Alertas y emergencias a nivel nacional',
    category: 'emergency' as const,
    region: 'Nacional',
    fetchInterval: 15, // 15 minutes - critical updates
    logoUrl: 'https://www.onemi.cl/wp-content/themes/onemi/images/logo-onemi.png',
  },
  // Politics
  {
    name: 'El Mostrador',
    url: 'https://www.elmostrador.cl/feed/',
    description: 'Análisis político y noticias',
    category: 'politics' as const,
    region: 'Nacional',
    fetchInterval: 60,
    logoUrl: 'https://www.elmostrador.cl/wp-content/themes/elmostrador/images/logo-elmostrador.svg',
  },
  // Additional news sources
  {
    name: 'CNN Chile',
    url: 'https://www.cnnchile.com/feed/',
    description: 'Noticias de CNN Chile',
    category: 'news' as const,
    region: 'Nacional',
    fetchInterval: 30,
    logoUrl: 'https://www.cnnchile.com/pf/resources/images/logo-cnn-chile.svg',
  },
  {
    name: 'T13',
    url: 'https://www.t13.cl/feed/',
    description: 'Televisión Nacional de Chile - noticias',
    category: 'news' as const,
    region: 'Nacional',
    fetchInterval: 30,
    logoUrl: 'https://www.t13.cl/static/t13/images/logo-t13.svg',
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

    console.log('📰 RSS seeding completed!');
    console.log(`   Created: ${feedsCreated} feeds`);
    console.log(`   Skipped: ${skipped} existing feeds`);

    return {
      seeded: feedsCreated,
      skipped,
      total: feedsCreated + skipped,
      message: 'RSS feeds seeding completed successfully'
    };
  },
});