# Audio File Naming Standard

## Overview

All audio files in Pellines follow a standardized naming convention for consistency, maintainability, and automatic processing.

## Standard Format

```text
category-subtype-variation.mp3
```

### Components

- **category**: Primary classification (loader, impact, ambient, ui, community)
- **subtype**: Secondary classification (critical, smooth, success, nature, clicks)
- **variation**: Zero-padded number (01, 02, 03, etc.)

## Categories & Examples

### Loaders (Loading Sounds)

- **critical**: Blacksmith hammering for important operations
  - `loader-critical-blacksmith-01.mp3` through `loader-critical-blacksmith-17.mp3`
- **smooth**: Rolling rocks for gentle loading
  - `loader-smooth-rock-01.mp3` through `loader-smooth-rock-12.mp3`

### Impacts (Feedback Sounds)

- **success**: Wood breaking for achievements
  - `impact-success-wood-01.mp3` through `impact-success-wood-08.mp3`

### Ambient (Background Sounds)

- **nature-rock**: Rolling stones for nature atmosphere
  - `ambient-nature-rock-01.mp3` through `ambient-nature-rock-12.mp3`
- **nature-wood**: Forest wood sounds for ambient
  - `ambient-nature-wood-01.mp3` through `ambient-nature-wood-08.mp3`

### UI (Interface Sounds)

- **clicks**: Standard UI interactions
  - `click-primary.mp3`, `hover-accent.mp3`, etc.
- **feedback**: UI response sounds
  - `feedback-success.mp3`, `feedback-error.mp3`

### Community (Voice/Audio)

- **voice**: Human speech and announcements
  - `welcome-short-1.mp3`, `announce-general-1.mp3`, etc.

## Directory Structure

```text
public/audio/
├── loaders/
│   ├── critical/          # Blacksmith hammering sounds
│   └── smooth/           # Rolling rock loading sounds
├── impacts/
│   └── success/          # Wood breaking success sounds
├── ambient/
│   └── nature/
│       ├── rocks/        # Rolling rock ambient
│       └── wood/         # Wood forest ambient
├── ui/
│   └── clicks/           # UI interaction sounds
└── community/
    └── voice/            # Voice announcements
```

## Naming Rules

### ✅ Do's

- Use lowercase with hyphens: `loader-critical-blacksmith-01.mp3`
- Zero-pad variation numbers: `01`, `02`, not `1`, `2`
- Use descriptive, consistent terms
- Group related sounds in subdirectories
- Keep names under 50 characters

### ❌ Don'ts

- No timestamps: `blacksmith_metalic_s-#1-1758651535843.mp3` ❌
- No special characters: `rolling_rock_of_a_hi-#1.mp3` ❌
- No inconsistent casing: `Loader-Critical-Blacksmith-01.mp3` ❌
- No long descriptions: `wood_branches_tree_breaking_sound.mp3` ❌

## Migration History

### Before (Inconsistent)

- `backsmith_metalic_so-#1-1758651443041.mp3`
- `rolling_rock_of_a_hi-#2-1758651853853.mp3`
- `wood_branches_tree_b-#3-1758651757600.mp3`

### After (Standardized)

- `loader-critical-blacksmith-01.mp3`
- `loader-smooth-rock-07.mp3`
- `impact-success-wood-07.mp3`

## Automation

Use the standardization script for batch renaming:

```bash
# Standardize all audio files
./scripts/standardize-audio-names.sh
```

## Benefits

1. **Consistency**: Predictable naming across the entire system
2. **Maintainability**: Easy to understand and modify
3. **Automation**: Scripts can process files programmatically
4. **Organization**: Clear directory structure matches naming
5. **Scalability**: Easy to add new categories and variations

## Adding New Audio Files

1. Choose appropriate category and subtype
2. Place in correct directory
3. Use standardized naming: `category-subtype-variation.mp3`
4. Update audio system mappings
5. Test integration

## Tools

- **Standardization Script**: `scripts/standardize-audio-names.sh`
- **Validation**: Check naming with `find public/audio -name "*.mp3" | grep -v "standard pattern"`
- **Organization**: Directory structure matches naming convention
