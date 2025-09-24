#!/bin/bash

# Files to fix JSX structure
files=(
    "app/dashboard/admin/announcements/page.tsx"
    "app/dashboard/admin/calendar/page.tsx"
    "app/dashboard/admin/cameras/page.tsx"
    "app/dashboard/admin/contacts/page.tsx"
    "app/dashboard/admin/emergency-protocols/page.tsx"
    "app/dashboard/admin/rss/page.tsx"
    "app/dashboard/admin/weather/page.tsx"
    "app/dashboard/admin/radio/page.tsx"
)

for file in "${files[@]}"; do
    echo "Fixing JSX in $file..."

    # Replace the opening fragment with div
    sed -i 's/  return (/<div className='\''space-y-6'\''>/g' "$file"

    # Replace the closing fragment with closing div
    sed -i 's/  )$/    <\/div>\n  )/' "$file"

    echo "Fixed $file"
done

echo "JSX structure fixes completed."