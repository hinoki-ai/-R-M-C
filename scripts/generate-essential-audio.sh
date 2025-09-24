#!/bin/bash

# Generate Essential Audio Files for Pellines
# Creates basic beep sounds for missing critical audio files

set -e

echo "🔊 Generating essential audio files..."

cd public/audio

# Function to generate beep sound
generate_beep() {
    local output_file="$1"
    local frequency="$2"
    local duration="$3"
    local volume="${4:-0.5}"

    echo "  📢 Generating: $output_file"

    # Generate sine wave beep with simple fade
    ffmpeg -f lavfi -i "sine=frequency=${frequency}:duration=${duration}" \
           -af "volume=${volume},afade=t=0.05:st=0:d=0.05" \
           -c:a libmp3lame -q:a 2 \
           "$output_file" -y >/dev/null 2>&1
}

# Emergency Alerts - Loud, urgent beeps
echo "🚨 Generating emergency alerts..."
mkdir -p alerts/emergency
generate_beep "alerts/emergency/alert-emergency-1.mp3" 800 0.8 0.9
generate_beep "alerts/emergency/alert-emergency-2.mp3" 1000 0.6 0.9

# UI Clicks - Soft, short beeps
echo "🖱️ Generating UI click sounds..."
mkdir -p ui/clicks

# Different frequencies for different click types
generate_beep "ui/clicks/click-primary.mp3" 600 0.1 0.3
generate_beep "ui/clicks/click-secondary.mp3" 500 0.1 0.25
generate_beep "ui/clicks/click-accent.mp3" 700 0.1 0.35
generate_beep "ui/clicks/click-action.mp3" 650 0.12 0.4
generate_beep "ui/clicks/click-confirm.mp3" 750 0.15 0.5
generate_beep "ui/clicks/click-cancel.mp3" 450 0.1 0.3
generate_beep "ui/clicks/click-submit.mp3" 800 0.12 0.4
generate_beep "ui/clicks/click-delete.mp3" 400 0.08 0.25
generate_beep "ui/clicks/click-success.mp3" 900 0.15 0.6
generate_beep "ui/clicks/click-warning.mp3" 550 0.12 0.4
generate_beep "ui/clicks/click-error.mp3" 350 0.1 0.3
generate_beep "ui/clicks/click-navigation.mp3" 680 0.1 0.35

# Hover sounds - even softer
generate_beep "ui/clicks/hover-primary.mp3" 600 0.05 0.15
generate_beep "ui/clicks/hover-secondary.mp3" 500 0.05 0.12
generate_beep "ui/clicks/hover-accent.mp3" 700 0.05 0.18
generate_beep "ui/clicks/hover-interactive.mp3" 650 0.06 0.2

# Transition sounds
generate_beep "ui/clicks/transition-page.mp3" 300 0.2 0.25
generate_beep "ui/clicks/transition-modal.mp3" 350 0.18 0.3
generate_beep "ui/clicks/transition-panel.mp3" 400 0.15 0.28
generate_beep "ui/clicks/transition-loading.mp3" 250 0.3 0.35

# UI Feedback sounds
mkdir -p ui/feedback
generate_beep "ui/feedback/feedback-success.mp3" 900 0.2 0.6
generate_beep "ui/feedback/feedback-info.mp3" 600 0.15 0.4
generate_beep "ui/feedback/feedback-warning.mp3" 550 0.18 0.45
generate_beep "ui/feedback/feedback-error.mp3" 350 0.2 0.5
generate_beep "ui/feedback/feedback-info-alt.mp3" 650 0.12 0.35
generate_beep "ui/feedback/feedback-info-extra.mp3" 700 0.1 0.3

# UI Interactions
mkdir -p ui/interactions
# Copy click sounds to interactions directory for compatibility
cp ui/clicks/click-*.mp3 ui/interactions/
cp ui/clicks/hover-*.mp3 ui/interactions/
cp ui/clicks/transition-*.mp3 ui/interactions/

echo "✅ Essential audio files generated!"
echo ""
echo "📊 Generated files:"
find alerts/emergency ui/clicks ui/feedback ui/interactions -name "*.mp3" | wc -l | xargs echo "Total new audio files:"
echo ""
echo "🎵 Audio categories created:"
echo "  🚨 Emergency alerts: High-priority alarm sounds"
echo "  🖱️ UI clicks: Interactive feedback sounds"
echo "  💬 UI feedback: Status notification sounds"
echo "  🔄 UI interactions: Comprehensive interaction set"