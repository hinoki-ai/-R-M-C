import { v } from 'convex/values'

import { Doc, Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

// Weather Data Management
export const getWeatherData = query({
  args: {
    location: v.optional(v.string()),
    limit: v.optional(v.number()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { location, limit = 100, startDate, endDate } = args

    let query = ctx.db.query('weatherData')

    if (location) {
      query = query.filter((q) => q.eq(q.field('location'), location))
    }

    if (startDate || endDate) {
      query = query.filter((q) => {
        if (startDate && q.lt(q.field('timestamp'), startDate)) return false
        if (endDate && q.gt(q.field('timestamp'), endDate)) return false
        return true
      })
    }

    return await query
      .order('desc')
      .take(limit)
  },
})

export const addWeatherData = mutation({
  args: {
    timestamp: v.number(),
    temperature: v.number(),
    humidity: v.number(),
    pressure: v.number(),
    windSpeed: v.number(),
    windDirection: v.number(),
    precipitation: v.number(),
    uvIndex: v.number(),
    visibility: v.number(),
    description: v.string(),
    icon: v.string(),
    feelsLike: v.number(),
    dewPoint: v.number(),
    cloudCover: v.number(),
    location: v.string(),
    source: v.union(v.literal('api'), v.literal('manual'), v.literal('sensor')),
    isHistorical: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) throw new Error('Unauthorized')

    const userDoc = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', user.subject))
      .first()

    if (!userDoc) throw new Error('User not found')

    const now = Date.now()

    return await ctx.db.insert('weatherData', {
      ...args,
      createdBy: userDoc._id,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateWeatherData = mutation({
  args: {
    id: v.id('weatherData'),
    updates: v.object({
      temperature: v.optional(v.number()),
      humidity: v.optional(v.number()),
      pressure: v.optional(v.number()),
      windSpeed: v.optional(v.number()),
      windDirection: v.optional(v.number()),
      precipitation: v.optional(v.number()),
      uvIndex: v.optional(v.number()),
      visibility: v.optional(v.number()),
      description: v.optional(v.string()),
      icon: v.optional(v.string()),
      feelsLike: v.optional(v.number()),
      dewPoint: v.optional(v.number()),
      cloudCover: v.optional(v.number()),
      location: v.optional(v.string()),
      source: v.optional(v.union(v.literal('api'), v.literal('manual'), v.literal('sensor'))),
      isHistorical: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) throw new Error('Unauthorized')

    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Weather data not found')

    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: Date.now(),
    })

    return args.id
  },
})

export const deleteWeatherData = mutation({
  args: { id: v.id('weatherData') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) throw new Error('Unauthorized')

    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Weather data not found')

    await ctx.db.delete(args.id)
    return args.id
  },
})

// Weather Alerts Management
export const getWeatherAlerts = query({
  args: {
    activeOnly: v.optional(v.boolean()),
    severity: v.optional(v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('extreme'))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { activeOnly = false, severity, limit = 50 } = args

    let query = ctx.db.query('weatherAlerts')

    if (activeOnly) {
      query = query.filter((q) => q.eq(q.field('isActive'), true))
    }

    if (severity) {
      query = query.filter((q) => q.eq(q.field('severity'), severity))
    }

    return await query
      .order('desc')
      .take(limit)
  },
})

export const createWeatherAlert = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    severity: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('extreme')),
    type: v.union(v.literal('storm'), v.literal('heat'), v.literal('cold'), v.literal('flood'), v.literal('wind'), v.literal('other')),
    startTime: v.number(),
    endTime: v.number(),
    areas: v.array(v.string()),
    instructions: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) throw new Error('Unauthorized')

    const userDoc = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', user.subject))
      .first()

    if (!userDoc) throw new Error('User not found')

    const now = Date.now()

    return await ctx.db.insert('weatherAlerts', {
      ...args,
      isActive: true,
      createdBy: userDoc._id,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateWeatherAlert = mutation({
  args: {
    id: v.id('weatherAlerts'),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      severity: v.optional(v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('extreme'))),
      type: v.optional(v.union(v.literal('storm'), v.literal('heat'), v.literal('cold'), v.literal('flood'), v.literal('wind'), v.literal('other'))),
      startTime: v.optional(v.number()),
      endTime: v.optional(v.number()),
      areas: v.optional(v.array(v.string())),
      instructions: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) throw new Error('Unauthorized')

    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Weather alert not found')

    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: Date.now(),
    })

    return args.id
  },
})

export const deleteWeatherAlert = mutation({
  args: { id: v.id('weatherAlerts') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) throw new Error('Unauthorized')

    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Weather alert not found')

    await ctx.db.delete(args.id)
    return args.id
  },
})

// Weather Forecasts Management
export const getWeatherForecasts = query({
  args: {
    location: v.optional(v.string()),
    days: v.optional(v.number()),
    startDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { location, days = 7, startDate } = args

    let query = ctx.db.query('weatherForecasts')

    if (location) {
      query = query.filter((q) => q.eq(q.field('location'), location))
    }

    if (startDate) {
      query = query.filter((q) => q.gte(q.field('date'), startDate))
    }

    const forecasts = await query
      .order('asc')
      .take(days)

    return forecasts
  },
})

export const addWeatherForecast = mutation({
  args: {
    date: v.string(),
    tempMin: v.number(),
    tempMax: v.number(),
    humidity: v.number(),
    precipitation: v.number(),
    precipitationProbability: v.number(),
    windSpeed: v.number(),
    windDirection: v.number(),
    description: v.string(),
    icon: v.string(),
    uvIndex: v.number(),
    sunrise: v.string(),
    sunset: v.string(),
    location: v.string(),
    source: v.union(v.literal('api'), v.literal('manual')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) throw new Error('Unauthorized')

    const userDoc = await ctx.db
      .query('users')
      .withIndex('byExternalId', (q) => q.eq('externalId', user.subject))
      .first()

    if (!userDoc) throw new Error('User not found')

    const now = Date.now()

    // Check if forecast for this date and location already exists
    const existing = await ctx.db
      .query('weatherForecasts')
      .filter((q) => q.eq(q.field('date'), args.date))
      .filter((q) => q.eq(q.field('location'), args.location))
      .first()

    if (existing) {
      // Update existing forecast
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
        createdBy: userDoc._id,
      })
      return existing._id
    } else {
      // Create new forecast
      return await ctx.db.insert('weatherForecasts', {
        ...args,
        updatedAt: now,
        createdBy: userDoc._id,
        createdAt: now,
      })
    }
  },
})

export const updateWeatherForecast = mutation({
  args: {
    id: v.id('weatherForecasts'),
    updates: v.object({
      tempMin: v.optional(v.number()),
      tempMax: v.optional(v.number()),
      humidity: v.optional(v.number()),
      precipitation: v.optional(v.number()),
      precipitationProbability: v.optional(v.number()),
      windSpeed: v.optional(v.number()),
      windDirection: v.optional(v.number()),
      description: v.optional(v.string()),
      icon: v.optional(v.string()),
      uvIndex: v.optional(v.number()),
      sunrise: v.optional(v.string()),
      sunset: v.optional(v.string()),
      location: v.optional(v.string()),
      source: v.optional(v.union(v.literal('api'), v.literal('manual'))),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) throw new Error('Unauthorized')

    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Weather forecast not found')

    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: Date.now(),
    })

    return args.id
  },
})

export const deleteWeatherForecast = mutation({
  args: { id: v.id('weatherForecasts') },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity()
    if (!user) throw new Error('Unauthorized')

    const existing = await ctx.db.get(args.id)
    if (!existing) throw new Error('Weather forecast not found')

    await ctx.db.delete(args.id)
    return args.id
  },
})

// Analytics and Statistics
export const getWeatherStats = query({
  args: {
    location: v.string(),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { location, days = 30 } = args
    const startDate = Date.now() - (days * 24 * 60 * 60 * 1000)

    const weatherData = await ctx.db
      .query('weatherData')
      .filter((q) => q.eq(q.field('location'), location))
      .filter((q) => q.gte(q.field('timestamp'), startDate))
      .collect()

    if (weatherData.length === 0) {
      return {
        averageTemp: 0,
        minTemp: 0,
        maxTemp: 0,
        totalPrecipitation: 0,
        averageHumidity: 0,
        averageWindSpeed: 0,
        dataPoints: 0,
      }
    }

    const temperatures = weatherData.map(d => d.temperature)
    const humidities = weatherData.map(d => d.humidity)
    const windSpeeds = weatherData.map(d => d.windSpeed)
    const precipitations = weatherData.map(d => d.precipitation)

    return {
      averageTemp: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
      minTemp: Math.min(...temperatures),
      maxTemp: Math.max(...temperatures),
      totalPrecipitation: precipitations.reduce((a, b) => a + b, 0),
      averageHumidity: humidities.reduce((a, b) => a + b, 0) / humidities.length,
      averageWindSpeed: windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length,
      dataPoints: weatherData.length,
    }
  },
})

export const getCurrentWeather = query({
  args: { location: v.string() },
  handler: async (ctx, args) => {
    const { location } = args

    // Get the most recent weather data
    const currentData = await ctx.db
      .query('weatherData')
      .withIndex('byLocation', (q) => q.eq('location', location))
      .order('desc')
      .first()

    return currentData
  },
})