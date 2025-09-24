// COMPREHENSIVE SETTINGS SYSTEM - EXTRACTED BEST PRACTICES
export type SettingsState = {
  // System Configuration
  systemName: string;
  systemTimezone: string;
  maintenanceMode: boolean;
  systemTheme: 'light' | 'dark' | 'system';

  // Security Settings
  sessionTimeout: number;
  passwordMinLength: number;
  twoFactorRequired: boolean;
  twoFactorAuth: boolean;
  rateLimitingEnabled: boolean;
  securityAlerts: boolean;
  securityLogs: boolean;

  // Database Settings
  dbConnectionPool: number;
  dbQueryTimeout: number;
  dbBackupFrequency: string;
  dbOptimizationEnabled: boolean;

  // Email & Notifications
  smtpHost: string;
  emailNotifications: boolean;
  adminAlerts: boolean;
  notificationFrequency: string;

  // Performance Settings
  cacheEnabled: boolean;
  cacheTTL: number;
  maxWorkers: number;
  memoryLimit: number;
  compressionEnabled: boolean;
  imageCompression: boolean;
  lazyLoading: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';

  // UI/UX Settings
  animationsEnabled: boolean;
  highContrast: boolean;
  keyboardShortcuts: boolean;
  autoSave: boolean;
  layout: 'default' | 'compact' | 'spacious';

  // Feature Flags
  clientPortalEnabled: boolean;
  advancedAnalytics: boolean;
  mobileAppEnabled: boolean;
  apiAccessEnabled: boolean;

  // Advanced Settings
  debugMode: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  experimentalFeatures: boolean;
  telemetryEnabled: boolean;
  developerMode: boolean;
  apiRateLimit: number;
};

// COMPREHENSIVE DEFAULTS
export const DEFAULT_SETTINGS: SettingsState = {
  systemName: 'JuntaDeVecinos',
  systemTimezone: 'America/Santiago',
  maintenanceMode: false,
  systemTheme: 'system',

  sessionTimeout: 30,
  passwordMinLength: 8,
  twoFactorRequired: true,
  twoFactorAuth: true,
  rateLimitingEnabled: true,
  securityAlerts: true,
  securityLogs: true,

  dbConnectionPool: 20,
  dbQueryTimeout: 30,
  dbBackupFrequency: 'daily',
  dbOptimizationEnabled: true,

  smtpHost: '', // Configure via environment variables
  emailNotifications: true,
  adminAlerts: true,
  notificationFrequency: 'immediate',

  cacheEnabled: true,
  cacheTTL: 300,
  maxWorkers: 4,
  memoryLimit: 512,
  compressionEnabled: true,
  imageCompression: true,
  lazyLoading: true,
  quality: 'high',

  animationsEnabled: true,
  highContrast: false,
  keyboardShortcuts: true,
  autoSave: true,
  layout: 'default',

  clientPortalEnabled: false,
  advancedAnalytics: false,
  mobileAppEnabled: true,
  apiAccessEnabled: false,

  debugMode: false,
  logLevel: 'info',
  experimentalFeatures: false,
  telemetryEnabled: false,
  developerMode: false,
  apiRateLimit: 100,
};

// SETTINGS ACTIONS
export type SettingsAction =
  | { type: 'UPDATE_SETTING'; key: keyof SettingsState; value: any }
  | { type: 'RESET_SECTION'; section: string }
  | { type: 'RESET_ALL' }
  | { type: 'LOAD_PRESET'; preset: Partial<SettingsState> }
  | { type: 'EXPORT_SETTINGS' }
  | { type: 'IMPORT_SETTINGS'; settings: SettingsState };

// SETTINGS SECTIONS
export interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category:
    | 'system'
    | 'security'
    | 'database'
    | 'notifications'
    | 'performance'
    | 'ui'
    | 'features'
    | 'advanced';
}

export const settingSections: SettingSection[] = [
  {
    id: 'system',
    title: 'Sistema',
    description: 'Configuración general del sistema',
    icon: '⚙️',
    color: 'blue',
    category: 'system',
  },
  {
    id: 'security',
    title: 'Seguridad',
    description: 'Configuraciones de seguridad y autenticación',
    icon: '🔒',
    color: 'red',
    category: 'security',
  },
  {
    id: 'database',
    title: 'Base de Datos',
    description: 'Configuración de conexiones y rendimiento',
    icon: '💾',
    color: 'green',
    category: 'database',
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    description: 'Configuración de emails y alertas',
    icon: '📧',
    color: 'purple',
    category: 'notifications',
  },
  {
    id: 'performance',
    title: 'Rendimiento',
    description: 'Optimización y configuración de rendimiento',
    icon: '🚀',
    color: 'orange',
    category: 'performance',
  },
  {
    id: 'ui',
    title: 'Interfaz',
    description: 'Configuración de apariencia y experiencia',
    icon: '🎨',
    color: 'pink',
    category: 'ui',
  },
  {
    id: 'features',
    title: 'Características',
    description: 'Habilitar/deshabilitar funcionalidades',
    icon: '✨',
    color: 'indigo',
    category: 'features',
  },
  {
    id: 'advanced',
    title: 'Avanzado',
    description: 'Configuraciones avanzadas para desarrolladores',
    icon: '🔧',
    color: 'gray',
    category: 'advanced',
  },
];

// PRESETS
export interface SettingsPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<SettingsState>;
}

export const settingsPresets: SettingsPreset[] = [
  {
    id: 'default',
    name: 'Configuración Estándar',
    description: 'Configuración balanceada para uso general',
    settings: DEFAULT_SETTINGS,
  },
  {
    id: 'performance',
    name: 'Modo Rendimiento',
    description: 'Optimizado para máxima velocidad',
    settings: {
      cacheEnabled: true,
      maxWorkers: 8,
      memoryLimit: 1024,
      compressionEnabled: true,
      quality: 'high',
      animationsEnabled: false,
    },
  },
  {
    id: 'secure',
    name: 'Modo Seguro',
    description: 'Máxima seguridad con configuraciones restrictivas',
    settings: {
      sessionTimeout: 15,
      passwordMinLength: 12,
      twoFactorRequired: true,
      rateLimitingEnabled: true,
      securityAlerts: true,
    },
  },
  {
    id: 'minimal',
    name: 'Modo Mínimo',
    description: 'Configuración básica para recursos limitados',
    settings: {
      cacheEnabled: false,
      maxWorkers: 2,
      memoryLimit: 256,
      compressionEnabled: false,
      quality: 'low',
      animationsEnabled: false,
      highContrast: true,
    },
  },
];

// SYSTEM HEALTH STATUS
export interface SystemHealth {
  configValid: boolean;
  lastBackup: string;
  pendingUpdates: number;
  securityScore: number;
  databaseStatus: 'healthy' | 'warning' | 'critical';
  emailStatus: 'connected' | 'disconnected';
  cacheStatus: 'active' | 'inactive';
}

// SETTINGS VALIDATION
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateSettings = (
  settings: Partial<SettingsState>
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (
    settings.sessionTimeout &&
    (settings.sessionTimeout < 5 || settings.sessionTimeout > 480)
  ) {
    errors.push('El timeout de sesión debe estar entre 5 y 480 minutos');
  }

  if (settings.passwordMinLength && settings.passwordMinLength < 6) {
    errors.push(
      'La longitud mínima de contraseña debe ser al menos 6 caracteres'
    );
  }

  if (settings.dbConnectionPool && settings.dbConnectionPool > 100) {
    warnings.push(
      'Un pool de conexiones muy grande puede afectar el rendimiento'
    );
  }

  if (settings.memoryLimit && settings.memoryLimit > 2048) {
    warnings.push(
      'Límite de memoria muy alto puede causar problemas de estabilidad'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
