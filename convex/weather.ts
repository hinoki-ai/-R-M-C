import { v } from 'convex/values'

import { Doc, Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'
import {
  requireUser,
  validateRequired,
  validateStringLength,
  validateNumberRange,
  validateEnum,
  safeDbInsert,
  safeDbPatch,
  safeDbGet,
  withErrorHandling,
  createValidationError
} from './utils/error_handler'

// Weather Data Management
export const getWeatherData = query({
  args: {
    location: v.optional(v.string()),
    limit: v.optional(v.number()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id('weatherData'),
    _creationTime: v.number(),
    timestamp: v.number(),
    temperature: v.number(),
    humidity: v.number(),
    pressure: v.number(),
    surfacePressure: v.optional(v.number()),
    windSpeed: v.number(),
    windDirection: v.number(),
    windGusts: v.optional(v.number()),
    precipitation: v.number(),
    uvIndex: v.optional(v.number()),
    visibility: v.number(),
    description: v.string(),
    icon: v.string(),
    feelsLike: v.optional(v.number()),
    dewPoint: v.optional(v.number()),
    cloudCover: v.optional(v.number()),
    weatherCode: v.optional(v.number()),
    location: v.string(),
    source: v.union(v.literal('api'), v.literal('manual'), v.literal('sensor')),
    isHistorical: v.optional(v.boolean()),
    createdBy: v.optional(v.id('users')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: withErrorHandling(async (ctx, args: {
    location?: string;
    limit?: number;
    startDate?: number;
    endDate?: number;
  }) => {
    const { location, limit = 100, startDate, endDate } = args

    // Validate inputs
    if (location) {
      validateStringLength(location, 'location', 1, 100)
    }

    if (limit) {
      validateNumberRange(limit, 'limit', 1, 1000)
    }

    if (startDate) {
      validateNumberRange(startDate, 'startDate', 0, Date.now() + 365 * 24 * 60 * 60 * 1000) // Up to 1 year in future
    }

    if (endDate) {
      validateNumberRange(endDate, 'endDate', 0, Date.now() + 365 * 24 * 60 * 60 * 1000)
    }

    if (startDate && endDate && startDate >= endDate) {
      throw createValidationError('startDate must be before endDate')
    }

    let query = ctx.db.query('weatherData')

    if (location) {
      query = query.filter((q: any) => q.eq(q.field('location'), location))
    }

    if (startDate || endDate) {
      query = query.filter((q: any) => {
        if (startDate && q.lt(q.field('timestamp'), startDate)) return false
        if (endDate && q.gt(q.field('timestamp'), endDate)) return false
        return true
      })
    }

    return await query
      .order('desc')
      .take(limit)
  }, 'getWeatherData'),
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
    uvIndex: v.optional(v.number()),
    visibility: v.number(),
    description: v.string(),
    icon: v.string(),
    feelsLike: v.optional(v.number()),
    dewPoint: v.optional(v.number()),
    cloudCover: v.optional(v.number()),
    location: v.string(),
    source: v.union(v.literal('api'), v.literal('manual'), v.literal('sensor')),
    isHistorical: v.optional(v.boolean()),
  },
  returns: v.id('weatherData'),
  handler: withErrorHandling(async (ctx, args: {
    timestamp: number;
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    uvIndex?: number;
    visibility: number;
    description: string;
    icon: string;
    feelsLike?: number;
    dewPoint?: number;
    cloudCover?: number;
    location: string;
    source: 'api' | 'manual' | 'sensor';
    isHistorical?: boolean;
  }) => {
    const userDoc = await requireUser(ctx)

    // Validate required fields
    validateRequired(args.timestamp, 'timestamp')
    validateRequired(args.temperature, 'temperature')
    validateRequired(args.humidity, 'humidity')
    validateRequired(args.pressure, 'pressure')
    validateRequired(args.windSpeed, 'windSpeed')
    validateRequired(args.windDirection, 'windDirection')
    validateRequired(args.precipitation, 'precipitation')
    validateRequired(args.visibility, 'visibility')
    validateRequired(args.description, 'description')
    validateRequired(args.icon, 'icon')
    validateRequired(args.location, 'location')
    validateRequired(args.source, 'source')

    // Validate data ranges
    validateNumberRange(args.timestamp, 'timestamp', 0, Date.now() + 24 * 60 * 60 * 1000) // Up to 24 hours in future
    validateNumberRange(args.temperature, 'temperature', -100, 100)
    validateNumberRange(args.humidity, 'humidity', 0, 100)
    validateNumberRange(args.pressure, 'pressure', 800, 1200)
    validateNumberRange(args.windSpeed, 'windSpeed', 0, 200)
    validateNumberRange(args.windDirection, 'windDirection', 0, 360)
    validateNumberRange(args.precipitation, 'precipitation', 0, 500)
    if (args.uvIndex !== undefined) {
      validateNumberRange(args.uvIndex, 'uvIndex', 0, 20)
    }
    validateNumberRange(args.visibility, 'visibility', 0, 100)
    if (args.feelsLike !== undefined) {
      validateNumberRange(args.feelsLike, 'feelsLike', -100, 100)
    }
    if (args.dewPoint !== undefined) {
      validateNumberRange(args.dewPoint, 'dewPoint', -100, 100)
    }
    if (args.cloudCover !== undefined) {
      validateNumberRange(args.cloudCover, 'cloudCover', 0, 100)
    }

    // Validate string lengths
    validateStringLength(args.description, 'description', 1, 500)
    validateStringLength(args.icon, 'icon', 1, 100)
    validateStringLength(args.location, 'location', 1, 100)

    // Validate enums
    validateEnum(args.source, ['api', 'manual', 'sensor'], 'source')

    const now = Date.now()

    return await safeDbInsert(ctx, 'weatherData', {
      ...args,
      createdBy: userDoc._id,
      createdAt: now,
      updatedAt: now,
    })
  }, 'addWeatherData'),
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
  returns: v.id('weatherData'),
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
  returns: v.id('weatherData'),
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
  returns: v.array(v.object({
    _id: v.id('weatherAlerts'),
    _creationTime: v.number(),
    title: v.string(),
    description: v.string(),
    severity: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('extreme')),
    type: v.union(v.literal('storm'), v.literal('heat'), v.literal('cold'), v.literal('flood'), v.literal('wind'), v.literal('other')),
    startTime: v.number(),
    endTime: v.number(),
    areas: v.array(v.string()),
    instructions: v.string(),
    isActive: v.boolean(),
    createdBy: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
  })),
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
  returns: v.id('weatherAlerts'),
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
  returns: v.id('weatherAlerts'),
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
  returns: v.id('weatherAlerts'),
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
  returns: v.array(v.object({
    _id: v.id('weatherForecasts'),
    _creationTime: v.number(),
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
    updatedAt: v.number(),
    createdBy: v.optional(v.id('users')),
    createdAt: v.number(),
  })),
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
  returns: v.id('weatherForecasts'),
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
  returns: v.id('weatherForecasts'),
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
  returns: v.id('weatherForecasts'),
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
  returns: v.object({
    averageTemp: v.number(),
    minTemp: v.number(),
    maxTemp: v.number(),
    totalPrecipitation: v.number(),
    averageHumidity: v.number(),
    averageWindSpeed: v.number(),
    dataPoints: v.number(),
  }),
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
  returns: v.object({
    _id: v.id('weatherData'),
    _creationTime: v.number(),
    timestamp: v.number(),
    temperature: v.number(),
    humidity: v.number(),
    pressure: v.number(),
    surfacePressure: v.optional(v.number()),
    windSpeed: v.number(),
    windDirection: v.number(),
    windGusts: v.optional(v.number()),
    precipitation: v.number(),
    uvIndex: v.optional(v.number()),
    visibility: v.number(),
    description: v.string(),
    icon: v.string(),
    feelsLike: v.optional(v.number()),
    dewPoint: v.optional(v.number()),
    cloudCover: v.optional(v.number()),
    weatherCode: v.optional(v.number()),
    location: v.string(),
    source: v.union(v.literal('api'), v.literal('manual'), v.literal('sensor')),
    isHistorical: v.optional(v.boolean()),
    createdBy: v.optional(v.id('users')),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  handler: async (ctx, args) => {
    const { location } = args

    // Get the most recent weather data
    const currentData = await ctx.db
      .query('weatherData')
      .withIndex('byLocation', (q) => q.eq('location', location))
      .order('desc')
      .first()

    if (!currentData) {
      throw new Error('No weather data found for this location')
    }

    return currentData
  },
})