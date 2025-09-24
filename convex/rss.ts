import { v } from 'convex/values';

import { api } from './_generated/api';
import { action, mutation, query } from './_generated/server';

// Get all active RSS feeds
export const getRssFeeds = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('rssFeeds'),
      name: v.string(),
      url: v.string(),
      description: v.optional(v.string()),
      category: v.string(),
      region: v.string(),
      isActive: v.boolean(),
      lastFetched: v.optional(v.number()),
      fetchInterval: v.number(),
      logoUrl: v.optional(v.string()),
      createdAt: v.number(),
    })
  ),
  handler: async ctx => {
    const feeds = await ctx.db
      .query('rssFeeds')
      .filter(q => q.eq(q.field('isActive'), true))
      .collect();

    return feeds.map(feed => ({
      _id: feed._id,
      name: feed.name,
      url: feed.url,
      description: feed.description,
      category: feed.category,
      region: feed.region,
      isActive: feed.isActive,
      lastFetched: feed.lastFetched,
      fetchInterval: feed.fetchInterval,
      logoUrl: feed.logoUrl,
      createdAt: feed.createdAt,
    }));
  },
});

// Get all RSS feeds for admin (includes inactive ones)
export const getAllRssFeeds = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('rssFeeds'),
      name: v.string(),
      url: v.string(),
      description: v.optional(v.string()),
      category: v.string(),
      region: v.string(),
      isActive: v.boolean(),
      lastFetched: v.optional(v.number()),
      fetchInterval: v.number(),
      logoUrl: v.optional(v.string()),
      createdBy: v.id('users'),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async ctx => {
    const feeds = await ctx.db.query('rssFeeds').collect();

    return feeds;
  },
});

// Get RSS articles with pagination
export const getRssArticles = query({
  args: {
    category: v.optional(
      v.union(
        v.literal('news'),
        v.literal('sports'),
        v.literal('local'),
        v.literal('politics'),
        v.literal('emergency')
      )
    ),
    region: v.optional(v.string()),
    limit: v.optional(v.number()),
    includeArchived: v.optional(v.boolean()),
  },
  returns: v.array(
    v.object({
      _id: v.id('rssArticles'),
      feedId: v.id('rssFeeds'),
      title: v.string(),
      description: v.optional(v.string()),
      url: v.string(),
      author: v.optional(v.string()),
      publishedAt: v.number(),
      imageUrl: v.optional(v.string()),
      category: v.string(),
      region: v.string(),
      isRead: v.boolean(),
      tags: v.array(v.string()),
      feedName: v.string(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const includeArchived = args.includeArchived || false;

    let query = ctx.db.query('rssArticles');

    // Apply filters
    if (args.category) {
      query = query.filter(q => q.eq(q.field('category'), args.category));
    }

    if (args.region) {
      query = query.filter(q => q.eq(q.field('region'), args.region));
    }

    if (!includeArchived) {
      query = query.filter(q => q.eq(q.field('isArchived'), false));
    }

    const articles = await query.order('desc').take(limit);

    // Get feed names for each article
    const articlesWithFeedNames = await Promise.all(
      articles.map(async article => {
        const feed = await ctx.db.get(article.feedId);
        return {
          _id: article._id,
          feedId: article.feedId,
          title: article.title,
          description: article.description,
          url: article.url,
          author: article.author,
          publishedAt: article.publishedAt,
          imageUrl: article.imageUrl,
          category: article.category,
          region: article.region,
          isRead: article.isRead,
          tags: article.tags,
          feedName: feed?.name || 'Unknown Feed',
          createdAt: article.createdAt,
        };
      })
    );

    return articlesWithFeedNames;
  },
});

// Mark article as read/unread
export const markArticleAsRead = mutation({
  args: {
    articleId: v.id('rssArticles'),
    isRead: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.articleId, {
      isRead: args.isRead,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Archive/unarchive article
export const archiveArticle = mutation({
  args: {
    articleId: v.id('rssArticles'),
    isArchived: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.articleId, {
      isArchived: args.isArchived,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Create a new RSS feed
export const createRssFeed = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal('news'),
      v.literal('sports'),
      v.literal('local'),
      v.literal('politics'),
      v.literal('emergency')
    ),
    region: v.string(),
    fetchInterval: v.optional(v.number()),
    logoUrl: v.optional(v.string()),
    createdBy: v.id('users'),
  },
  returns: v.id('rssFeeds'),
  handler: async (ctx, args) => {
    const feedId = await ctx.db.insert('rssFeeds', {
      name: args.name,
      url: args.url,
      description: args.description,
      category: args.category,
      region: args.region,
      isActive: true,
      fetchInterval: args.fetchInterval || 60, // Default 1 hour
      logoUrl: args.logoUrl,
      createdBy: args.createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return feedId;
  },
});

// Fetch RSS feed and parse articles (server-side action)
export const fetchRssFeed: any = action({
  args: {
    feedId: v.id('rssFeeds'),
  },
  returns: v.object({
    success: v.boolean(),
    articlesFetched: v.number(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx: any, args: any) => {
    try {
      // Get the feed details
      const feed = await ctx.runQuery(api.rss.getFeedById, {
        feedId: args.feedId,
      });

      if (!feed || !feed.isActive) {
        return {
          success: false,
          articlesFetched: 0,
          error: 'Feed not found or inactive',
        };
      }

      // Fetch RSS content (simplified - in real implementation, use a proper RSS parser)
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'JuntaDeVecinos RSS Reader/1.0',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          articlesFetched: 0,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const rssText = await response.text();

      // Parse RSS (basic XML parsing - in production, use a proper RSS library)
      const articles = parseRSSBasic(rssText);

      let articlesFetched = 0;

      for (const article of articles) {
        // Check if article already exists
        const existing = await ctx.runQuery(api.rss.checkArticleExists, {
          feedId: args.feedId,
          url: article.url,
        });

        if (!existing) {
          await ctx.runMutation(api.rss.createRssArticle, {
            feedId: args.feedId,
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            author: article.author,
            publishedAt: article.publishedAt,
            imageUrl: article.imageUrl,
            category: feed.category,
            region: feed.region,
            tags: article.tags || [],
          });

          articlesFetched++;
        }
      }

      // Update feed's last fetched timestamp
      await ctx.runMutation(api.rss.updateFeedLastFetched, {
        feedId: args.feedId,
        lastFetched: Date.now(),
      });

      return {
        success: true,
        articlesFetched,
      };
    } catch (error) {
      console.error('RSS fetch error:', error);
      return {
        success: false,
        articlesFetched: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

// Helper queries and mutations for the action
export const getFeedById = query({
  args: { feedId: v.id('rssFeeds') },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id('rssFeeds'),
      name: v.string(),
      url: v.string(),
      category: v.string(),
      region: v.string(),
      isActive: v.boolean(),
      fetchInterval: v.number(),
    })
  ),
  handler: async (ctx: any, args: any) => {
    const feed = await ctx.db.get(args.feedId);
    if (!feed) return null;

    return {
      _id: feed._id,
      name: feed.name,
      url: feed.url,
      category: feed.category,
      region: feed.region,
      isActive: feed.isActive,
      fetchInterval: feed.fetchInterval,
    };
  },
});

export const checkArticleExists = query({
  args: {
    feedId: v.id('rssFeeds'),
    url: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('rssArticles')
      .filter(q =>
        q.and(
          q.eq(q.field('feedId'), args.feedId),
          q.eq(q.field('url'), args.url)
        )
      )
      .first();

    return !!existing;
  },
});

export const createRssArticle = mutation({
  args: {
    feedId: v.id('rssFeeds'),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    url: v.string(),
    author: v.optional(v.string()),
    publishedAt: v.number(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    region: v.string(),
    tags: v.array(v.string()),
  },
  returns: v.id('rssArticles'),
  handler: async (ctx, args) => {
    const articleId = await ctx.db.insert('rssArticles', {
      feedId: args.feedId,
      title: args.title,
      description: args.description,
      content: args.content,
      url: args.url,
      author: args.author,
      publishedAt: args.publishedAt,
      imageUrl: args.imageUrl,
      category: args.category,
      region: args.region,
      isRead: false,
      isArchived: false,
      tags: args.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return articleId;
  },
});

export const updateFeedLastFetched = mutation({
  args: {
    feedId: v.id('rssFeeds'),
    lastFetched: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.feedId, {
      lastFetched: args.lastFetched,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Update RSS feed
export const updateRssFeed = mutation({
  args: {
    feedId: v.id('rssFeeds'),
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal('news'),
      v.literal('sports'),
      v.literal('local'),
      v.literal('politics'),
      v.literal('emergency')
    ),
    region: v.string(),
    isActive: v.boolean(),
    fetchInterval: v.number(),
    logoUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.feedId, {
      name: args.name,
      url: args.url,
      description: args.description,
      category: args.category,
      region: args.region,
      isActive: args.isActive,
      fetchInterval: args.fetchInterval,
      logoUrl: args.logoUrl,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Delete RSS feed
export const deleteRssFeed = mutation({
  args: {
    feedId: v.id('rssFeeds'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // First delete all related articles
    const articles = await ctx.db
      .query('rssArticles')
      .filter(q => q.eq(q.field('feedId'), args.feedId))
      .collect();

    for (const article of articles) {
      await ctx.db.delete(article._id);
    }

    // Then delete the feed
    await ctx.db.delete(args.feedId);

    return null;
  },
});

// Basic RSS parser (simplified - in production use a proper RSS library)
function parseRSSBasic(rssText: string): Array<{
  title: string;
  description?: string;
  content?: string;
  url: string;
  author?: string;
  publishedAt: number;
  imageUrl?: string;
  tags: string[];
}> {
  const articles: Array<{
    title: string;
    description?: string;
    content?: string;
    url: string;
    author?: string;
    publishedAt: number;
    imageUrl?: string;
    tags: string[];
  }> = [];

  try {
    // Very basic XML parsing - extract items
    const itemMatches = rssText.match(/<item>[\s\S]*?<\/item>/g) || [];

    for (const item of itemMatches.slice(0, 10)) {
      // Limit to 10 articles per fetch
      const title = extractXmlValue(item, 'title') || 'Sin título';
      const description = extractXmlValue(item, 'description');
      const link =
        extractXmlValue(item, 'link') || extractXmlValue(item, 'guid');
      const author =
        extractXmlValue(item, 'author') || extractXmlValue(item, 'creator');
      const pubDate =
        extractXmlValue(item, 'pubDate') || extractXmlValue(item, 'published');

      if (title && link) {
        articles.push({
          title: cleanHtml(title),
          description: description ? cleanHtml(description) : undefined,
          content: description || undefined,
          url: link,
          author: author || undefined,
          publishedAt: pubDate ? new Date(pubDate).getTime() : Date.now(),
          imageUrl: extractImageUrl(description || ''),
          tags: [],
        });
      }
    }
  } catch (error) {
    console.error('RSS parsing error:', error);
  }

  return articles;
}

// Helper functions for RSS parsing
function extractXmlValue(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[a-zA-Z0-9#]+;/g, ' ') // Replace HTML entities with space
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function extractImageUrl(text: string): string | undefined {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = text.match(imgRegex);
  return match ? match[1] : undefined;
}
