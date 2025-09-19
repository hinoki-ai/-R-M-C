import { DEFAULT_SETTINGS, SettingsAction, SettingsState } from '@/types/settings';

// SETTINGS REDUCER - COMPREHENSIVE STATE MANAGEMENT
export function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'UPDATE_SETTING':
      return {
        ...state,
        [action.key]: action.value,
      };

    case 'RESET_SECTION':
      // Reset specific section to defaults
      const sectionDefaults: Partial<SettingsState> = {};

      switch (action.section) {
        case 'system':
          sectionDefaults.systemName = DEFAULT_SETTINGS.systemName;
          sectionDefaults.systemTimezone = DEFAULT_SETTINGS.systemTimezone;
          sectionDefaults.maintenanceMode = DEFAULT_SETTINGS.maintenanceMode;
          sectionDefaults.systemTheme = DEFAULT_SETTINGS.systemTheme;
          break;

        case 'security':
          sectionDefaults.sessionTimeout = DEFAULT_SETTINGS.sessionTimeout;
          sectionDefaults.passwordMinLength = DEFAULT_SETTINGS.passwordMinLength;
          sectionDefaults.twoFactorRequired = DEFAULT_SETTINGS.twoFactorRequired;
          sectionDefaults.rateLimitingEnabled = DEFAULT_SETTINGS.rateLimitingEnabled;
          sectionDefaults.securityAlerts = DEFAULT_SETTINGS.securityAlerts;
          break;

        case 'database':
          sectionDefaults.dbConnectionPool = DEFAULT_SETTINGS.dbConnectionPool;
          sectionDefaults.dbQueryTimeout = DEFAULT_SETTINGS.dbQueryTimeout;
          sectionDefaults.dbBackupFrequency = DEFAULT_SETTINGS.dbBackupFrequency;
          sectionDefaults.dbOptimizationEnabled = DEFAULT_SETTINGS.dbOptimizationEnabled;
          break;

        case 'notifications':
          sectionDefaults.smtpHost = DEFAULT_SETTINGS.smtpHost;
          sectionDefaults.emailNotifications = DEFAULT_SETTINGS.emailNotifications;
          sectionDefaults.adminAlerts = DEFAULT_SETTINGS.adminAlerts;
          sectionDefaults.notificationFrequency = DEFAULT_SETTINGS.notificationFrequency;
          break;

        case 'performance':
          sectionDefaults.cacheEnabled = DEFAULT_SETTINGS.cacheEnabled;
          sectionDefaults.maxWorkers = DEFAULT_SETTINGS.maxWorkers;
          sectionDefaults.memoryLimit = DEFAULT_SETTINGS.memoryLimit;
          sectionDefaults.compressionEnabled = DEFAULT_SETTINGS.compressionEnabled;
          sectionDefaults.quality = DEFAULT_SETTINGS.quality;
          break;

        case 'ui':
          sectionDefaults.animationsEnabled = DEFAULT_SETTINGS.animationsEnabled;
          sectionDefaults.highContrast = DEFAULT_SETTINGS.highContrast;
          sectionDefaults.keyboardShortcuts = DEFAULT_SETTINGS.keyboardShortcuts;
          sectionDefaults.autoSave = DEFAULT_SETTINGS.autoSave;
          sectionDefaults.layout = DEFAULT_SETTINGS.layout;
          break;

        case 'features':
          sectionDefaults.clientPortalEnabled = DEFAULT_SETTINGS.clientPortalEnabled;
          sectionDefaults.advancedAnalytics = DEFAULT_SETTINGS.advancedAnalytics;
          sectionDefaults.mobileAppEnabled = DEFAULT_SETTINGS.mobileAppEnabled;
          sectionDefaults.apiAccessEnabled = DEFAULT_SETTINGS.apiAccessEnabled;
          break;

        case 'advanced':
          sectionDefaults.debugMode = DEFAULT_SETTINGS.debugMode;
          sectionDefaults.logLevel = DEFAULT_SETTINGS.logLevel;
          sectionDefaults.experimentalFeatures = DEFAULT_SETTINGS.experimentalFeatures;
          sectionDefaults.telemetryEnabled = DEFAULT_SETTINGS.telemetryEnabled;
          sectionDefaults.developerMode = DEFAULT_SETTINGS.developerMode;
          break;

        default:
          return state;
      }

      return { ...state, ...sectionDefaults };

    case 'RESET_ALL':
      return { ...DEFAULT_SETTINGS };

    case 'LOAD_PRESET':
      return { ...state, ...action.preset };

    case 'EXPORT_SETTINGS':
      // In a real app, this would trigger a download
      console.log('Exporting settings:', state);
      return state;

    case 'IMPORT_SETTINGS':
      return { ...action.settings };
    case 'EXPORT_SETTINGS':
      // Export to localStorage and clipboard
      const exportData = JSON.stringify(state, null, 2);
      localStorage.setItem('junta-settings', exportData);
      navigator.clipboard?.writeText(exportData);
      console.log('Settings exported successfully');
      return state;

    default:
      return state;
  }
}

// UTILITY FUNCTIONS
export const getSettingsByCategory = (settings: SettingsState, category: string) => {
  const entries = Object.entries(settings) as [keyof SettingsState, any][];

  switch (category) {
    case 'system':
      return Object.fromEntries(
        entries.filter(([key]) =>
          ['systemName', 'systemTimezone', 'maintenanceMode', 'systemTheme'].includes(key)
        )
      );

    case 'security':
      return Object.fromEntries(
        entries.filter(([key]) =>
          ['sessionTimeout', 'passwordMinLength', 'twoFactorRequired', 'rateLimitingEnabled', 'securityAlerts'].includes(key)
        )
      );

    case 'database':
      return Object.fromEntries(
        entries.filter(([key]) =>
          ['dbConnectionPool', 'dbQueryTimeout', 'dbBackupFrequency', 'dbOptimizationEnabled'].includes(key)
        )
      );

    case 'notifications':
      return Object.fromEntries(
        entries.filter(([key]) =>
          ['smtpHost', 'emailNotifications', 'adminAlerts', 'notificationFrequency'].includes(key)
        )
      );

    case 'performance':
      return Object.fromEntries(
        entries.filter(([key]) =>
          ['cacheEnabled', 'maxWorkers', 'memoryLimit', 'compressionEnabled', 'quality'].includes(key)
        )
      );

    case 'ui':
      return Object.fromEntries(
        entries.filter(([key]) =>
          ['animationsEnabled', 'highContrast', 'keyboardShortcuts', 'autoSave', 'layout'].includes(key)
        )
      );

    case 'features':
      return Object.fromEntries(
        entries.filter(([key]) =>
          ['clientPortalEnabled', 'advancedAnalytics', 'mobileAppEnabled', 'apiAccessEnabled'].includes(key)
        )
      );

    case 'advanced':
      return Object.fromEntries(
        entries.filter(([key]) =>
          ['debugMode', 'logLevel', 'experimentalFeatures', 'telemetryEnabled', 'developerMode'].includes(key)
        )
      );

    default:
      return {};
  }
};

export const getModifiedSettings = (current: SettingsState, original: SettingsState): string[] => {
  const modified: string[] = [];

  (Object.keys(current) as (keyof SettingsState)[]).forEach(key => {
    if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
      modified.push(key);
    }
  });

  return modified;
};

export const hasUnsavedChanges = (current: SettingsState, original: SettingsState): boolean => {
  return getModifiedSettings(current, original).length > 0;
};