#!/bin/bash

# Audio File Standardization Script for Pellines
# Converts all audio files to standardized naming convention:
# category-subtype-variation.mp3

set -e

echo "🔄 Standardizing audio file names..."

cd public/audio

# Function to rename files with counter
rename_files() {
    local dir="$1"
    local prefix="$2"
    local counter=1

    echo "📁 Processing $dir..."

    # Find and sort files to ensure consistent numbering
    find "$dir" -name "*.mp3" | sort | while read -r file; do
        # Extract just the filename
        filename=$(basename "$file")

        # Create new name with zero-padded counter
        new_name=$(printf "%s-%02d.mp3" "$prefix" $counter)

        # Full paths
        old_path="$file"
        new_path="$dir/$new_name"

        # Only rename if different
        if [ "$filename" != "$new_name" ]; then
            echo "  $filename → $new_name"
            mv "$old_path" "$new_path"
        fi

        counter=$((counter + 1))
    done
}

# Critical blacksmith loaders
rename_files "loaders/critical" "loader-critical-blacksmith"

# Smooth rolling rock loaders
rename_files "loaders/smooth" "loader-smooth-rock"

# Success wood impacts
rename_files "impacts/success" "impact-success-wood"

# Ambient nature rocks
rename_files "ambient/nature/rocks" "ambient-nature-rock"

# Ambient nature wood
rename_files "ambient/nature/wood" "ambient-nature-wood"

echo "✅ Audio file standardization complete!"
echo ""
echo "📊 Summary of changes:"
find . -name "*.mp3" | wc -l | xargs echo "Total audio files:"
echo ""
echo "🎯 Standardized naming convention:"
echo "  loader-critical-blacksmith-XX.mp3"
echo "  loader-smooth-rock-XX.mp3"
echo "  impact-success-wood-XX.mp3"
echo "  ambient-nature-rock-XX.mp3"
echo "  ambient-nature-wood-XX.mp3"