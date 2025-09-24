#!/bin/bash

# Files to fix fragment issues
files=(
    "app/dashboard/admin/calendar/page.tsx"
    "app/dashboard/admin/cameras/page.tsx"
    "app/dashboard/admin/emergency-protocols/page.tsx"
    "app/dashboard/admin/rss/page.tsx"
    "app/dashboard/admin/weather/page.tsx"
    "app/dashboard/admin/radio/page.tsx"
)

for file in "${files[@]}"; do
    echo "Removing fragments from $file..."

    # Remove the fragment tags
    sed -i 's/    <>\n      /    /g' "$file"
    sed -i 's/    <>\n    /    /g' "$file"
    sed -i 's/\n    <>//g' "$file"

    echo "Fixed $file"
done

echo "Fragment removal completed."