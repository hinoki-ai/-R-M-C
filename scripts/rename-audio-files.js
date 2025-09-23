#!/usr/bin/env node

/**
 * Audio Files Renaming Script
 * Standardizes audio file names according to the new naming convention
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio');

// Rename mapping for community voice files
const voiceRenameMap = {
  // Welcome messages
  'welcome-short-01.mp3': 'voice-welcome-short-1.mp3',
  'welcome-short-02.mp3': 'voice-welcome-short-2.mp3',
  'welcome-medium-01.mp3': 'voice-welcome-medium-1.mp3',
  'welcome-medium-02.mp3': 'voice-welcome-medium-2.mp3',
  'welcome-long-01.mp3': 'voice-welcome-long-1.mp3',

  // Community introductions
  'intro-community-01.mp3': 'voice-intro-community-1.mp3',
  'intro-community-02.mp3': 'voice-intro-community-2.mp3',
  'intro-community-03.mp3': 'voice-intro-community-3.mp3',
  'intro-features-01.mp3': 'voice-intro-features-1.mp3',
  'intro-features-02.mp3': 'voice-intro-features-2.mp3',

  // Emergency alerts (moved to alert category)
  'announce-emergency-01.mp3': 'alert-emergency-1.mp3',
  'announce-emergency-02.mp3': 'alert-emergency-2.mp3',

  // Meeting announcements
  'announce-meeting-01.mp3': 'voice-meeting-1.mp3',
  'announce-meeting-02.mp3': 'voice-meeting-2.mp3',

  // Event announcements
  'announce-event-01.mp3': 'voice-event-1.mp3',

  // Maintenance announcements
  'announce-maintenance-01.mp3': 'voice-maintenance-1.mp3',
  'announce-maintenance-02.mp3': 'voice-maintenance-2.mp3',

  // General announcements
  'announce-general-01.mp3': 'voice-announce-general-1.mp3',
  'announce-general-02.mp3': 'voice-announce-general-2.mp3',
  'announce-general-03.mp3': 'voice-announce-general-3.mp3',

  // Weather updates
  'update-weather-01.mp3': 'voice-weather-1.mp3',
  'update-weather-02.mp3': 'voice-weather-2.mp3',

  // Status updates
  'update-status-01.mp3': 'voice-status-1.mp3',

  // Calendar updates
  'update-calendar-01.mp3': 'voice-calendar-1.mp3',
  'update-calendar-02.mp3': 'voice-calendar-2.mp3',
  'update-calendar-03.mp3': 'voice-calendar-3.mp3',

  // Service updates
  'update-service-01.mp3': 'voice-service-1.mp3',
  'update-service-02.mp3': 'voice-service-2.mp3',
  'update-service-03.mp3': 'voice-service-3.mp3',

  // System feedback (moved to ui category)
  'system-success-01.mp3': 'ui-success-1.mp3',
  'system-success-02.mp3': 'ui-success-2.mp3',
  'system-error-01.mp3': 'ui-error-1.mp3',
  'system-error-02.mp3': 'ui-error-2.mp3',
  'system-notification-01.mp3': 'ui-notification-1.mp3',
  'system-notification-02.mp3': 'ui-notification-2.mp3',
  'system-notification-03.mp3': 'ui-notification-3.mp3',
  'system-notification-04.mp3': 'ui-notification-4.mp3',
  'system-notification-05.mp3': 'ui-notification-5.mp3',
};

// UI files renaming (add ui- prefix)
const uiFilesToRename = [
  'click-primary.mp3',
  'click-secondary.mp3',
  'click-accent.mp3',
  'click-action.mp3',
  'click-confirm.mp3',
  'click-cancel.mp3',
  'click-submit.mp3',
  'click-delete.mp3',
  'click-success.mp3',
  'click-warning.mp3',
  'click-error.mp3',
  'click-navigation.mp3',
  'hover-primary.mp3',
  'hover-secondary.mp3',
  'hover-accent.mp3',
  'hover-interactive.mp3',
  'transition-page.mp3',
  'transition-modal.mp3',
  'transition-panel.mp3',
  'transition-loading.mp3',
  'feedback-success.mp3',
  'feedback-warning.mp3',
  'feedback-error.mp3',
  'feedback-info.mp3',
  'feedback-info-alt.mp3',
  'feedback-info-extra.mp3',
];

function renameFile(oldPath, newPath) {
  try {
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Renamed: ${path.basename(oldPath)} → ${path.basename(newPath)}`);
    } else {
      console.log(`⚠️  File not found: ${oldPath}`);
    }
  } catch (error) {
    console.error(`❌ Error renaming ${oldPath}:`, error.message);
  }
}

function main() {
  console.log('🚀 Starting audio files renaming process...\n');

  // Rename community voice files
  console.log('📝 Renaming community voice files...');
  const voiceDir = path.join(AUDIO_DIR, 'community', 'voice');

  Object.entries(voiceRenameMap).forEach(([oldName, newName]) => {
    const oldPath = path.join(voiceDir, oldName);
    const newPath = path.join(voiceDir, newName);
    renameFile(oldPath, newPath);
  });

  // Rename UI click files (add ui- prefix)
  console.log('\n🎵 Renaming UI sound files...');
  const uiDir = path.join(AUDIO_DIR, 'ui', 'clicks');

  uiFilesToRename.forEach(fileName => {
    const oldPath = path.join(uiDir, fileName);
    const newPath = path.join(uiDir, `ui-${fileName}`);
    renameFile(oldPath, newPath);
  });

  console.log('\n✨ Audio files renaming completed!');
  console.log('📋 Summary:');
  console.log(`   - Community voice files: ${Object.keys(voiceRenameMap).length} renamed`);
  console.log(`   - UI sound files: ${uiFilesToRename.length} renamed`);
  console.log(`   - Total files renamed: ${Object.keys(voiceRenameMap).length + uiFilesToRename.length}`);

  console.log('\n🔄 Next steps:');
  console.log('   1. Update audio hooks to use new file names');
  console.log('   2. Test audio playback with new file names');
  console.log('   3. Update any hardcoded audio file references');
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, voiceRenameMap, uiFilesToRename };