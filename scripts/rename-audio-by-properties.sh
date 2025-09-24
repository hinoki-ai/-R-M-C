#!/bin/bash

# Rename Audio Files by Strength, Duration, and Loopability Properties
# Based on Pellines audio standardization guidelines

set -e

echo "🎵 Renaming Audio Files by Properties (Strength, Duration, Loopability)..."

cd public/audio

# Function to determine duration category based on file size
get_duration_category() {
    local size=$1
    if [ $size -le 16000 ]; then
        echo "short"
    elif [ $size -le 26000 ]; then
        echo "medium"
    elif [ $size -le 33000 ]; then
        echo "long"
    elif [ $size -le 40000 ]; then
        echo "extended"
    elif [ $size -le 85000 ]; then
        echo "very-long"
    else
        echo "ultra-long"
    fi
}

# Function to determine strength category based on sound type and size
get_strength_category() {
    local filename=$1
    local size=$2

    # Thunder sounds are always powerful
    if [[ $filename == *"powerful_thunder"* ]]; then
        echo "powerful"
    # Blacksmith sounds are strong
    elif [[ $filename == *"blacksmith"* ]] || [[ $filename == *"backsmith"* ]]; then
        echo "strong"
    # Large community sounds are medium-strong
    elif [[ $filename == *"this_is_a_comunity_w"* ]] && [ $size -gt 80000 ]; then
        echo "strong"
    # Medium community sounds are medium
    elif [[ $filename == *"this_is_a_comunity_w"* ]] && [ $size -gt 25000 ]; then
        echo "medium"
    # Small sounds are mild
    elif [ $size -le 16000 ] || [[ $filename == *"the_sound_of_little_"* ]]; then
        echo "mild"
    # Everything else is medium
    else
        echo "medium"
    fi
}

# Function to determine if sound is loopable
is_loopable() {
    local filename=$1

    # Critical loading sounds (blacksmith) - loopable
    if [[ $filename == *"blacksmith"* ]] || [[ $filename == *"backsmith"* ]]; then
        echo "true"
    # Nature ambient sounds - loopable
    elif [[ $filename == *"rolling_rock"* ]] || [[ $filename == *"wood_branches"* ]]; then
        echo "true"
    # Thunder can be ambient - loopable
    elif [[ $filename == *"powerful_thunder"* ]]; then
        echo "true"
    # Community sounds are announcements - not loopable
    elif [[ $filename == *"this_is_a_comunity_w"* ]]; then
        echo "false"
    # Little sounds are notifications - not loopable
    elif [[ $filename == *"the_sound_of_little_"* ]]; then
        echo "false"
    else
        echo "false"
    fi
}

# Function to get category and subcategory
get_category_info() {
    local filename=$1

    if [[ $filename == *"powerful_thunder"* ]]; then
        echo "ambient weather-thunder"
    elif [[ $filename == *"rolling_rock"* ]]; then
        echo "ambient nature-rock"
    elif [[ $filename == *"wood_branches"* ]]; then
        echo "ambient nature-wood"
    elif [[ $filename == *"blacksmith"* ]] || [[ $filename == *"backsmith"* ]]; then
        echo "loaders critical-blacksmith"
    elif [[ $filename == *"this_is_a_comunity_w"* ]]; then
        echo "community voice-wind"
    elif [[ $filename == *"the_sound_of_little_"* ]]; then
        echo "ui notifications-little"
    else
        echo "misc unknown"
    fi
}

# Process each sound file
counter_blacksmith=1
counter_rock=1
counter_wood=1
counter_thunder=1
counter_community_short=1
counter_community_medium=1
counter_community_long=1
counter_community_ultra=1
counter_ui_little=1

echo "🔄 Processing files..."

for file in *.mp3; do
    if [[ ! -f "$file" ]]; then
        continue
    fi

    # Get file size
    size=$(stat -c%s "$file")

    # Get properties
    duration=$(get_duration_category $size)
    strength=$(get_strength_category "$file" $size)
    loopable=$(is_loopable "$file")
    category_info=$(get_category_info "$file")
    category=$(echo $category_info | cut -d' ' -f1)
    subcategory=$(echo $category_info | cut -d' ' -f2)

    # Generate new name based on category and properties
    if [[ $category == "loaders" ]]; then
        # Critical loading - blacksmith hammering
        new_name="${category}-${subcategory}-${strength}-${duration}-$(printf "%02d" $counter_blacksmith).mp3"
        counter_blacksmith=$((counter_blacksmith + 1))
    elif [[ $category == "ambient" && $subcategory == "nature-rock" ]]; then
        # Nature rock ambient
        new_name="${category}-${subcategory}-${strength}-${duration}-$(printf "%02d" $counter_rock).mp3"
        counter_rock=$((counter_rock + 1))
    elif [[ $category == "ambient" && $subcategory == "nature-wood" ]]; then
        # Nature wood ambient
        new_name="${category}-${subcategory}-${strength}-${duration}-$(printf "%02d" $counter_wood).mp3"
        counter_wood=$((counter_wood + 1))
    elif [[ $category == "ambient" && $subcategory == "weather-thunder" ]]; then
        # Weather thunder
        new_name="${category}-${subcategory}-${strength}-${duration}-$(printf "%02d" $counter_thunder).mp3"
        counter_thunder=$((counter_thunder + 1))
    elif [[ $category == "community" ]]; then
        # Community voice - categorized by duration
        if [[ $duration == "short" ]]; then
            counter=$counter_community_short
            counter_community_short=$((counter_community_short + 1))
        elif [[ $duration == "medium" ]] || [[ $duration == "long" ]]; then
            counter=$counter_community_medium
            counter_community_medium=$((counter_community_medium + 1))
        elif [[ $duration == "extended" ]] || [[ $duration == "very-long" ]]; then
            counter=$counter_community_long
            counter_community_long=$((counter_community_long + 1))
        else
            counter=$counter_community_ultra
            counter_community_ultra=$((counter_community_ultra + 1))
        fi
        new_name="${category}-${subcategory}-${strength}-${duration}-$(printf "%02d" $counter).mp3"
    elif [[ $category == "ui" ]]; then
        # UI notifications
        new_name="${category}-${subcategory}-${strength}-${duration}-$(printf "%02d" $counter_ui_little).mp3"
        counter_ui_little=$((counter_ui_little + 1))
    else
        # Fallback
        new_name="${category}-${subcategory}-${strength}-${duration}-01.mp3"
    fi

    # Add loopable indicator if applicable
    if [[ $loopable == "true" ]]; then
        new_name="${new_name%.mp3}-loopable.mp3"
    fi

    echo "Renaming: $file -> $new_name"
    mv "$file" "$new_name"
done

echo ""
echo "✅ Property-based renaming complete!"
echo ""
echo "📊 Summary:"
echo "Loaders (critical blacksmith): $((counter_blacksmith - 1)) files"
echo "Ambient (nature rocks): $((counter_rock - 1)) files"
echo "Ambient (nature wood): $((counter_wood - 1)) files"
echo "Ambient (weather thunder): $((counter_thunder - 1)) files"
echo "Community (voice wind): $((counter_community_short + counter_community_medium + counter_community_long + counter_community_ultra - 4)) files"
echo "UI (notifications): $((counter_ui_little - 1)) files"