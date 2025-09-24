# Selective Audio Looping System

This document explains the selective looping approach for Pellines audio system, where only ~12-15 sounds are truly loopable for ambient background use.

## Philosophy: Not All Sounds Should Loop

While many audio files share similar patterns, not all should be looped. The system distinguishes between:

**Single-Play Events (47+ sounds - NOT LOOPABLE):**

- Emergency alerts (urgent, time-sensitive)
- UI interactions (clicks, hovers, transitions)
- Specific announcements (calendar, meetings, maintenance)
- Error notifications (immediate feedback needed)

**Truly Loopable Ambient Sounds (12-15 sounds):**

- Background notifications (periodic status updates)
- Welcome atmosphere (subtle community presence)
- Weather updates (ongoing environmental info)
- Status indicators (continuous system health)
- Success feedback (positive ambient reinforcement)

## Loopable Sound Categories

### 1. Background Notifications (5 variations)

- **Purpose**: Periodic status updates without being intrusive
- **Loop Interval**: 30-60 seconds
- **Use Case**: Let users know system is active without constant interruption
- **Files**: `ui-notification-1.mp3` through `ui-notification-5.mp3`

### 2. Ambient Welcome Atmosphere (4 variations)

- **Purpose**: Create welcoming community presence
- **Loop Interval**: 5-10 minutes
- **Use Case**: Subtle reminder of community space
- **Files**: `welcome-short-1/2.mp3`, `welcome-medium-1/2.mp3`

### 3. Background Weather Updates (2 variations)

- **Purpose**: Ongoing environmental awareness
- **Loop Interval**: 15-30 minutes
- **Use Case**: Keep users informed of weather conditions
- **Files**: `weather-1.mp3`, `weather-2.mp3`

### 4. Ambient Status Updates (1 variation)

- **Purpose**: Continuous system health indication
- **Loop Interval**: 10-20 minutes
- **Use Case**: Reassure users system is functioning
- **Files**: `status-1.mp3`

### 5. Subtle Success Feedback (2 variations)

- **Purpose**: Positive reinforcement atmosphere
- **Loop Interval**: 10 minutes
- **Use Case**: Create encouraging environment
- **Files**: `ui-success-1.mp3`, `ui-success-2.mp3`

### 6. Critical Loading Loops (17+ variations)

- **Purpose**: Audio feedback for critical loading operations
- **Loop Type**: Continuous hammering sound until loading completes
- **Use Case**: Provide building/construction sound feedback for important operations
- **Files**:
  - **Blacksmith Hammering** (16 files): `blacksmith_metalic_s-*.mp3` - Primary hammering sounds
  - **Rolling Rock Loading** (12 files): `rolling_rock_of_a_hi-*.mp3` - Smoother loading feedback
  - **Original**: `transition-loading.mp3` - Fallback
- **Trigger**: Automatic after 2-3 second delay for critical operations
- **Behavior**: Context-aware - only activates for truly critical loading states
- **Categories**: `critical` (hammering) and `smooth` (rolling) loading types

### 7. UI Wood Breaking Feedback (4+ variations)

- **Purpose**: Breaking through barriers success feedback
- **Loop Type**: Single-play success enhancement
- **Use Case**: Enhanced success feedback with "breaking through" sensation
- **Files**: `wood_branches_tree_b-*.mp3` (4 variations)
- **Integration**: Available as `ui.feedback.woodbreak` for success states

### 8. Nature Ambient Rocks (12 variations)

- **Purpose**: Gentle nature atmosphere with rolling stone sounds
- **Loop Interval**: 25 minutes (very infrequent for subtle presence)
- **Use Case**: Forest/stream ambient background
- **Files**: `rolling_rock_of_a_hi-*.mp3` (12 variations)
- **Category**: Nature ambient (separate opt-in category)

### 9. Nature Ambient Wood (8 variations)

- **Purpose**: Sparse forest sounds for natural atmosphere
- **Loop Interval**: 30 minutes (minimal frequency)
- **Use Case**: Distant forest/woodland ambient effects
- **Files**: `wood_branches_tree_b-*.mp3` (8 variations)
- **Category**: Nature ambient (separate opt-in category)

## Implementation Details

### User Control & Opt-in

- Ambient looping is **disabled by default** (user opt-in only)
- Very low volume (0.1x master volume) for subtle presence
- Configurable intervals per category
- Easy enable/disable toggle

### Smart Intervals

- **Notifications**: 45 seconds (frequent but not annoying)
- **Welcome**: 7 minutes (occasional community reminder)
- **Weather**: 20 minutes (regular environmental updates)
- **Status**: 15 minutes (system health check-ins)
- **Success**: 10 minutes (positive reinforcement)
- **Nature Rocks**: 25 minutes (gentle nature presence)
- **Nature Wood**: 30 minutes (sparse forest sounds)
- **Loading (Critical)**: Continuous loop after 2-3s delay (17+ hammering variations)
- **Loading (Smooth)**: Continuous loop after 2-3s delay (12+ rolling variations)

### Technical Safeguards

- Automatic cleanup on component unmount
- No overlapping ambient sounds
- Respects master audio preferences
- Graceful degradation if audio fails

## Why Selective Looping Matters

### User Experience

- **Avoids Audio Fatigue**: Constant looping would annoy users
- **Maintains Context**: Emergency alerts remain urgent and non-looped
- **Respects Attention**: Important notifications aren't diluted by background noise

### Performance

- **Resource Efficient**: Only 12-15 sounds vs 50+ potential loopers
- **Battery Friendly**: Minimal background processing
- **Storage Optimized**: No duplicate ambient files needed

### Accessibility

- **Screen Reader Friendly**: Ambient sounds don't interfere with assistive tech
- **User Control**: Full opt-in/opt-out capability
- **Volume Independence**: Ambient volume scales with user preferences

## Usage Examples

```typescript
const { startAllAmbientLoops, stopAllAmbientLoops, startAmbientLoop } =
  useAudioSystem();

// Start all ambient loops (user opt-in required)
startAllAmbientLoops();

// Start only weather updates
startAmbientLoop('weather');

// Stop all ambient audio
stopAllAmbientLoops();
```

### Loading Loops Usage

```typescript
import { useLoadingAudio } from '@/hooks/use-loading-audio';
import { useAudioSystem } from '@/hooks/use-audio-system';

// Loading Audio - Context-Aware Hammering
const { startCriticalLoading, startLongLoading, stopLoading } = useLoadingAudio();

// Start blacksmith hammering for critical operations
startCriticalLoading(2000); // Hammering after 2 seconds
// or start rolling rocks for smoother operations
startLongLoading(3000); // Rolling after 3 seconds
stopLoading();

// Automatic integration with hooks
const { useAutoLoading } = useLoadingAudio();

// In your data hook - automatic blacksmith sounds for critical loading
export function useDashboardData() {
  const loading = /* your loading state */;
  useAutoLoading(loading, 'critical', 2000); // Blacksmith hammering

  return { data, loading, error };
}

// Nature Ambient Sounds
const { startNatureLoop, stopNatureLoop } = useAudioSystem();

// Start rolling rock ambient sounds
startNatureLoop('rocks'); // Every 25 minutes
// or wood forest sounds
startNatureLoop('wood'); // Every 30 minutes
stopNatureLoop('rocks');

// UI Wood Breaking Feedback
const { playUI } = useAudioSystem();

// Enhanced success with wood breaking sound
playUI('feedback', 'woodbreak'); // Breaking through barriers success
```

## Future Expansion

The selective approach allows for future additions:

- New ambient categories (seasonal themes, community events)
- Dynamic interval adjustment based on user activity
- Context-aware looping (quieter during focused work)
- Personalized ambient preferences

## Maintenance Notes

- **Monitor Usage**: Track which ambient sounds users actually enable
- **A/B Test Intervals**: Fine-tune loop frequencies based on user feedback
- **Content Refresh**: Periodically update ambient sounds to prevent staleness
- **Performance Audit**: Ensure looping doesn't impact app responsiveness
