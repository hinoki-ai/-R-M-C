#!/bin/bash

# Audio File Standardization Script for Pinto Los Pellines

echo "🎵 Standardizing audio files for Pinto Los Pellines..."

# Create organized directories
mkdir -p public/audio/ui/clicks
mkdir -p public/audio/community/voice
mkdir -p public/audio/ambient

# Rename navigation/UI sounds (m1-m26.mp3) to descriptive names
echo "📁 Renaming navigation sounds..."
for i in {1..26}; do
    if [ -f "public/sounds/m${i}.mp3" ]; then
        # Create descriptive names based on typical UI sound patterns
        case $i in
            1|7|15|20) newname="ui-click-soft-${i}.mp3" ;;
            2|8|16|21) newname="ui-click-medium-${i}.mp3" ;;
            3|9|17|22) newname="ui-click-sharp-${i}.mp3" ;;
            4|10|18|23) newname="ui-hover-${i}.mp3" ;;
            5|11|19|24) newname="ui-transition-${i}.mp3" ;;
            6|12|13|14|25|26) newname="ui-feedback-${i}.mp3" ;;
        esac
        cp "public/sounds/m${i}.mp3" "public/audio/ui/clicks/${newname}"
        echo "  ✓ m${i}.mp3 → ${newname}"
    fi
done

# Rename community voice files to organized structure
echo "🎤 Renaming community voice recordings..."
counter=1
for file in public/sounds/this_is_a_comunity_w*.mp3; do
    if [ -f "$file" ]; then
        # Extract timestamp and variant info
        filename=$(basename "$file" .mp3)
        
        # Determine voice variant (#1, #2, #3) or main
        if [[ $filename == *"#"* ]]; then
            variant=$(echo $filename | grep -o "#[0-9]" | tr -d "#")
            voice="voice-${variant}"
        else
            voice="voice-main"
        fi
        
        # Create sequential naming
        newname="community-${voice}-${counter}.mp3"
        cp "$file" "public/audio/community/voice/${newname}"
        echo "  ✓ ${filename}.mp3 → ${newname}"
        ((counter++))
    fi
done

echo "✅ Audio file standardization complete!"
echo ""
echo "📊 Summary:"
echo "  UI Sounds: $(ls public/audio/ui/clicks/*.mp3 2>/dev/null | wc -l) files"
echo "  Community Voice: $(ls public/audio/community/voice/*.mp3 2>/dev/null | wc -l) files"
echo ""
echo "🎯 Next steps:"
echo "  1. Test UI sounds in useNavigationSound hook"
echo "  2. Implement community voice usage in relevant pages"
echo "  3. Update any hardcoded audio references"
