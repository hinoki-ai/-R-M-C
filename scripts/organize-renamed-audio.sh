#!/bin/bash

# Organize Renamed Audio Files into Proper Directory Structure
# Based on Pellines audio standardization

set -e

echo "📁 Organizing renamed audio files into directory structure..."

cd public/audio

# Create necessary directories
mkdir -p loaders/critical
mkdir -p ambient/nature/rocks
mkdir -p ambient/nature/wood
mkdir -p ambient/weather
mkdir -p community/voice
mkdir -p ui/notifications

# Move files to appropriate directories
echo "Moving loader files..."
mv loaders-*.mp3 loaders/critical/ 2>/dev/null || true

echo "Moving ambient nature rock files..."
mv ambient-nature-rock-*.mp3 ambient/nature/rocks/ 2>/dev/null || true

echo "Moving ambient nature wood files..."
mv ambient-nature-wood-*.mp3 ambient/nature/wood/ 2>/dev/null || true

echo "Moving ambient weather files..."
mv ambient-weather-*.mp3 ambient/weather/ 2>/dev/null || true

echo "Moving community voice files..."
mv community-voice-*.mp3 community/voice/ 2>/dev/null || true

echo "Moving UI notification files..."
mv ui-notifications-*.mp3 ui/notifications/ 2>/dev/null || true

echo ""
echo "✅ Organization complete!"
echo ""
echo "📊 Final directory structure:"
find . -type d | sort | sed 's|^\./||' | grep -v '^$' | sed 's|^|  |'

echo ""
echo "📈 File counts by category:"
echo "Loaders (critical blacksmith): $(find loaders/critical -name "*.mp3" | wc -l) files"
echo "Ambient (nature rocks): $(find ambient/nature/rocks -name "*.mp3" | wc -l) files"
echo "Ambient (nature wood): $(find ambient/nature/wood -name "*.mp3" | wc -l) files"
echo "Ambient (weather thunder): $(find ambient/weather -name "*.mp3" | wc -l) files"
echo "Community (voice wind): $(find community/voice -name "*.mp3" | wc -l) files"
echo "UI (notifications): $(find ui/notifications -name "*.mp3" | wc -l) files"

echo ""
echo "🎵 All files now organized by strength, duration, and loopability properties!"