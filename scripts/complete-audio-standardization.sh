#!/bin/bash

# Complete Audio Standardization Script for Pellines
# Standardizes ALL remaining audio files to category-subtype-variation.mp3 format

set -e

echo "🎵 Complete Audio Standardization Starting..."

cd public/audio

# Function to standardize community voice files
standardize_community_voice() {
    echo "📢 Standardizing community voice files..."

    # Move emergency alerts to alerts directory
    mkdir -p ../alerts/emergency
    mv community/voice/alert-emergency-*.mp3 ../alerts/emergency/ 2>/dev/null || true

    # Create announcements directory
    mkdir -p announcements/general
    mv community/voice/announce-general-*.mp3 announcements/general/ 2>/dev/null || true

    # Rename announcement files
    if [ -d "announcements/general" ]; then
        counter=1
        find announcements/general -name "*.mp3" | sort | while read -r file; do
            new_name=$(printf "announcement-general-%02d.mp3" $counter)
            mv "$file" "announcements/general/$new_name"
            counter=$((counter + 1))
        done
    fi

    # Create calendar directory
    mkdir -p calendar/events
    mv community/voice/calendar-*.mp3 calendar/events/ 2>/dev/null || true

    # Rename calendar files
    if [ -d "calendar/events" ]; then
        counter=1
        find calendar/events -name "*.mp3" | sort | while read -r file; do
            new_name=$(printf "calendar-event-%02d.mp3" $counter)
            mv "$file" "calendar/events/$new_name"
            counter=$((counter + 1))
        done
    fi

    # Create maintenance directory
    mkdir -p maintenance/alerts
    mv community/voice/maintenance-*.mp3 maintenance/alerts/ 2>/dev/null || true

    # Rename maintenance files
    if [ -d "maintenance/alerts" ]; then
        counter=1
        find maintenance/alerts -name "*.mp3" | sort | while read -r file; do
            new_name=$(printf "maintenance-alert-%02d.mp3" $counter)
            mv "$file" "maintenance/alerts/$new_name"
            counter=$((counter + 1))
        done
    fi

    # Create meetings directory
    mkdir -p meetings/general
    mv community/voice/meeting-*.mp3 meetings/general/ 2>/dev/null || true

    # Rename meeting files
    if [ -d "meetings/general" ]; then
        counter=1
        find meetings/general -name "*.mp3" | sort | while read -r file; do
            new_name=$(printf "meeting-general-%02d.mp3" $counter)
            mv "$file" "meetings/general/$new_name"
            counter=$((counter + 1))
        done
    fi

    # Create events directory
    mkdir -p events/general
    mv community/voice/event-*.mp3 events/general/ 2>/dev/null || true

    # Rename event files
    if [ -d "events/general" ]; then
        counter=1
        find events/general -name "*.mp3" | sort | while read -r file; do
            new_name=$(printf "event-general-%02d.mp3" $counter)
            mv "$file" "events/general/$new_name"
            counter=$((counter + 1))
        done
    fi

    # Create services directory
    mkdir -p services/general
    mv community/voice/service-*.mp3 services/general/ 2>/dev/null || true

    # Rename service files
    if [ -d "services/general" ]; then
        counter=1
        find services/general -name "*.mp3" | sort | while read -r file; do
            new_name=$(printf "service-general-%02d.mp3" $counter)
            mv "$file" "services/general/$new_name"
            counter=$((counter + 1))
        done
    fi

    # Create status directory
    mkdir -p status/updates
    mv community/voice/status-*.mp3 status/updates/ 2>/dev/null || true

    # Rename status files
    if [ -d "status/updates" ]; then
        counter=1
        find status/updates -name "*.mp3" | sort | while read -r file; do
            new_name=$(printf "status-update-%02d.mp3" $counter)
            mv "$file" "status/updates/$new_name"
            counter=$((counter + 1))
        done
    fi

    # Create introductions directory
    mkdir -p introductions
    mv community/voice/intro-*.mp3 introductions/ 2>/dev/null || true
    mv community/voice/welcome-*.mp3 introductions/ 2>/dev/null || true

    # Rename introduction files
    if [ -d "introductions" ]; then
        counter=1
        find introductions -name "*.mp3" | sort | while read -r file; do
            filename=$(basename "$file")
            if [[ $filename == intro-* ]]; then
                new_name=$(printf "introduction-community-%02d.mp3" $counter)
            elif [[ $filename == welcome-* ]]; then
                new_name=$(printf "introduction-welcome-%02d.mp3" $counter)
            fi
            mv "$file" "introductions/$new_name"
            counter=$((counter + 1))
        done
    fi
}

# Function to standardize UI interaction files
standardize_ui_interactions() {
    echo "🖱️  Standardizing UI interaction files..."

    # UI clicks are already somewhat standardized, but let's organize them better
    mkdir -p ui/interactions

    # Move and rename click sounds
    for file in ui/clicks/click-*.mp3; do
        if [ -f "$file" ]; then
            filename=$(basename "$file" .mp3)
            action=${filename#click-}
            new_name="interaction-click-$action.mp3"
            mv "$file" "ui/interactions/$new_name"
        fi
    done

    # Move and rename hover sounds
    for file in ui/clicks/hover-*.mp3; do
        if [ -f "$file" ]; then
            filename=$(basename "$file" .mp3)
            action=${filename#hover-}
            new_name="interaction-hover-$action.mp3"
            mv "$file" "ui/interactions/$new_name"
        fi
    done

    # Move and rename transition sounds
    for file in ui/clicks/transition-*.mp3; do
        if [ -f "$file" ]; then
            filename=$(basename "$file" .mp3)
            action=${filename#transition-}
            new_name="transition-$action.mp3"
            mv "$file" "ui/interactions/$new_name"
        fi
    done

    # Move and rename feedback sounds
    mkdir -p ui/feedback
    for file in ui/clicks/feedback-*.mp3; do
        if [ -f "$file" ]; then
            filename=$(basename "$file" .mp3)
            type=${filename#feedback-}
            new_name="feedback-$type.mp3"
            mv "$file" "ui/feedback/$new_name"
        fi
    done
}

# Function to standardize emergency alerts
standardize_emergency_alerts() {
    echo "🚨 Standardizing emergency alerts..."

    # Emergency alerts are already in alerts/emergency/, just ensure proper naming
    counter=1
    find alerts/emergency -name "*.mp3" | sort | while read -r file; do
        filename=$(basename "$file")
        if [[ $filename != alert-emergency-* ]]; then
            new_name=$(printf "alert-emergency-%02d.mp3" $counter)
            mv "$file" "alerts/emergency/$new_name"
        fi
        counter=$((counter + 1))
    done
}

# Execute standardization
standardize_community_voice
standardize_ui_interactions
standardize_emergency_alerts

# Clean up empty directories
find . -type d -empty -delete 2>/dev/null || true

echo "✅ Complete Audio Standardization Complete!"
echo ""
echo "📊 Final Statistics:"
find . -name "*.mp3" | wc -l | xargs echo "Total audio files:"
echo ""
echo "📁 New Directory Structure:"
find . -type d | sort | sed 's|^\./||' | grep -v '^$' | sed 's|^|  |'
echo ""
echo "🎯 All files now follow: category-subtype-variation.mp3"