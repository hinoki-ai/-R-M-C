#!/bin/bash

# Files to fix
files=(
    "app/dashboard/photos/page.tsx"
    "app/dashboard/businesses/page.tsx"
    "app/dashboard/events/page.tsx"
    "app/dashboard/emergency-info/page.tsx"
    "app/dashboard/weather/page.tsx"
    "app/dashboard/contacts/page.tsx"
    "app/dashboard/admin/maintenance/page.tsx"
    "app/dashboard/admin/calendar/page.tsx"
    "app/dashboard/admin/emergency-protocols/page.tsx"
    "app/dashboard/admin/rss/page.tsx"
    "app/dashboard/admin/announcements/page.tsx"
    "app/dashboard/admin/weather/page.tsx"
    "app/dashboard/admin/cameras/page.tsx"
    "app/dashboard/admin/contacts/page.tsx"
    "app/dashboard/admin/projects/page.tsx"
    "app/dashboard/admin/radio/page.tsx"
    "app/dashboard/maps/page.tsx"
)

for file in "${files[@]}"; do
    echo "Fixing $file..."
    
    # Remove the import line
    sed -i '/import { DocumentDashboardLayout } from/d' "$file"
    
    # Remove the wrapper from return statements - this is complex, so let's do it manually for each file
    # For now, just remove the import and we'll handle the wrappers manually
done

echo "Script completed. Manual fixes needed for wrapper removal."
