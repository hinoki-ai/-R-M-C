#!/bin/bash

# Files to fix remaining JSX issues
files=(
    "app/dashboard/admin/calendar/page.tsx"
    "app/dashboard/admin/cameras/page.tsx"
    "app/dashboard/admin/emergency-protocols/page.tsx"
    "app/dashboard/admin/rss/page.tsx"
    "app/dashboard/admin/weather/page.tsx"
    "app/dashboard/admin/radio/page.tsx"
)

for file in "${files[@]}"; do
    echo "Fixing remaining JSX in $file..."

    # Add return statement before the div
    sed -i 's/^<div className='\''space-y-6'\''>/  return (\n    <div className='\''space-y-6'\''>/g' "$file"

    # Remove any duplicate divs
    sed -i 's/<div className='\''space-y-6'\''>\n    <>/    </g' "$file"
    sed -i 's/<>\n      <div className='\''space-y-6'\''>/    <div className='\''space-y-6'\''>/g' "$file"

    echo "Fixed $file"
done

echo "Remaining JSX fixes completed."