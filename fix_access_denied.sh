#!/bin/bash

# Files to fix access denied return statements
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
    echo "Fixing access denied return in $file..."

    # Replace the malformed access denied return
    sed -i 's/  if (!isAdmin) {/  if (!isAdmin) {\n    return (/g' "$file"

    echo "Fixed $file"
done

echo "Access denied return fixes completed."