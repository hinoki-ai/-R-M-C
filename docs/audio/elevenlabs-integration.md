# ElevenLabs Integration Guide

This guide provides instructions for integrating ElevenLabs text-to-speech API to generate classified audio content for the Pellines audio system.

## Prerequisites

1. ElevenLabs account with API access
2. API key from ElevenLabs dashboard
3. Node.js environment with access to ElevenLabs SDK

## Installation

```bash
npm install elevenlabs
# or
yarn add elevenlabs
```

## API Integration

### Basic Setup

```typescript
import { ElevenLabsAPI } from 'elevenlabs';

const elevenlabs = new ElevenLabsAPI({
  apiKey: process.env.ELEVENLABS_API_KEY,
});
```

### Voice Selection for Classification

Choose voices based on desired potency:

**Soft Potency (subtle, UI sounds):**

- Voice IDs: `21m00Tcm4TlvDq8ikWAM` (Rachel) or `AZnzlk1XvdvUeBnXmlld` (Domi)
- Stability: 0.8-0.9
- Similarity: 0.8-0.9

**Medium Potency (balanced, announcements):**

- Voice IDs: `29vD33N1CtxCmqQRPOHJ` (Drew) or `2EiwWnXFnvU5JabPnv8n` (Clyde)
- Stability: 0.7-0.8
- Similarity: 0.7-0.8

**Loud Potency (attention-grabbing, alerts):**

- Voice IDs: `pNInz6obpgDQGcFmaJgB` (Adam) or `21m00Tcm4TlvDq8ikWAM` (Rachel - higher energy)
- Stability: 0.5-0.7
- Similarity: 0.6-0.8

### Duration Control

Control audio duration through text length and speaking rate:

```typescript
const generateAudio = async (
  text: string,
  classification: AudioClassification
) => {
  const voiceSettings = {
    stability:
      classification.potency === 'soft'
        ? 0.85
        : classification.potency === 'medium'
          ? 0.75
          : 0.65,
    similarity_boost:
      classification.potency === 'soft'
        ? 0.85
        : classification.potency === 'medium'
          ? 0.75
          : 0.7,
    style: classification.potency === 'loud' ? 0.8 : 0.0,
    use_speaker_boost: classification.potency === 'loud',
  };

  // Adjust text length based on desired duration
  let processedText = text;
  if (classification.duration === 'short' && text.length > 50) {
    processedText = text.substring(0, 50) + '...';
  } else if (classification.duration === 'medium' && text.length > 150) {
    processedText = text.substring(0, 150) + '...';
  }

  return await elevenlabs.generate({
    voice: getVoiceForClassification(classification),
    text: processedText,
    model_id: 'eleven_monolingual_v1',
    voice_settings: voiceSettings,
  });
};
```

### CLI Usage for Batch Generation

Create a script for batch audio generation:

```bash
#!/bin/bash
# generate-audio.sh

TEXT="$1"
DURATION="$2"  # short|medium|long
POTENCY="$3"   # soft|medium|loud
OUTPUT_FILE="$4"

# Map classifications to ElevenLabs parameters
case $POTENCY in
  "soft")
    VOICE_ID="21m00Tcm4TlvDq8ikWAM"  # Rachel
    STABILITY="0.85"
    ;;
  "medium")
    VOICE_ID="29vD33N1CtxCmqQRPOHJ"  # Drew
    STABILITY="0.75"
    ;;
  "loud")
    VOICE_ID="pNInz6obpgDQGcFmaJgB"  # Adam
    STABILITY="0.65"
    ;;
esac

# Adjust text length based on duration
case $DURATION in
  "short")
    MAX_LENGTH=50
    ;;
  "medium")
    MAX_LENGTH=150
    ;;
  "long")
    MAX_LENGTH=500
    ;;
esac

# Truncate text if needed
if [ ${#TEXT} -gt $MAX_LENGTH ]; then
  TEXT="${TEXT:0:$MAX_LENGTH}..."
fi

# Generate audio using ElevenLabs CLI
elevenlabs generate \
  --voice-id "$VOICE_ID" \
  --text "$TEXT" \
  --output "$OUTPUT_FILE" \
  --stability "$STABILITY"
```

### Usage Examples

```bash
# Generate soft, short UI feedback
./generate-audio.sh "Success" short soft ui-success-new.mp3

# Generate medium potency welcome message
./generate-audio.sh "Welcome to Pellines community dashboard" medium medium welcome-medium-new.mp3

# Generate loud emergency alert
./generate-audio.sh "Emergency alert: Please evacuate immediately" short loud alert-emergency-new.mp3
```

## Integration with Existing Audio System

### Convex Function for Audio Generation

```typescript
// convex/audio-generation.ts
import { action } from './_generated/server';
import { v } from 'convex/values';
import { ElevenLabsAPI } from 'elevenlabs';

const elevenlabs = new ElevenLabsAPI({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export const generateClassifiedAudio = action({
  args: {
    text: v.string(),
    duration: v.union(
      v.literal('short'),
      v.literal('medium'),
      v.literal('long')
    ),
    potency: v.union(v.literal('soft'), v.literal('medium'), v.literal('loud')),
    category: v.union(v.literal('ui'), v.literal('voice'), v.literal('alert')),
    filename: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Generate audio with ElevenLabs
    const audioBuffer = await generateAudioWithClassification(args);

    // Store in Convex storage
    const storageId = await ctx.storage.store(audioBuffer);

    // Update audio mappings (you'd need to maintain a mapping table)
    await ctx.runMutation(internal.audioMappings.addAudioFile, {
      filename: args.filename,
      storageId,
      classification: {
        duration: args.duration,
        potency: args.potency,
        category: args.category,
      },
    });

    return null;
  },
});
```

## Best Practices

1. **Test Audio Quality**: Always test generated audio in context before deployment
2. **Voice Consistency**: Use the same voice for similar types of content
3. **Fallback System**: Maintain backup audio files for API failures
4. **Rate Limiting**: Respect ElevenLabs API limits and implement caching
5. **Accessibility**: Ensure generated audio meets WCAG guidelines for audio content

## Cost Optimization

- Generate audio once and cache results
- Use shorter text for frequently used sounds
- Batch generate similar content during development
- Monitor API usage and optimize text length

## Troubleshooting

**Audio too quiet/loud**: Adjust voice settings stability and similarity_boost
**Wrong duration**: Check text length limits and speaking rate
**Quality issues**: Try different voice IDs or adjust style parameter
**API errors**: Check API key, rate limits, and network connectivity
